import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OpponentType = 'computer' | 'ai' | 'online' | 'local' | 'aivsai' | null;
export type Difficulty = 'easy' | 'intermediate' | 'hard' | 'master' | 'max' | null;
export type OnlineMode = 'random' | 'friend' | null;
export type PlayerColor = 'w' | 'b' | 'random' | null;
export type TimeControl = { label: string; minutes: number; increment: number } | null;

export interface AIPlayerConfig {
  engineType: 'cloud' | 'local';
  provider: string;
  model: string;
  difficulty?: Difficulty;
}

export interface MatchConfig {
  opponentType: OpponentType;
  difficulty: Difficulty;
  onlineMode: OnlineMode;
  color: PlayerColor;
  timeControl: TimeControl;
  aiVsAiConfig?: {
    white: AIPlayerConfig;
    black: AIPlayerConfig;
  };
}

interface AppState {
  appState: 'onboarding' | 'playing' | 'game_over';
  matchConfig: MatchConfig;
  isPaused: boolean;
  playbackSpeed: number;
  isGameMenuOpen: boolean;
  isSoundEnabled: boolean;
  
  // Actions
  setAppState: (state: 'onboarding' | 'playing' | 'game_over') => void;
  updateMatchConfig: (config: Partial<MatchConfig>) => void;
  resetMatchConfig: () => void;
  setIsPaused: (paused: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsGameMenuOpen: (isOpen: boolean) => void;
  setIsSoundEnabled: (isEnabled: boolean) => void;
  /** Atomically resets all in-game UI state and transitions back to 'playing'. 
   *  Call this for Rematch/Restart so appState is guaranteed to be 'playing'
   *  before the game loop re-fires. */
  restartGame: () => void;
}

const defaultMatchConfig: MatchConfig = {
  opponentType: null,
  difficulty: null,
  onlineMode: null,
  color: null,
  timeControl: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      appState: 'onboarding', // Starts at onboarding by default
      matchConfig: defaultMatchConfig,
      isPaused: false,
      playbackSpeed: 1,
      isGameMenuOpen: false,
      isSoundEnabled: true,

      setAppState: (state) => set({ appState: state }),
      
      updateMatchConfig: (config) => 
        set((state) => ({ 
          matchConfig: { ...state.matchConfig, ...config } 
        })),
        
      resetMatchConfig: () => 
        set({ matchConfig: defaultMatchConfig }),
        
      setIsPaused: (paused) => set({ isPaused: paused }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setIsGameMenuOpen: (isOpen) => set({ isGameMenuOpen: isOpen }),
      setIsSoundEnabled: (isEnabled) => set({ isSoundEnabled: isEnabled }),

      restartGame: () => set({
        appState: 'playing',
        isPaused: false,
        isGameMenuOpen: false,
      }),
    }),
    {
      name: 'gambit-app-storage',
    }
  )
);
