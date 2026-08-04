'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Chess } from 'chess.js';
import { LichessStream } from '@/services/lichess/streamApi';
import { Chessground } from 'chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import { audioManager } from '@/lib/audioManager';

interface SpectatorBoardProps {
  gameId: string;
  onMovesUpdate?: (moves: string[]) => void;
}

export const SpectatorBoard: React.FC<SpectatorBoardProps> = ({ gameId, onMovesUpdate }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<any>(null);
  const chessRef = useRef(new Chess());

  useEffect(() => {
    if (!boardRef.current) return;
    
    // Initialize Chessground
    cgRef.current = Chessground(boardRef.current, {
      fen: chessRef.current.fen(),
      viewOnly: true,
      animation: { enabled: true, duration: 250 },
    });

    const stream = new LichessStream(gameId);
    
    stream.connect((data: any) => {
        if (data.type === 'gameFull') {
          if (data.state && data.state.moves) {
            const moves = data.state.moves.split(' ');
            chessRef.current = new Chess(data.initialFen === 'startpos' ? undefined : data.initialFen);
            
            for (const move of moves) {
              if (move) chessRef.current.move(move);
            }
            
            cgRef.current?.set({
              fen: chessRef.current.fen(),
              lastMove: getLastMoveSquares(chessRef.current)
            });
            if (onMovesUpdate) onMovesUpdate(chessRef.current.history());
          }
        } else if (data.type === 'gameState') {
          if (data.moves) {
            const moves = data.moves.split(' ');
            
            // To animate the last move beautifully, we reconstruct until the N-1 move,
            // then explicitly move the last piece in chessground.
            chessRef.current = new Chess();
            for (let i = 0; i < moves.length - 1; i++) {
              if (moves[i]) chessRef.current.move(moves[i]);
            }
            
            // Sync up to N-1
            cgRef.current?.set({ fen: chessRef.current.fen() });
            
            // Perform the last move with animation
            const lastMoveUci = moves[moves.length - 1];
            if (lastMoveUci) {
              const moveObj = chessRef.current.move(lastMoveUci);
              if (moveObj) {
                cgRef.current?.move(moveObj.from, moveObj.to);
                audioManager.play(moveObj.captured ? 'capture' : 'move');
              }
            }
            
            // Sync final state just in case
            cgRef.current?.set({
              fen: chessRef.current.fen(),
              lastMove: getLastMoveSquares(chessRef.current)
            });
            if (onMovesUpdate) onMovesUpdate(chessRef.current.history());
          }
        }
    }).catch(console.error);

    return () => {
      stream.disconnect();
      cgRef.current?.destroy();
    };
  }, [gameId]);

  const getLastMoveSquares = (chess: Chess) => {
    const history = chess.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      return [last.from, last.to];
    }
    return undefined;
  };

  return (
    <div className="relative aspect-square w-full max-w-[800px] p-2 rounded-2xl border border-[var(--color-charcoal)] board-frame-bg">
      <div className="w-full h-full bg-[var(--color-obsidian)] rounded-xl overflow-hidden relative z-10 touch-none">
        <div ref={boardRef} className="w-full h-full cg-wrap" />
      </div>
    </div>
  );
};
