import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { UserProfile, OnlineGame } from '@/lib/firebase-types';

interface OnlineState {
  // Auth
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  isFirebaseReady: boolean;

  // Active online game
  onlineGameId: string | null;
  onlineGame: OnlineGame | null;

  // Matchmaking
  isSearching: boolean;
  matchmakingEntryId: string | null;

  // Private room
  activeRoomId: string | null;
  activeRoomCode: string | null;

  // Notifications
  notifications: Array<{ id: string; title: string; message: string; type: string }>;

  // Actions
  setFirebaseUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setIsAuthLoading: (loading: boolean) => void;
  setIsFirebaseReady: (ready: boolean) => void;
  setOnlineGameId: (id: string | null) => void;
  setOnlineGame: (game: OnlineGame | null) => void;
  setIsSearching: (searching: boolean) => void;
  setMatchmakingEntryId: (id: string | null) => void;
  setActiveRoom: (id: string | null, code: string | null) => void;
  addNotification: (n: { id: string; title: string; message: string; type: string }) => void;
  dismissNotification: (id: string) => void;
  clearOnlineSession: () => void;
}

export const useOnlineStore = create<OnlineState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      userProfile: null,
      isAuthLoading: true,
      isFirebaseReady: false,
      onlineGameId: null,
      onlineGame: null,
      isSearching: false,
      matchmakingEntryId: null,
      activeRoomId: null,
      activeRoomCode: null,
      notifications: [],

      setFirebaseUser: (user) => set({ firebaseUser: user }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setIsAuthLoading: (loading) => set({ isAuthLoading: loading }),
      setIsFirebaseReady: (ready) => set({ isFirebaseReady: ready }),
      setOnlineGameId: (id) => set({ onlineGameId: id }),
      setOnlineGame: (game) => set({ onlineGame: game }),
      setIsSearching: (searching) => set({ isSearching: searching }),
      setMatchmakingEntryId: (id) => set({ matchmakingEntryId: id }),
      setActiveRoom: (id, code) => set({ activeRoomId: id, activeRoomCode: code }),
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications].slice(0, 10) })),
      dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      clearOnlineSession: () => set({
        onlineGameId: null,
        onlineGame: null,
        isSearching: false,
        matchmakingEntryId: null,
        activeRoomId: null,
        activeRoomCode: null,
      }),
    }),
    {
      name: 'gambit-online-storage',
      // Don't persist firebase user or loading states — they are rebuilt on mount
      partialize: (state) => ({
        userProfile: state.userProfile,
      }),
    }
  )
);
