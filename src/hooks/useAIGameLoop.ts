import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';

export function useAIGameLoop(aiColor: 'w' | 'b' = 'b') {
  const { turn, fen, makeMove, history, isCheckmate, game } = useGameStore();
  const { engineType, provider, model, apiKeys, baseUrls, organizations, temperatures, maxTokens, isConnected } = useAISettingsStore();
  const { engineInfo, addBestMoveListener, removeBestMoveListener, setIsThinking, playComputerMove, setConnectionState, recordResponseTime, setAbortController, retryCount } = useEngineStore();
  const { appState, matchConfig, isPaused } = useAppStore();
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle local engine move
  useEffect(() => {
    if (appState !== 'playing' || matchConfig.opponentType === 'aivsai' || engineType !== 'local' || turn !== aiColor || isCheckmate || !fen || isPaused) return;

    // Start thinking after a slight natural delay
    const playLocalMove = () => {
      const difficulty = matchConfig.difficulty || 'intermediate';
      playComputerMove(fen, difficulty);
    };
    
    const timer = setTimeout(playLocalMove, 50);

    const handleLocalMove = (bestMove: string) => {
      const source = bestMove.substring(0, 2);
      const target = bestMove.substring(2, 4);
      const promotion = bestMove.length > 4 ? bestMove.charAt(4) : undefined;
      makeMove(source, target, promotion);
    };

    addBestMoveListener(handleLocalMove);
    return () => {
      clearTimeout(timer);
      removeBestMoveListener(handleLocalMove);
    };
  }, [appState, engineType, turn, aiColor, fen, isCheckmate, matchConfig.difficulty, addBestMoveListener, removeBestMoveListener, makeMove, playComputerMove]);

  // Handle cloud engine move
  useEffect(() => {
    if (appState !== 'playing' || matchConfig.opponentType === 'aivsai' || engineType !== 'cloud' || turn !== aiColor || isCheckmate || isFetchingRef.current || !isConnected) return;

    if (isPaused) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    const playCloudMove = async () => {
      isFetchingRef.current = true;
      setIsThinking(true);
      setConnectionState('Connecting');
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setAbortController(controller);

      try {
        const providerKeys = apiKeys[provider]?.filter(k => k.enabled && k.key.trim().length > 0) || [];
        const baseUrl = baseUrls[provider];
        const organization = organizations[provider];
        const temperature = temperatures[provider];
        const maxToken = maxTokens[provider];
        
        if (providerKeys.length === 0 && provider !== 'Ollama' && provider !== 'LM Studio') {
          console.error('No enabled API keys provided for', provider);
          setConnectionState('Invalid API Key');
          useToastStore.getState().addToast({
            type: 'error',
            title: 'No API Key',
            message: `Please add and enable at least one API key for ${provider} in the settings.`,
          });
          isFetchingRef.current = false;
          setIsThinking(false);
          return;
        }

        const legalMoves = game.moves({ verbose: true }).map(m => m.from + m.to + (m.promotion || ''));
        let attempts = 0;
        let success = false;
        let errorPrompt = '';
        let currentKeyIndex = 0;

          while (attempts < 3 && !success && isFetchingRef.current) {
          attempts++;
          const startTime = performance.now();
          try {
            const currentApiKey = providerKeys.length > 0 ? providerKeys[currentKeyIndex].key : '';
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: abortControllerRef.current?.signal,
              body: JSON.stringify({
                provider,
                model,
                apiKey: currentApiKey,
                baseUrl,
                organization,
                temperature,
                maxTokens: maxToken,
                prompt: `FEN: ${fen}\nPGN History: ${history.map(m => m.san).join(' ')}\nLegal Moves: ${legalMoves.join(', ')}\n${errorPrompt}`
              })
            });

            // Rate limited — try next key if available, else wait and retry
            if (response.status === 429) {
              setConnectionState('Rate Limited');
              if (currentKeyIndex < providerKeys.length - 1) {
                currentKeyIndex++;
                console.warn(`[AI Game Loop] Rate limited. Switching to backup API key...`);
                useToastStore.getState().addToast({
                  type: 'warning',
                  title: 'Switching API Key',
                  message: `Rate limit hit. Automatically switching to backup key for ${provider}.`,
                  duration: 3000,
                });
                attempts--; // Don't count as failure
                continue;
              }

              const data = await response.json().catch(() => ({}));
              const waitMs = data.retryAfterMs ?? 30000;
              console.warn(`[AI Game Loop] Rate limited on all keys. Waiting ${waitMs}ms...`);
              
              useToastStore.getState().addToast({
                type: 'warning',
                title: 'Rate Limited',
                message: `All keys rate limited. Waiting ${(waitMs / 1000).toFixed(1)}s before retrying.`,
                duration: waitMs,
              });

              await new Promise(r => setTimeout(r, waitMs));
              setConnectionState('Connecting');
              attempts--; // don't count this as a real attempt
              continue;
            }

            if (response.status === 401) {
              setConnectionState('Invalid API Key');
              throw new Error('Invalid API Key');
            }

            if (!response.ok) {
              setConnectionState('API Error');
              throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const endTime = performance.now();
            recordResponseTime(endTime - startTime);
            setConnectionState('Connected');
            
            if (data.bestMove) {
              const move = data.bestMove;
              if (legalMoves.includes(move)) {
                const source = move.substring(0, 2);
                const target = move.substring(2, 4);
                const promotion = move.length > 4 ? move.charAt(4) : undefined;
                
                const moveResult = makeMove(source, target, promotion);
                if (moveResult) {
                  success = true;
                  break;
                } else {
                  errorPrompt = `\nYour previous move '${move}' failed to execute on the board. Please try another move from the Legal Moves list.`;
                }
              } else {
                errorPrompt = `\nYour previous move '${move}' is ILLEGAL. You MUST choose exactly one string from this list: ${legalMoves.join(', ')}`;
              }
            } else {
              errorPrompt = `\nYour previous response was empty or malformed. You MUST return exactly one UCI string (e.g., 'e2e4').`;
            }
          } catch (err: any) {
            if (err.name === 'AbortError') {
              console.log('[AI Game Loop] Request aborted due to pause.');
              setConnectionState('Cancelled');
              success = true; // Break loop gracefully
              break;
            }
            if (err.message === 'Invalid API Key') {
              break; // Don't retry auth errors
            }
            if (!navigator.onLine) {
              setConnectionState('Network Offline');
            } else if (err.message.includes('Timeout') || err.message.includes('fetch')) {
              setConnectionState('Timeout');
            }
            
            console.error('API loop error on attempt', attempts, err);
            errorPrompt = `\nPrevious attempt failed. Please evaluate the board again and return exactly one UCI move string.`;
            if (attempts >= 3) {
              setConnectionState('API Error');
              break;
            }
          }
        }
      } catch (err) {
        console.error('API error:', err);
      } finally {
        isFetchingRef.current = false;
        setIsThinking(false);
        abortControllerRef.current = null;
        setAbortController(null);
      }
    };

    playCloudMove();
  }, [appState, isPaused, engineType, turn, aiColor, fen, history, isCheckmate, provider, model, apiKeys, baseUrls, organizations, temperatures, maxTokens, isConnected, makeMove, setIsThinking, retryCount]);
}
