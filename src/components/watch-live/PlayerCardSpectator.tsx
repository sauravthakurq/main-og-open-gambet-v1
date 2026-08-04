'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface PlayerCardSpectatorProps {
  color: 'w' | 'b';
  name: string;
  title?: string;
  rating: number;
  timeRemaining?: number;
  isActive?: boolean;
}

export const PlayerCardSpectator: React.FC<PlayerCardSpectatorProps> = ({ 
  color, name, title, rating, timeRemaining, isActive 
}) => {
  
  const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 100);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
      isActive ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-black/20 border-white/5'
    }`}>
      
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shadow-inner ${
          color === 'w' ? 'bg-[#f0d9b5] border-[#b58863]' : 'bg-[#1a1a1a] border-[#333]'
        }`}>
          <img src={color === 'w' ? '/wK.svg' : '/bK.svg'} alt={color} className="w-8 h-8 opacity-80" />
        </div>
        
        <div className="flex flex-col">
          <span className="font-bold text-white text-base">
            {title && <span className="text-[#e1aa53] mr-1">{title}</span>}
            {name || 'Unknown'}
          </span>
          <span className="text-xs text-white/50 font-semibold">{rating ? `${rating} ELO` : 'Unrated'}</span>
        </div>
      </div>

      <div className={`flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold px-4 py-2 rounded-lg border ${
        isActive 
          ? 'bg-white/10 text-white border-white/20' 
          : 'bg-black/40 text-white/40 border-black/50'
      }`}>
        <Clock size={16} className={isActive ? "text-[var(--color-accent)] animate-pulse" : ""} />
        {timeRemaining !== undefined ? formatTime(timeRemaining) : '--:--'}
      </div>

    </div>
  );
};
