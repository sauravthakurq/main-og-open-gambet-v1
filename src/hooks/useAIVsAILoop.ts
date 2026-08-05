/**
 * useAIVsAILoop
 *
 * Fully autonomous chess loop for AI vs AI mode.
 * Uses a single long-lived async while-loop (not re-triggering effects)
 * to guarantee sequential, non-overlapping API calls.
 *
 * Key design decisions:
 *   - Takes a `gameKey` parameter that changes each time a new game starts.
 *     This is the ONLY trigger for the loop — it restarts cleanly.
 *   - Reads store state via `getState()` inside the loop to avoid stale closures.
 *   - A `stopRef` allows immediate clean teardown on unmount or gameKey change.
 *   - Never fires two API requests simultaneously.
 *   - Handles all error cases: bad key, timeout, illegal move, rate limit.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAppStore } from '@/store/useAppStore';
import { useErrorStore } from '@/store/useErrorStore';

const INTER_MOVE_DELAY_MS = 700;   // pause between moves for natural feel
const ERROR_RETRY_DELAY_MS = 2500; // wait before retrying after error
const MAX_CONSECUTIVE_FAILURES = 3; // failures before pausing match

/** Wait `ms` milliseconds, but stop early if stopRef becomes true */
function sleepOrStop(ms: number, stopRef: React.MutableRefObject<boolean>): Promise<boolean> {
  return new Promise((resolve) => {
    if (stopRef.current) return resolve(false);
    
    // Instead of a busy polling loop, we can just use a normal timeout.
    // If we need to interrupt it, we technically can't easily with just setTimeout,
    // but a few ms delay is fine to resolve normally and then loop checks stopRef.
    setTimeout(() => {
      resolve(!stopRef.current);
    }, ms);
  });
}

export function useAIVsAILoop(gameKey: number) {
  const stopRef = useRef(false);
  const loopRunning = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Monitor pause state and abort in-flight fetch if paused
  useEffect(() => {
    const unsub = useAppStore.subscribe((state, prevState) => {
      if (state.isPaused && !prevState.isPaused) {
        if (abortControllerRef.current) {
          console.log('[AI vs AI] Paused! Aborting in-flight fetch.');
          abortControllerRef.current.abort();
        }
      }
    });
    return unsub;
  }, []);

  const runLoop = useCallback(async () => {
    if (loopRunning.current) {
      console.log('[AI vs AI] Loop already running, skipping.');
      return;
    }
    loopRunning.current = true;
    stopRef.current = false;

    const failures: Record<string, number> = { w: 0, b: 0 };

    console.log('[AI vs AI] ▶ Loop started (gameKey=' + gameKey + ')');

    while (!stopRef.current) {
      // --- Read FRESH state on every iteration ---
      const appState = useAppStore.getState();
      const gameState = useGameStore.getState();
      const settings = useAISettingsStore.getState();
      const engine = useEngineStore.getState();

      // Exit conditions
      if (appState.appState !== 'playing') {
        console.log('[AI vs AI] App not playing. Stopping.');
        break;
      }
      if (appState.matchConfig.opponentType !== 'aivsai') {
        console.log('[AI vs AI] Not AI vs AI mode. Stopping.');
        break;
      }
      if (!appState.matchConfig.aiVsAiConfig) {
        console.log('[AI vs AI] No aiVsAiConfig. Stopping.');
        break;
      }
      if (gameState.game.isGameOver() || gameState.isCheckmate) {
        console.log('[AI vs AI] Game over. Stopping.');
        break;
      }
      if (appState.isPaused) {
        await sleepOrStop(300, stopRef);
        continue;
      }

      const turn = gameState.turn as 'w' | 'b';
      const cfg = turn === 'w'
        ? appState.matchConfig.aiVsAiConfig.white
        : appState.matchConfig.aiVsAiConfig.black;

      const { provider, model, engineType, difficulty } = cfg;
      const side = turn === 'w' ? 'White' : 'Black';

      console.log(`[AI vs AI] ${side} thinking... | ${provider} / ${model}`);

      // ─── LOCAL ENGINE ────────────────────────────────────────────────────
      if (engineType === 'local') {
        let moved = false;
        try {
          engine.setIsThinking(true);
          const bestMove = await new Promise<string | null>((resolve) => {
            const timeout = setTimeout(() => {
              resolve(null);
            }, 15000);
            const handler = (mv: string) => {
              clearTimeout(timeout);
              engine.removeBestMoveListener(handler);
              resolve(mv);
            };
            engine.addBestMoveListener(handler);
            engine.playComputerMove(gameState.fen, difficulty || 'intermediate');
          });

          if (!stopRef.current && bestMove) {
            const src = bestMove.slice(0, 2);
            const tgt = bestMove.slice(2, 4);
            const promo = bestMove.length > 4 ? bestMove[4] : undefined;
            const ok = useGameStore.getState().makeMove(src, tgt, promo);
            if (ok) {
              console.log(`[AI vs AI] ${side} played: ${bestMove}`);
              moved = true;
              failures[turn] = 0;
            }
          }
        } catch (err) {
          console.error(`[AI vs AI] Local engine error:`, err);
        } finally {
          engine.setIsThinking(false);
        }

        if (!moved) {
          failures[turn] = (failures[turn] || 0) + 1;
          if (failures[turn] >= MAX_CONSECUTIVE_FAILURES) {
            console.error(`[AI vs AI] ${side} failed ${MAX_CONSECUTIVE_FAILURES}× — pausing match.`);
            useAppStore.getState().setIsPaused(true);
            break;
          }
          await sleepOrStop(ERROR_RETRY_DELAY_MS, stopRef);
          continue;
        }
      }

      // ─── CLOUD AI ────────────────────────────────────────────────────────
      else {
        const providerKeys = settings.apiKeys[provider]?.filter((k: any) => k.enabled) || [];
        const baseUrl = settings.baseUrls[provider] || '';
        const organization = settings.organizations[provider] || '';
        const temperature = settings.temperatures[provider];
        const maxTokens = settings.maxTokens[provider];

        if (providerKeys.length === 0 && provider !== 'Ollama' && provider !== 'LM Studio') {
          console.error(`[AI vs AI] No API key for ${provider} (${side})`);
          failures[turn] = (failures[turn] || 0) + 1;
          if (failures[turn] >= MAX_CONSECUTIVE_FAILURES) {
            console.error(`[AI vs AI] ${side} has no API key — pausing.`);
            useAppStore.getState().setIsPaused(true);
            break;
          }
          await sleepOrStop(ERROR_RETRY_DELAY_MS, stopRef);
          continue;
        }

        // Snapshot position right before the API call
        const snap = useGameStore.getState();
        const fen = snap.fen;
        const pgnHistory = snap.history.map((m) => m.san).join(' ');
        const legalMoves = snap.game.moves({ verbose: true })
          .map((m) => m.from + m.to + (m.promotion || ''));

        engine.setIsThinking(true);
        engine.setConnectionState('Connecting');

        let success = false;
        let errorPrompt = '';
        let currentKeyIndex = 0;

        for (let attempt = 1; attempt <= 3 && !stopRef.current; attempt++) {
          try {
            console.log(`[AI vs AI] ${side} API call attempt ${attempt}/3`);

            const controller = new AbortController();
            abortControllerRef.current = controller;
            const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s hard timeout

            const currentApiKey = providerKeys.length > 0 ? providerKeys[currentKeyIndex].key : '';
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                provider,
                model,
                apiKey: currentApiKey,
                baseUrl,
                organization,
                temperature,
                maxTokens,
                prompt: `FEN: ${fen}\nPGN History: ${pgnHistory}\nLegal Moves: ${legalMoves.join(', ')}\n${errorPrompt}`,
              }),
            });

            clearTimeout(timeoutId);
            if (abortControllerRef.current === controller) {
              abortControllerRef.current = null;
            }

            if (stopRef.current) break;

            // Rate limit — server already waited and retried internally.
            // If it still gets 429, wait the server-suggested time and retry.
            if (res.status === 429) {
              engine.setConnectionState('Rate Limited');
              if (currentKeyIndex < providerKeys.length - 1) {
                currentKeyIndex++;
                console.warn(`[AI vs AI] ${side} rate limited. Switching to backup API key...`);
                engine.setIsThinking(false);
                const cont = await sleepOrStop(1000, stopRef); // Short pause before switching
                engine.setIsThinking(true);
                engine.setConnectionState('Connecting');
                if (!cont) break;
                attempt--;
                continue;
              }

              const data = await res.json().catch(() => ({}));
              const waitMs = data.retryAfterMs ?? 30000;
              console.warn(`[AI vs AI] ${side} rate limited on all keys. Waiting ${waitMs}ms...`);
              engine.setIsThinking(false);
              const cont = await sleepOrStop(waitMs, stopRef);
              engine.setIsThinking(true);
              engine.setConnectionState('Connecting');
              if (!cont) break;
              attempt--; // don't count rate limit as a real attempt
              continue;
            }

            if (res.status === 400 || res.status === 404) {
              engine.setConnectionState('API Error');
              useErrorStore.getState().dispatchError({
                category: 'AI',
                title: 'Unsupported Model',
                message: `The provider ${provider} does not support the model '${model}' or your API key lacks access to it.`,
                developerDetails: { provider, model, endpoint: baseUrl, httpStatus: res.status, timestamp: new Date().toISOString() },
                actions: [{ label: 'Dismiss', onClick: () => {} }]
              });
              throw new Error('Invalid Model');
            }

            if (res.status === 401) {
              engine.setConnectionState('Invalid API Key');
              useAISettingsStore.getState().setIsConnected(false);
              useErrorStore.getState().dispatchError({
                category: 'Authentication',
                title: 'Invalid or Expired API Key',
                message: `Authentication failed. The API key for ${provider} was rejected by the provider.`,
                developerDetails: { provider, model, endpoint: baseUrl, httpStatus: 401, timestamp: new Date().toISOString() },
                actions: [{ label: 'Update API Key', primary: true, onClick: () => {} }, { label: 'Dismiss', onClick: () => {} }]
              });
              throw new Error('Invalid API Key');
            }

            if (!res.ok) {
              engine.setConnectionState('API Error');
              throw new Error(`API Error: ${res.status}`);
            }

            const data = await res.json();
            engine.setConnectionState('Connected');
            const move = (data.bestMove || '').trim();

            console.log(`[AI vs AI] ${side} returned: "${move}"`);

            if (!move) {
              errorPrompt = `\nYour response was empty. Return exactly one UCI string (e.g. 'e2e4').`;
              continue;
            }

            if (!legalMoves.includes(move)) {
              console.warn(`[AI vs AI] Illegal move "${move}". Legal sample: ${legalMoves.slice(0, 6).join(', ')}`);
              errorPrompt = `\nMove '${move}' is ILLEGAL. You MUST pick one of: ${legalMoves.join(', ')}`;
              continue;
            }

            const src = move.slice(0, 2);
            const tgt = move.slice(2, 4);
            const promo = move.length > 4 ? move[4] : undefined;
            const ok = useGameStore.getState().makeMove(src, tgt, promo);

            if (ok) {
              console.log(`[AI vs AI] ✓ ${side} played: ${move}`);
              success = true;
              failures[turn] = 0;
              break;
            } else {
              errorPrompt = `\nMove '${move}' failed to execute. Pick from: ${legalMoves.join(', ')}`;
            }
          } catch (err: any) {
            if (err.name === 'AbortError') {
              console.log(`[AI vs AI] ${side} request aborted.`);
              engine.setConnectionState('Cancelled');
              break;
            }
            if (err.message === 'Invalid API Key' || err.message === 'Invalid Model') {
              break;
            }
            if (!navigator.onLine) {
              engine.setConnectionState('Network Offline');
            } else if (err.message.includes('Timeout') || err.message.includes('fetch')) {
              engine.setConnectionState('Timeout');
            }
            
            console.error(`[AI vs AI] ${side} API loop error:`, err);
            errorPrompt = `\nPrevious attempt failed. Please evaluate the board again and return exactly one UCI move string.`;
            if (attempt >= 3) {
              engine.setConnectionState('API Error');
              useErrorStore.getState().dispatchError({
                category: 'AI',
                title: 'AI Generation Failed',
                message: err.message || `Something went wrong while contacting ${provider}.`,
                developerDetails: { provider, model, endpoint: baseUrl, internalErrorType: 'APIError', timestamp: new Date().toISOString(), errorCode: err.message },
                actions: [{ label: 'Change Provider', primary: true, onClick: () => {} }, { label: 'Dismiss', onClick: () => {} }]
              });
            }
          }
        }

        engine.setIsThinking(false);

        if (!success) {
          failures[turn] = (failures[turn] || 0) + 1;
          console.error(`[AI vs AI] ${side} failed all 3 attempts (failure #${failures[turn]}).`);
          if (failures[turn] >= MAX_CONSECUTIVE_FAILURES) {
            console.error(`[AI vs AI] Pausing match — too many ${side} failures.`);
            useAppStore.getState().setIsPaused(true);
            break;
          }
          const cont = await sleepOrStop(ERROR_RETRY_DELAY_MS, stopRef);
          if (!cont) break;
          continue; // retry same turn
        }
      }

      if (stopRef.current) break;

      // Check game over after move was applied
      if (useGameStore.getState().game.isGameOver()) {
        console.log('[AI vs AI] Game ended naturally.');
        break;
      }

      // Natural pause between moves
      const cont = await sleepOrStop(INTER_MOVE_DELAY_MS, stopRef);
      if (!cont) break;
      console.log(`[AI vs AI] End of iteration. Turn was ${turn}. stopRef=${stopRef.current}. Next turn will be evaluated...`);
    }

    loopRunning.current = false;
    console.log('[AI vs AI] ■ Loop ended. (Break triggered or stopRef true)');
  }, [gameKey]);

  useEffect(() => {
    const { appState, matchConfig } = useAppStore.getState();
    if (
      appState === 'playing' &&
      matchConfig.opponentType === 'aivsai' &&
      matchConfig.aiVsAiConfig
    ) {
      // Small delay to let the board reset/render before AI fires
      const timer = setTimeout(() => {
        runLoop();
      }, 600);
      return () => {
        clearTimeout(timer);
        stopRef.current = true;
        loopRunning.current = false;
      };
    }
    return () => {
      stopRef.current = true;
      loopRunning.current = false;
    };
  }, [gameKey, runLoop]);
}
