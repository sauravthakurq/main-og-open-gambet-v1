import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import { useErrorStore } from '@/store/useErrorStore';

export function useAIGameLoop(aiColor: 'w' | 'b' = 'b') {
  const { turn, fen, makeMove, history, isCheckmate, game, gameId } = useGameStore();
  const { engineType, provider, model, apiKeys, baseUrls, organizations, temperatures, maxTokens, isConnected } = useAISettingsStore();
  const { engineInfo, addBestMoveListener, removeBestMoveListener, setIsThinking, playComputerMove, setConnectionState, recordResponseTime, setAbortController, retryCount } = useEngineStore();
  const { appState, matchConfig, isPaused } = useAppStore();
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track the gameId that was active when the current fetch started
  // so we can detect if a restart happened mid-flight
  const fetchingGameIdRef = useRef<string | null>(null);

  // When the game is restarted, gameId changes. Reset the fetching guard immediately
  // so the new game's AI loop is not blocked by the previous game's in-flight request.
  useEffect(() => {
    // Abort any in-flight request from the old game
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isFetchingRef.current = false;
    fetchingGameIdRef.current = null;
  }, [gameId]);

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
      fetchingGameIdRef.current = gameId;  // Snapshot gameId at start of this fetch
      setIsThinking(true);
      setConnectionState('Connecting');
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setAbortController(controller);

      try {
        // ALWAYS fetch fresh credentials from the store, bypassing React closure
        const currentSettings = useAISettingsStore.getState();
        const activeProvider = currentSettings.provider;
        const activeModel = currentSettings.model;
        const providerKeys = currentSettings.apiKeys[activeProvider]?.filter(k => k.enabled && k.key.trim().length > 0) || [];
        const baseUrl = currentSettings.baseUrls[activeProvider];
        const organization = currentSettings.organizations[activeProvider];
        const temperature = currentSettings.temperatures[activeProvider];
        const maxToken = currentSettings.maxTokens[activeProvider];
        
        if (providerKeys.length === 0 && activeProvider !== 'Ollama' && activeProvider !== 'LM Studio') {
          console.error('No enabled API keys provided for', activeProvider);
          setConnectionState('Invalid API Key');
          useErrorStore.getState().dispatchError({
            category: 'Authentication',
            title: 'No API Key Found',
            message: `Please add and enable at least one API key for ${activeProvider} in the settings.`,
            developerDetails: { provider: activeProvider, internalErrorType: 'MissingKey', timestamp: new Date().toISOString() },
            actions: [{ label: 'Dismiss', onClick: () => {} }]
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
          
          const attemptController = new AbortController();
          const onGlobalAbort = () => attemptController.abort();
          abortControllerRef.current?.signal.addEventListener('abort', onGlobalAbort);
          
          const timeoutId = setTimeout(() => {
            attemptController.abort(new Error('TimeoutError'));
          }, 15000);

          try {
            const currentApiKey = providerKeys.length > 0 ? providerKeys[currentKeyIndex].key : '';
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: attemptController.signal,
              body: JSON.stringify({
                provider: activeProvider,
                model: activeModel,
                apiKey: currentApiKey,
                baseUrl,
                organization,
                temperature,
                maxTokens: maxToken,
                prompt: `FEN: ${fen}\nPGN History: ${history.map(m => m.san).join(' ')}\nLegal Moves: ${legalMoves.join(', ')}\n${errorPrompt}`
              })
            });

            clearTimeout(timeoutId);
            abortControllerRef.current?.signal.removeEventListener('abort', onGlobalAbort);

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
              useAISettingsStore.getState().setIsConnected(false);
              useErrorStore.getState().dispatchError({
                category: 'Authentication',
                title: 'Invalid or Expired API Key',
                message: `Authentication failed. The API key for ${activeProvider} was rejected by the provider.`,
                developerDetails: {
                  provider: activeProvider,
                  model: activeModel,
                  endpoint: baseUrl,
                  httpStatus: 401,
                  timestamp: new Date().toISOString()
                },
                actions: [{ label: 'Update API Key', primary: true, onClick: () => {} }, { label: 'Dismiss', onClick: () => {} }]
              });
              throw new Error('Invalid API Key');
            }

            if (response.status === 400 || response.status === 404) {
              setConnectionState('API Error');
              useErrorStore.getState().dispatchError({
                category: 'AI',
                title: 'Unsupported Model',
                message: `The provider ${activeProvider} does not support the model '${activeModel}' or your API key lacks access to it.`,
                developerDetails: { provider: activeProvider, model: activeModel, endpoint: baseUrl, httpStatus: response.status, timestamp: new Date().toISOString() },
                actions: [{ label: 'Dismiss', onClick: () => {} }]
              });
              throw new Error('Invalid Model');
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
              // Verify game hasn't been restarted while we were fetching
              if (useGameStore.getState().gameId !== fetchingGameIdRef.current) {
                console.log('[AI Game Loop] Game restarted during fetch. Discarding move.');
                success = true;
                break;
              }

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
            clearTimeout(timeoutId);
            abortControllerRef.current?.signal.removeEventListener('abort', onGlobalAbort);

            // Handle user pause or game restart
            if (err.name === 'AbortError' && !err.message?.includes('TimeoutError')) {
              console.log('[AI Game Loop] Request aborted due to pause or restart.');
              setConnectionState('Cancelled');
              success = true; // Break loop gracefully
              break;
            }

            if (err.message === 'Invalid API Key' || err.message === 'Invalid Model') {
              success = true; // Break loop gracefully without retrying
              break; 
            }

            const isTimeout = err.message?.includes('TimeoutError') || err.message?.includes('Timeout') || err.message?.includes('fetch') || err.name === 'TypeError';
            
            if (!navigator.onLine) {
              setConnectionState('Network Offline');
              if (attempts >= 3) {
                useErrorStore.getState().dispatchError({
                  category: 'Network',
                  title: 'Network Offline',
                  message: 'Your internet connection was lost while attempting to contact the AI provider.',
                  developerDetails: { provider: activeProvider, internalErrorType: 'Offline', timestamp: new Date().toISOString() },
                  actions: [{ label: 'Dismiss', onClick: () => {} }]
                });
              }
            } else if (isTimeout) {
              setConnectionState('Timeout');
              if (attempts >= 3) {
                useErrorStore.getState().dispatchError({
                  category: 'Network',
                  title: 'Connection Timeout',
                  message: `The AI request timed out after 15 seconds. The provider (${activeProvider}) might be overloaded.`,
                  developerDetails: { provider: activeProvider, model: activeModel, endpoint: baseUrl, internalErrorType: 'FetchTimeout', timestamp: new Date().toISOString(), errorCode: err.message },
                  actions: [{ label: 'Retry', primary: true, onClick: () => {} }, { label: 'Dismiss', onClick: () => {} }]
                });
              } else {
                setConnectionState('Retrying...');
              }
            } else if (attempts >= 3) {
              setConnectionState('API Error');
              useErrorStore.getState().dispatchError({
                category: 'AI',
                title: 'AI Generation Failed',
                message: err.message || `Something went wrong while contacting ${activeProvider}.`,
                developerDetails: { provider: activeProvider, model: activeModel, endpoint: baseUrl, internalErrorType: 'APIError', timestamp: new Date().toISOString(), errorCode: err.message },
                actions: [{ label: 'Change Provider', primary: true, onClick: () => {} }, { label: 'Dismiss', onClick: () => {} }]
              });
            }
            
            console.error('API loop error on attempt', attempts, err);
            errorPrompt = `\nPrevious attempt failed. Please evaluate the board again and return exactly one UCI move string.`;
            
            if (attempts >= 3) {
              break;
            }

            // Exponential Backoff: Retry #1 (500ms), Retry #2 (1000ms)
            if (isFetchingRef.current) {
              const backoffDelay = attempts === 1 ? 500 : 1000;
              console.log(`[AI Game Loop] Retrying request in ${backoffDelay}ms (Attempt ${attempts + 1}/3)...`);
              await new Promise(r => setTimeout(r, backoffDelay));
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

    // Cleanup function: If dependencies change (e.g., API key updated), abort the stale request.
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isFetchingRef.current = false;
      setIsThinking(false);
    };
  }, [appState, isPaused, engineType, turn, aiColor, fen, history, isCheckmate, provider, model, apiKeys, baseUrls, organizations, temperatures, maxTokens, isConnected, makeMove, setIsThinking, retryCount, gameId]);
}
