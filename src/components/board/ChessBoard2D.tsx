'use client';

import React, { useEffect, useRef } from 'react';
import { Chessground } from 'chessground';
import { SQUARES } from 'chess.js';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';
import { audioManager } from '@/lib/audioManager';
import { useOnlineGameSync } from '@/hooks/useOnlineGameSync';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStateIndicator } from './GameStateIndicator';

export default function ChessBoard2D() {
  const boardRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<any>(null);
  
  const { game, fen, turn, makeMove, orientation } = useGameStore();
  const matchConfig = useAppStore(state => state.matchConfig);

  // AI color calculation (same as page.tsx)
  const userColor = matchConfig?.color || 'w';
  const aiColor = userColor === 'w' ? 'b' : 'w';
  const { submitOnlineMove, isMyTurn } = useOnlineGameSync();
  const isHumanTurn = matchConfig?.opponentType === 'online' 
    ? isMyTurn 
    : (matchConfig?.opponentType === 'aivsai' ? false : (matchConfig?.opponentType === 'local' || turn !== aiColor));

  const getDestinations = (chessGame: any) => {
    const dests = new Map();
    SQUARES.forEach((s: string) => {
      const ms = chessGame.moves({ square: s, verbose: true });
      if (ms.length) dests.set(s, ms.map((m: any) => m.to));
    });
    return dests;
  };

  const hasPlayedStartRef = useRef(false);
  useEffect(() => {
    if (game.history().length === 0) {
      if (!hasPlayedStartRef.current) {
        audioManager.play('game-start');
        hasPlayedStartRef.current = true;
      }
    } else {
      hasPlayedStartRef.current = false;
    }
  }, [game]);

  useEffect(() => {
    if (!boardRef.current) return;

    const cg = Chessground(boardRef.current, {
      fen: fen,
      orientation: orientation === 'w' ? 'white' : 'black',
      turnColor: turn === 'w' ? 'white' : 'black',
      movable: {
        color: isHumanTurn ? (turn === 'w' ? 'white' : 'black') : undefined,
        free: false,
        dests: isHumanTurn ? getDestinations(game) : new Map(),
        events: {
          after: (orig, dest, metadata) => {
            // Check if it's a promotion (just defaulting to queen for simplicity in UI, could add a modal)
            const moveObj = game.moves({ verbose: true }).find(
              (m) => m.from === orig && m.to === dest
            );
            
            const isPromotion = moveObj?.flags.includes('p') || moveObj?.flags.includes('c');
            const isCastling = moveObj?.flags.includes('k') || moveObj?.flags.includes('q');
            
            const success = makeMove(orig, dest, isPromotion ? 'q' : undefined);
            
            if (success) {
              if (matchConfig?.opponentType === 'online') {
                submitOnlineMove(orig, dest, isPromotion ? 'q' : undefined);
              }
            } else {
              audioManager.play('illegal');
              // Illegal move, revert UI
              cg.set({ fen: game.fen() });
            }
          }
        }
      },
      animation: {
        enabled: true,
        duration: 200,
      },
      premovable: {
        enabled: false,
      },
      highlight: {
        lastMove: true,
        check: true,
      },
      draggable: {
        enabled: true,
        showGhost: true,
      },
      lastMove: []
    });

    cgRef.current = cg;

    return () => {
      cg.destroy();
    };
  }, [boardRef]);

  // Reactive Sound Effects (handles both User and CPU moves)
  const previousHistoryLength = useRef(0);
  useEffect(() => {
    const historyList = game.history({ verbose: true });
    if (historyList.length === 0) {
      previousHistoryLength.current = 0;
      return;
    }
    previousHistoryLength.current = historyList.length;
  }, [fen, game]);

  // Sync external state changes (like undo/redo) to chessground
  useEffect(() => {
    if (cgRef.current) {
      const history = game.history({ verbose: true });
      const lastMove = history.length > 0 
        ? [history[history.length - 1].to]
        : [];
        
      cgRef.current.set({
        fen: fen,
        orientation: orientation === 'w' ? 'white' : 'black',
        turnColor: turn === 'w' ? 'white' : 'black',
        lastMove: lastMove as any,
        check: game.inCheck() ? true : false,
        movable: {
          color: isHumanTurn ? (turn === 'w' ? 'white' : 'black') : undefined,
          dests: isHumanTurn ? getDestinations(game) : new Map(),
        }
      });
    }
  }, [fen, turn, game, orientation]);

  const [showCheckFlash, setShowCheckFlash] = React.useState(false);

  useEffect(() => {
    if (game.inCheck() && !game.isCheckmate()) {
      setShowCheckFlash(true);
      const timer = setTimeout(() => setShowCheckFlash(false), 800);
      return () => clearTimeout(timer);
    } else {
      setShowCheckFlash(false);
    }
  }, [fen, game]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <GameStateIndicator />
      
      {/* Subtle Screen Flash on Check */}
      <AnimatePresence>
        {showCheckFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute -inset-10 bg-red-500/10 rounded-[2rem] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div 
        ref={boardRef} 
        style={{ width: '100%', height: '100%' }} 
        className="rounded-lg shadow-2xl relative z-10"
      />

      {/* Premium Check Notification */}
      <AnimatePresence>
        {showCheckFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-b from-red-500/90 to-red-600/90 backdrop-blur-xl border border-red-400/50 text-white font-bold text-4xl px-8 py-3 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.5)] tracking-widest uppercase">
              Check!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
