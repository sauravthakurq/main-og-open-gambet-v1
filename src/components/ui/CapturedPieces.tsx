import React from 'react';
import { useGameStore } from '@/store/useGameStore';

interface CapturedPiecesProps {
  color: 'w' | 'b'; // The color of the player this component belongs to
}

// SVG paths for chess pieces
const PIECES = {
  p: "M 22.5,9 C 19.5,9 17.5,11.5 17.5,14.5 C 17.5,17.5 20,20 22.5,20 C 25,20 27.5,17.5 27.5,14.5 C 27.5,11.5 25.5,9 22.5,9 z M 22.5,20 C 19.5,20 13.5,24 13.5,27 L 31.5,27 C 31.5,24 25.5,20 22.5,20 z M 11.5,37 L 33.5,37 C 33.5,37 35.5,30 35.5,30 L 9.5,30 C 9.5,30 11.5,37 11.5,37 z M 9.5,30 A 1.5,1.5 0 0 1 11,28.5 L 34,28.5 A 1.5,1.5 0 0 1 35.5,30 L 35.5,30 A 1.5,1.5 0 0 1 34,31.5 L 11,31.5 A 1.5,1.5 0 0 1 9.5,30 z",
  n: "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 C 21,15 16,18 14,14 C 12,10 17,6 22,10 z",
  b: "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.53 9,36 9,36 z M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z M 25,8 A 2.5,2.5 0 1 1 20,8 A 2.5,2.5 0 1 1 25,8 z",
  r: "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z M 12,36 L 14,29 L 31,29 L 33,36 L 12,36 z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 31,14 L 31,29 L 14,29 L 14,14 L 11,14 z",
  q: "M 9 26 C 17.5 24.5 30 24.5 36 26 L 38.5 13.5 L 31 25 L 30.7 10.9 L 25.5 24.5 L 22.5 10 L 19.5 24.5 L 14.3 10.9 L 14 25 L 6.5 13.5 L 9 26 z M 9 26 C 9 28 10.5 28 11.5 30 C 12.5 31.5 12.5 31 12 33.5 C 10.5 34.5 10.5 36 10.5 36 C 9 37.5 11 38.5 11 38.5 C 17.5 39.5 27.5 39.5 34 38.5 C 34 38.5 35.5 37.5 34 36 C 34 36 34.5 34.5 33 33.5 C 32.5 31 32.5 31.5 33.5 30 C 34.5 28 36 28 36 26 C 27.5 24.5 17.5 24.5 9 26 z M 11.5 30 C 15 29 30 29 33.5 30 M 12 33.5 C 18 32.5 27 32.5 33 33.5",
};

export default function CapturedPieces({ color }: CapturedPiecesProps) {
  const { capturedPieces, material } = useGameStore();

  // If we are White (w), we display captured Black (b) pieces.
  const targetColor = color === 'w' ? 'b' : 'w';
  const pieces = capturedPieces[targetColor];
  
  // Calculate advantage for this player
  const adv = color === 'w' ? material.advantage : -material.advantage;
  
  // Order: Pawn(p), Knight(n), Bishop(b), Rook(r), Queen(q)
  const pieceOrder = ['p', 'n', 'b', 'r', 'q'];
  
  let pieceCounts: { type: string, count: number }[] = [];
  pieceOrder.forEach(type => {
    const count = pieces[type as keyof typeof pieces];
    if (count > 0) {
      pieceCounts.push({ type, count });
    }
  });

  if (pieceCounts.length === 0 && adv <= 0) {
    return <div className="h-[28px] w-full shrink-0 mt-1"></div>;
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1 mt-1 h-[28px] shrink-0">
      {pieceCounts.map(({ type, count }, i) => (
        <div key={i} className="flex items-center gap-0.5 bg-black/40 rounded-md px-1.5 py-0.5 border border-white/10 backdrop-blur-md shadow-sm shrink-0">
          <svg 
            viewBox="0 0 45 45" 
            className="w-3.5 h-3.5 opacity-90 drop-shadow"
            style={{ 
              color: targetColor === 'w' ? '#fff' : '#000',
              fill: targetColor === 'w' ? '#f8f8f8' : '#141414',
              stroke: targetColor === 'w' ? '#333' : '#666',
              strokeWidth: '2px',
            }}
          >
            <path d={PIECES[type as keyof typeof PIECES]} />
          </svg>
          <span className="text-[10px] font-bold text-white/90 tracking-tighter ml-0.5">
            ×{count}
          </span>
        </div>
      ))}
      
      {adv > 0 && (
        <div className="flex items-center ml-1 px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 shadow-sm shrink-0">
          <span className="text-[10px] font-bold text-emerald-400 leading-none">
            +{adv}
          </span>
        </div>
      )}
    </div>
  );
}
