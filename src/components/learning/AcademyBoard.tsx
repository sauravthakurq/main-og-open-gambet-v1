'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chessground } from 'chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import { AcademyLevel } from '@/lib/academy/types';
import { useAcademyStore } from '@/store/useAcademyStore';
import { audioManager } from '@/lib/audioManager';
import { parseFen, makeBoardFen } from 'chessops/fen';
import { Antichess, Chess } from 'chessops/variant';
import { chessgroundDests } from 'chessops/compat';
import { parseSquare } from 'chessops/util';
import { makeUci } from 'chessops/util'; // if needed

interface AcademyBoardProps {
  level: AcademyLevel;
  stageId: string;
}

export const AcademyBoard = ({ level, stageId }: AcademyBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<any>(null);
  const { saveScore } = useAcademyStore();
  
  const [apples, setApples] = useState<string[]>(level.apples);
  const [movesMade, setMovesMade] = useState(0);
  const [capturesMade, setCapturesMade] = useState(0);
  
  // Use Antichess to support FENs without Kings
  const posRef = useRef<any>(null);

  useEffect(() => {
    // Reset state when level changes
    setApples(level.apples);
    setMovesMade(0);
    setCapturesMade(0);
    const setup = parseFen(level.fen).unwrap();
    // Try to load as normal Chess, if not, load as Antichess
    const normal = Chess.fromSetup(setup);
    posRef.current = normal.isOk ? normal.unwrap() : Antichess.fromSetup(setup).unwrap();
  }, [level]);

  const evaluateSuccess = useCallback((
    currentApples: string[], 
    currentCaptures: number, 
    currentMoves: number,
    pos: any
  ) => {
    let success = false;
    if (level.captures) {
      if (currentCaptures >= level.captures) success = true;
    } else if (level.apples && level.apples.length > 0) {
      if (currentApples.length === 0) success = true;
    } else if (level.goal.toLowerCase().includes('mate') || level.goal.toLowerCase().includes('check')) {
      if (pos.isCheckmate && pos.isCheckmate()) success = true;
      else if (pos.isCheck && pos.isCheck()) success = true;
    } else {
      success = true;
    }

    if (success) {
      audioManager.play('game-end');
      let stars = 1;
      if (currentMoves <= level.nbMoves) stars = 3;
      else if (currentMoves <= level.nbMoves + 2) stars = 2;
      
      saveScore(stageId, level.id, stars);
    }
  }, [level, stageId, saveScore]);

  useEffect(() => {
    if (!boardRef.current || !posRef.current) return;

    const onMove = (orig: string, dest: string) => {
      const pos = posRef.current;
      
      // Determine if it was a capture
      const isCapture = !!pos.board.get(parseSquare(dest));
      
      // Keep track of who is supposed to move (usually White in these lessons)
      const playerColor = pos.turn;
      
      // Play move (this automatically flips pos.turn to the opponent)
      pos.play({ from: parseSquare(orig), to: parseSquare(dest) });
      
      // Force the turn back to the player so they can chain moves
      pos.turn = playerColor;

      audioManager.play(isCapture ? 'capture' : 'move-self');
      setMovesMade(m => m + 1);

      let newApples = [...apples];
      let newCaptures = capturesMade;

      if (newApples.includes(dest)) {
        newApples = newApples.filter(a => a !== dest);
        setApples(newApples);
        audioManager.play('game-start');
      }

      if (isCapture) {
        newCaptures += 1;
        setCapturesMade(newCaptures);
      }

      // Re-configure board for new state
      cgRef.current?.set({
        fen: makeBoardFen(pos.board),
        turnColor: pos.turn === 'white' ? 'white' : 'black',
        movable: {
          color: pos.turn === 'white' ? 'white' : 'black',
          dests: chessgroundDests(pos),
        },
      });

      setTimeout(() => {
        evaluateSuccess(newApples, newCaptures, movesMade + 1, pos);
      }, 100);
    };

    const cg = Chessground(boardRef.current, {
      fen: makeBoardFen(posRef.current.board),
      turnColor: posRef.current.turn === 'white' ? 'white' : 'black',
      movable: {
        color: posRef.current.turn === 'white' ? 'white' : 'black',
        free: false,
        dests: chessgroundDests(posRef.current),
        events: {
          after: onMove,
        },
      },
      drawable: {
        enabled: true,
        visible: true,
      },
      animation: { enabled: true, duration: 200 }
    });

    cgRef.current = cg;

    return () => {
      cg.destroy();
    };
  }, [level.fen, apples, evaluateSuccess, capturesMade, movesMade]);

  return (
    <div className="w-full h-full relative border border-white/10 rounded-xl overflow-hidden shadow-2xl board-frame-bg">
       <div ref={boardRef} className="w-full h-full" />
       
       {/* Custom overlay for apples/stars since native chessground drawable shapes might be tricky to align custom SVGs easily */}
       <div className="absolute inset-0 pointer-events-none grid grid-cols-8 grid-rows-8 z-20">
          {Array.from({ length: 64 }).map((_, i) => {
            const file = String.fromCharCode(97 + (i % 8)); // a-h
            const rank = 8 - Math.floor(i / 8); // 8-1
            const sq = `${file}${rank}`;
            
            const isApple = apples.includes(sq);
            if (!isApple) return <div key={sq} />;

            return (
              <div key={sq} className="flex items-center justify-center relative">
                 {/* The Star/Apple */}
                 <div className="w-3/5 h-3/5 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-full bg-yellow-100"></div>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};
