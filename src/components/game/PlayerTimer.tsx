'use client';

import React from 'react';
import { useChessClockStore } from '@/store/useChessClockStore';
import { useAppStore } from '@/store/useAppStore';

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function PlayerTimer({ color, isActive }: { color: 'w' | 'b', isActive: boolean }) {
  const time = useChessClockStore((state) => color === 'w' ? state.whiteTime : state.blackTime);
  const timeControl = useAppStore((state) => state.matchConfig.timeControl);

  const isUnlimited = !timeControl || timeControl.minutes === 0;
  const isLowTime = !isUnlimited && time < 30000; // less than 30 seconds

  if (isUnlimited) {
    return (
      <span className={`font-mono text-[28px] sm:text-[36px] font-light leading-none tracking-tighter shrink-0 ${isActive ? 'text-white/80' : 'text-white/30'}`}>
        ∞
      </span>
    );
  }

  return (
    <span className={`font-mono text-[30px] sm:text-[38px] font-light leading-none tracking-tighter shrink-0 transition-colors ${
      isLowTime && isActive
        ? 'text-red-400 animate-pulse drop-shadow-[0_0_12px_rgba(248,113,113,0.6)]'
        : isActive 
          ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]' 
          : 'text-white/40'
    }`}>
      {formatTime(time)}
    </span>
  );
}
