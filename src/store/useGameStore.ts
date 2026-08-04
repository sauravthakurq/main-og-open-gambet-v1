import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess, Move } from 'chess.js';
import { audioManager } from '@/lib/audioManager';
import { useAppStore } from './useAppStore';

interface GameState {
  game: Chess;
  gameId: string;
  fen: string;
  pgn: string;
  history: Move[];
  redoStack: Move[];
  turn: 'w' | 'b';
  orientation: 'w' | 'b';
  viewMode: '2D' | '3D';
  isCheck: boolean;
  isCheckmate: boolean;
  gameResult: { winner: 'w' | 'b' | 'draw' | null; reason: string | null };
  material: { white: number; black: number; advantage: number };
  capturedPieces: { w: Record<string, number>; b: Record<string, number> };
  
  // Actions
  makeMove: (source: string, target: string, promotion?: string) => boolean;
  undoMove: () => void;
  redoMove: () => void;
  resetGame: () => void;
  setViewMode: (mode: '2D' | '3D') => void;
  flipBoard: () => void;
  setOrientation: (orientation: 'w' | 'b') => void;
  handleTimeout: (lostColor: 'w' | 'b') => void;
}

// Utility to evaluate FIDE insufficient mating material for a specific color
const hasSufficientMatingMaterial = (game: Chess, color: 'w' | 'b') => {
  const board = game.board();
  let pawns = 0, knights = 0, bishops = 0, rooks = 0, queens = 0;
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece && piece.color === color) {
        if (piece.type === 'p') pawns++;
        else if (piece.type === 'n') knights++;
        else if (piece.type === 'b') bishops++;
        else if (piece.type === 'r') rooks++;
        else if (piece.type === 'q') queens++;
      }
    }
  }

  // Pawns, Rooks, and Queens can always force mate (or promote to do so)
  if (pawns > 0 || rooks > 0 || queens > 0) return true;
  
  // Two bishops, two knights, or bishop+knight can force mate
  if (bishops >= 2 || knights >= 2 || (bishops >= 1 && knights >= 1)) return true;
  
  // King + 1 Bishop or King + 1 Knight is insufficient
  // King only is insufficient
  return false;
};

// Utility to evaluate material and captured pieces
const calculateMaterial = (game: Chess) => {
  const board = game.board();
  const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  
  // Start with 16 pieces for each side
  const currentCounts = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };
  
  let whiteMaterial = 0;
  let blackMaterial = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece && piece.type !== 'k') {
        currentCounts[piece.color][piece.type]++;
        if (piece.color === 'w') whiteMaterial += pieceValues[piece.type];
        if (piece.color === 'b') blackMaterial += pieceValues[piece.type];
      }
    }
  }

  // Assuming standard starting pieces (8p, 2n, 2b, 2r, 1q)
  const startingCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  
  const capturedPieces = {
    w: {
      p: Math.max(0, startingCounts.p - currentCounts.w.p),
      n: Math.max(0, startingCounts.n - currentCounts.w.n),
      b: Math.max(0, startingCounts.b - currentCounts.w.b),
      r: Math.max(0, startingCounts.r - currentCounts.w.r),
      q: Math.max(0, startingCounts.q - currentCounts.w.q),
    },
    b: {
      p: Math.max(0, startingCounts.p - currentCounts.b.p),
      n: Math.max(0, startingCounts.n - currentCounts.b.n),
      b: Math.max(0, startingCounts.b - currentCounts.b.b),
      r: Math.max(0, startingCounts.r - currentCounts.b.r),
      q: Math.max(0, startingCounts.q - currentCounts.b.q),
    }
  };

  return {
    material: { white: whiteMaterial, black: blackMaterial, advantage: whiteMaterial - blackMaterial },
    capturedPieces
  };
};

const getGameResult = (game: Chess): { winner: 'w' | 'b' | 'draw' | null; reason: string | null } => {
  if (!game.isGameOver()) return { winner: null, reason: null };
  
  if (game.isCheckmate()) {
    return { winner: game.turn() === 'w' ? 'b' : 'w', reason: 'Checkmate' };
  }
  if (game.isStalemate()) return { winner: 'draw', reason: 'Stalemate' };
  if (game.isThreefoldRepetition()) return { winner: 'draw', reason: 'Repetition' };
  if (game.isInsufficientMaterial()) return { winner: 'draw', reason: 'Insufficient Material' };
  if (game.isDraw()) return { winner: 'draw', reason: '50-Move Rule' }; // Fallback
  
  return { winner: null, reason: null };
};

// Ensure sound effects are played outside of pure state updates
// but we will expose triggers from the store for components to react to.

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const initialGame = new Chess();
      return {
        game: initialGame,
        gameId: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        fen: initialGame.fen(),
        pgn: initialGame.pgn(),
        history: [],
        redoStack: [],
        turn: initialGame.turn(),
        orientation: 'w',
        viewMode: '2D',
        isCheck: false,
        isCheckmate: false,
        gameResult: { winner: null, reason: null },
        material: { white: 39, black: 39, advantage: 0 },
        capturedPieces: {
          w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    },

    makeMove: (source, target, promotion = 'q') => {
      const { game } = get();
      try {
        const move = game.move({
          from: source,
          to: target,
          promotion,
        });

        const { material, capturedPieces } = calculateMaterial(game);
        
        set({
          fen: game.fen(),
          pgn: game.pgn(),
          history: game.history({ verbose: true }) as Move[],
          turn: game.turn(),
          isCheck: game.inCheck(),
          isCheckmate: game.isCheckmate(),
          gameResult: getGameResult(game),
          material,
          capturedPieces,
          redoStack: []
        });

        // Trigger sounds instantly
        if (game.isCheckmate()) {
          audioManager.play('move-check');
          setTimeout(() => audioManager.play('game-end'), 500);
        } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
          audioManager.play('game-end');
          setTimeout(() => audioManager.play('draw'), 500);
        } else if (game.inCheck()) {
          audioManager.play('move-check');
        } else if (move.flags.includes('p')) {
          audioManager.play('promote');
        } else if (move.flags.includes('k') || move.flags.includes('q')) {
          audioManager.play('castle');
        } else if (move.captured) {
          audioManager.play('capture');
        } else {
          const matchConfig = useAppStore.getState().matchConfig;
          const myColor = matchConfig?.color || 'w';
          if (move.color === myColor) {
            audioManager.play('move-self');
          } else {
            audioManager.play('move-opponent');
          }
        }
        
        return true;
      } catch (e) {
        return false; // Invalid move
      }
    },

    undoMove: () => {
      const { game } = get();
      const undoneMove = game.undo();
      if (!undoneMove) return;

      const { material, capturedPieces } = calculateMaterial(game);
      set((state) => ({
        fen: game.fen(),
        pgn: game.pgn(),
        history: game.history({ verbose: true }) as Move[],
        turn: game.turn(),
        isCheck: game.inCheck(),
        isCheckmate: game.isCheckmate(),
        gameResult: getGameResult(game),
        material,
        capturedPieces,
        redoStack: [...state.redoStack, undoneMove]
      }));
    },

    redoMove: () => {
      const { game, redoStack } = get();
      if (redoStack.length === 0) return;
      
      const moveToRedo = redoStack[redoStack.length - 1];
      try {
        game.move(moveToRedo.san);
        const { material, capturedPieces } = calculateMaterial(game);
        
        set((state) => ({
          fen: game.fen(),
          pgn: game.pgn(),
          history: game.history({ verbose: true }) as Move[],
          turn: game.turn(),
          isCheck: game.inCheck(),
          isCheckmate: game.isCheckmate(),
          gameResult: getGameResult(game),
          material,
          capturedPieces,
          redoStack: state.redoStack.slice(0, -1)
        }));
      } catch (e) {
        console.error("Failed to redo move", e);
      }
    },

    resetGame: () => {
      const newGame = new Chess();
      set({
        game: newGame,
        gameId: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        fen: newGame.fen(),
        pgn: newGame.pgn(),
        history: [],
        redoStack: [],
        turn: 'w',
        isCheck: false,
        isCheckmate: false,
        gameResult: { winner: null, reason: null },
        material: { white: 39, black: 39, advantage: 0 },
        capturedPieces: {
          w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
          b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
        }
      });
    },

    setViewMode: (mode: '2D' | '3D') => set({ viewMode: mode }),
    flipBoard: () => set((state) => ({ orientation: state.orientation === 'w' ? 'b' : 'w' })),
    setOrientation: (orientation: 'w' | 'b') => set({ orientation }),
    
    handleTimeout: (lostColor: 'w' | 'b') => {
      const { game } = get();
      if (game.isGameOver()) return; // Already over
      
      const winningColor = lostColor === 'w' ? 'b' : 'w';
      const hasMaterial = hasSufficientMatingMaterial(game, winningColor);
      
      let newResult;
      if (hasMaterial) {
        // Winner has material to mate, so it's a win by timeout
        newResult = { winner: winningColor, reason: 'timeout' };
        game.header('Termination', 'Time forfeit', 'Result', winningColor === 'w' ? '1-0' : '0-1');
      } else {
        // Winner doesn't have sufficient material, so it's a draw by timeout + insufficient material
        newResult = { winner: 'draw', reason: 'timeout_insufficient' };
        game.header('Termination', 'Time forfeit (Insufficient material)', 'Result', '1/2-1/2');
      }
      
      set({
        gameResult: newResult as { winner: 'w' | 'b' | 'draw' | null; reason: string | null },
        pgn: game.pgn()
      });
      
      // Update app state to game_over
      useAppStore.getState().setAppState('game_over');
      
      // Play timeout buzzer audio (if any valid mapping existed)
      setTimeout(() => {
        if (newResult.winner === 'draw') audioManager.play('draw');
        else audioManager.play('game-end');
      }, 500);
    },

    };
    },
    {
      name: 'gambit-game-storage',
      partialize: (state) => {
        // Exclude the non-serializable Chess instance
        const { game, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Reconstruct the Chess instance from PGN to perfectly restore all history, captured pieces, and exact rules
            const newGame = new Chess();
            if (state.pgn) {
              newGame.loadPgn(state.pgn);
            } else if (state.fen) {
              newGame.load(state.fen);
            }
            // The state object provided here is the mutable state being hydrated
            // Re-attaching the recreated game instance
            state.game = newGame;
          } catch (e) {
            console.error('Failed to rehydrate game state:', e);
            state.game = new Chess();
            state.fen = state.game.fen();
            state.pgn = state.game.pgn();
            state.history = [];
          }
        }
      },
    }
  )
);
