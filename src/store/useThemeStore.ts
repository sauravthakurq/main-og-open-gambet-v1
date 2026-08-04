import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  boardTheme: string;
  pieceTheme: string;
  favoriteBoards: string[];
  favoritePieces: string[];
  recentBoards: string[];
  recentPieces: string[];
  setBoardTheme: (theme: string) => void;
  setPieceTheme: (theme: string) => void;
  toggleFavoriteBoard: (theme: string) => void;
  toggleFavoritePiece: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      boardTheme: 'default',
      pieceTheme: 'default',
      favoriteBoards: [],
      favoritePieces: [],
      recentBoards: ['default'],
      recentPieces: ['default'],

      setBoardTheme: (theme: string) => {
        set((state) => {
          const newRecents = [theme, ...state.recentBoards.filter((t) => t !== theme)].slice(0, 5);
          return { boardTheme: theme, recentBoards: newRecents };
        });
      },

      setPieceTheme: (theme: string) => {
        set((state) => {
          const newRecents = [theme, ...state.recentPieces.filter((t) => t !== theme)].slice(0, 5);
          return { pieceTheme: theme, recentPieces: newRecents };
        });
      },

      toggleFavoriteBoard: (theme: string) => {
        set((state) => {
          if (state.favoriteBoards.includes(theme)) {
            return { favoriteBoards: state.favoriteBoards.filter((t) => t !== theme) };
          }
          return { favoriteBoards: [...state.favoriteBoards, theme] };
        });
      },

      toggleFavoritePiece: (theme: string) => {
        set((state) => {
          if (state.favoritePieces.includes(theme)) {
            return { favoritePieces: state.favoritePieces.filter((t) => t !== theme) };
          }
          return { favoritePieces: [...state.favoritePieces, theme] };
        });
      },
    }),
    {
      name: 'chess-theme-storage',
    }
  )
);
