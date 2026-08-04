import { useEffect, useRef } from 'react';
import { useChessClockStore } from '@/store/useChessClockStore';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';

export function useChessClockLoop() {
  const { startClock, stopClock, tick } = useChessClockStore();
  const { history, turn, game, handleTimeout } = useGameStore();
  const { appState, isPaused } = useAppStore();
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (appState === 'playing' && !game.isGameOver() && !isPaused) {
      startClock(turn);
    } else {
      stopClock();
    }
  }, [appState, game, turn, startClock, stopClock, isPaused]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      tick(now - lastTimeRef.current);
      lastTimeRef.current = now;
      
      // Check for timeout
      const { whiteTime, blackTime, isRunning, activeColor } = useChessClockStore.getState();
      if (isRunning && activeColor) {
        if (activeColor === 'w' && whiteTime <= 0) {
          useChessClockStore.getState().stopClock();
          handleTimeout('w');
        } else if (activeColor === 'b' && blackTime <= 0) {
          useChessClockStore.getState().stopClock();
          handleTimeout('b');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [tick, handleTimeout]);
}
