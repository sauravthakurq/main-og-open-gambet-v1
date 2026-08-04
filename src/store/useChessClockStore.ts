import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioManager } from '@/lib/audioManager';

interface ChessClockState {
  whiteTime: number; // in milliseconds
  blackTime: number; // in milliseconds
  activeColor: 'w' | 'b' | null;
  isRunning: boolean;
  hasPlayedTenSeconds: boolean;
  
  // Actions
  startClock: (color: 'w' | 'b') => void;
  stopClock: () => void;
  tick: (deltaMs: number) => void;
  resetClock: (initialTimeMs: number) => void;
}

export const useChessClockStore = create<ChessClockState>()(
  persist(
    (set) => ({
      whiteTime: 10 * 60 * 1000, // 10 minutes default
  blackTime: 10 * 60 * 1000,
  activeColor: null,
  isRunning: false,
  hasPlayedTenSeconds: false,

  startClock: (color) => set({ activeColor: color, isRunning: true }),
  
  stopClock: () => set({ isRunning: false }),
  
  tick: (deltaMs) => set((state) => {
    if (!state.isRunning || !state.activeColor) return state;
    
    let newWhiteTime = state.whiteTime;
    let newBlackTime = state.blackTime;
    let hasPlayed = state.hasPlayedTenSeconds;

    if (state.activeColor === 'w') {
      newWhiteTime = Math.max(0, state.whiteTime - deltaMs);
      if (newWhiteTime <= 10000 && state.whiteTime > 10000 && !hasPlayed) {
        audioManager.play('tenseconds');
        hasPlayed = true;
      }
    } else {
      newBlackTime = Math.max(0, state.blackTime - deltaMs);
      if (newBlackTime <= 10000 && state.blackTime > 10000 && !hasPlayed) {
        audioManager.play('tenseconds');
        hasPlayed = true;
      }
    }

    return { 
      whiteTime: newWhiteTime, 
      blackTime: newBlackTime,
      hasPlayedTenSeconds: hasPlayed
    };
  }),
  
  resetClock: (initialTimeMs) => set({
    whiteTime: initialTimeMs,
    blackTime: initialTimeMs,
    activeColor: null,
    isRunning: false,
    hasPlayedTenSeconds: false
  })
    }),
    {
      name: 'gambit-clock-storage',
    }
  )
);
