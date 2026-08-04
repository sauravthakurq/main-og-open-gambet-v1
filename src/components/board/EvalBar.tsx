'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';

export default function EvalBar() {
  const { orientation, gameResult, isCheckmate } = useGameStore();
  const { engineInfo, isThinking } = useEngineStore();
  const { engineType } = useAISettingsStore();

  let score = 0;
  if (engineInfo?.score !== undefined) {
    score = engineInfo.score / 100; // centipawns to pawns
  }

  // Handle mate
  let mateText = null;
  if (engineInfo?.score !== undefined) {
    if (Math.abs(engineInfo.score) >= 9000) {
      const mateIn = 10000 - Math.abs(engineInfo.score);
      score = engineInfo.score > 0 ? 100 : -100; // push bar fully
      mateText = `M${mateIn}`;
    }
  }

  // Calculate percentage for White's advantage using a bounded sigmoid-like curve or simple clamp
  // E.g., +5 means 95% white, -5 means 5% white.
  // formula: 50 + clamp(score * 10, -45, 45)
  const clampedScore = Math.max(-48, Math.min(48, score * 10));
  const whiteAdvantagePercent = 50 + clampedScore; 

  const isWhiteBottom = orientation === 'w';
  
  // Height of the white part of the bar
  const whiteHeight = `${whiteAdvantagePercent}%`;

  if (engineType === 'cloud') {
    // Hide eval bar for cloud engines since they don't provide live eval
    return null;
  }

  return (
    <div className="w-5 md:w-6 h-full bg-[#1e1e1e] rounded-lg overflow-hidden flex flex-col relative border border-white/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Black's side (top by default) */}
      <div 
        className={`w-full absolute transition-all duration-700 ease-out flex items-start justify-center pt-2 font-mono text-[9px] md:text-[10px] font-bold z-10 
          ${isWhiteBottom ? 'top-0' : 'bottom-0'} 
          ${score < 0 ? 'text-white' : 'text-black/50'}`}
        style={{ 
          height: isWhiteBottom ? `${100 - whiteAdvantagePercent}%` : whiteHeight,
          backgroundColor: '#2a2a2a'
        }}
      >
        {(!isWhiteBottom && score > 0 && !mateText) ? `+${score.toFixed(1)}` : null}
        {(isWhiteBottom && score < 0 && !mateText) ? Math.abs(score).toFixed(1) : null}
        {(!isWhiteBottom && mateText && score > 0) ? mateText : null}
        {(isWhiteBottom && mateText && score < 0) ? mateText : null}
      </div>

      {/* White's side (bottom by default) */}
      <div 
        className={`w-full absolute transition-all duration-700 ease-out flex items-end justify-center pb-2 font-mono text-[9px] md:text-[10px] font-bold z-10
          ${isWhiteBottom ? 'bottom-0' : 'top-0'}
          ${score > 0 ? 'text-black' : 'text-white/50'}`}
        style={{ 
          height: isWhiteBottom ? whiteHeight : `${100 - whiteAdvantagePercent}%`,
          backgroundColor: '#e3e3e3'
        }}
      >
        {(isWhiteBottom && score > 0 && !mateText) ? `+${score.toFixed(1)}` : null}
        {(!isWhiteBottom && score < 0 && !mateText) ? Math.abs(score).toFixed(1) : null}
        {(isWhiteBottom && mateText && score > 0) ? mateText : null}
        {(!isWhiteBottom && mateText && score < 0) ? mateText : null}
      </div>
    </div>
  );
}
