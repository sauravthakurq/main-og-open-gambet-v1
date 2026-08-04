import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountSettings {
  username: string;
  avatar: string;
  bio: string;
  country: string;
  language: string;
}

interface GameplaySettings {
  moveConfirmation: boolean;
  autoQueenPromotion: boolean;
  showLegalMoves: boolean;
  autoFlipBoard: boolean;
}

interface ClockSettings {
  lowTimeWarning: boolean;
  countdownVoice: boolean;
  clockSound: string;
}

interface AISettings {
  defaultModel: string;
  autoAnalysis: boolean;
  hintMode: boolean;
  showEvalBar: boolean;
  showBestMove: boolean;
}

interface PrivacySettings {
  onlineStatus: boolean;
  publicProfile: boolean;
  showRating: boolean;
  showMatchHistory: boolean;
  blockedPlayers: string[];
}

interface LanguageSettings {
  appLanguage: string;
  timeFormat: '12h' | '24h';
  dateFormat: string;
  region: string;
}

interface ApiSettings {
  openaiKey: string;
  anthropicKey: string;
  googleKey: string;
  gambitKey: string;
  storageLocation: 'local' | 'firebase';
}

interface SettingsState {
  account: AccountSettings;
  gameplay: GameplaySettings;
  clock: ClockSettings;
  ai: AISettings;
  privacy: PrivacySettings;
  language: LanguageSettings;
  api: ApiSettings;
  
  // Actions
  updateAccount: (updates: Partial<AccountSettings>) => void;
  updateGameplay: (updates: Partial<GameplaySettings>) => void;
  updateClock: (updates: Partial<ClockSettings>) => void;
  updateAI: (updates: Partial<AISettings>) => void;
  updatePrivacy: (updates: Partial<PrivacySettings>) => void;
  updateLanguage: (updates: Partial<LanguageSettings>) => void;
  updateApi: (updates: Partial<ApiSettings>) => void;
  resetToDefaults: () => void;
}

const defaultState = {
  account: {
    username: 'Guest User',
    avatar: '',
    bio: '',
    country: 'US',
    language: 'English',
  },
  gameplay: {
    moveConfirmation: false,
    autoQueenPromotion: true,
    showLegalMoves: true,
    autoFlipBoard: false,
  },
  clock: {
    lowTimeWarning: true,
    countdownVoice: false,
    clockSound: 'Standard',
  },
  ai: {
    defaultModel: 'GPT-4o',
    autoAnalysis: false,
    hintMode: true,
    showEvalBar: true,
    showBestMove: false,
  },
  privacy: {
    onlineStatus: true,
    publicProfile: true,
    showRating: true,
    showMatchHistory: true,
    blockedPlayers: [],
  },
  language: {
    appLanguage: 'English',
    timeFormat: '12h' as const,
    dateFormat: 'MM/DD/YYYY',
    region: 'United States',
  },
  api: {
    openaiKey: '',
    anthropicKey: '',
    googleKey: '',
    gambitKey: '',
    storageLocation: 'local' as const,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultState,
      updateAccount: (updates) => set((state) => ({ account: { ...state.account, ...updates } })),
      updateGameplay: (updates) => set((state) => ({ gameplay: { ...state.gameplay, ...updates } })),
      updateClock: (updates) => set((state) => ({ clock: { ...state.clock, ...updates } })),
      updateAI: (updates) => set((state) => ({ ai: { ...state.ai, ...updates } })),
      updatePrivacy: (updates) => set((state) => ({ privacy: { ...state.privacy, ...updates } })),
      updateLanguage: (updates) => set((state) => ({ language: { ...state.language, ...updates } })),
      updateApi: (updates) => set((state) => ({ api: { ...state.api, ...updates } })),
      resetToDefaults: () => set(defaultState),
    }),
    {
      name: 'chess-settings-storage',
    }
  )
);
