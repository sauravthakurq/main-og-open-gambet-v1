'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, X } from 'lucide-react';
import { useMatchmaking } from '@/hooks/useMatchmaking';

const TIME_CONTROLS = [
  { label: 'Bullet', sublabel: '1+0', minutes: 1, increment: 0 },
  { label: 'Blitz', sublabel: '3+2', minutes: 3, increment: 2 },
  { label: 'Blitz', sublabel: '5+0', minutes: 5, increment: 0 },
  { label: 'Rapid', sublabel: '10+0', minutes: 10, increment: 0 },
  { label: 'Rapid', sublabel: '15+10', minutes: 15, increment: 10 },
  { label: 'Classical', sublabel: '30+0', minutes: 30, increment: 0 },
  { label: 'Unlimited', sublabel: '∞', minutes: 0, increment: 0 },
];

interface QuickMatchProps {
  onBack: () => void;
}

export default function QuickMatch({ onBack }: QuickMatchProps) {
  const [selectedTime, setSelectedTime] = useState(2); // 5+0 default
  const [searchPhase, setSearchPhase] = useState(0);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const { startSearch, cancelSearch, isSearching } = useMatchmaking();

  const searchMessages = [
    'Searching for opponent…',
    'Finding best match…',
    'Connecting…',
    'Almost there…',
    'Preparing board…',
  ];

  useEffect(() => {
    if (!isSearching) return;
    const interval = setInterval(() => {
      setWaitSeconds((s) => s + 1);
      setSearchPhase((p) => (p + 1) % searchMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleStart = async () => {
    const tc = TIME_CONTROLS[selectedTime];
    await startSearch(tc.minutes === 0 ? null : { minutes: tc.minutes, increment: tc.increment });
  };

  const handleCancel = async () => {
    await cancelSearch();
    onBack();
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      {!isSearching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="text-white/50 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
            >
              ← Back
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-lg">Quick Match</h2>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-dim),transparent_70%)] pointer-events-none opacity-50" />
            
            <div className="relative z-10">
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Clock size={14} className="text-[var(--color-accent)]" /> Time Control
              </p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {TIME_CONTROLS.map((tc, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(i)}
                    className={`relative flex flex-col items-center py-3 sm:py-4 px-2 rounded-2xl sm:rounded-[20px] transition-all overflow-hidden ${
                      selectedTime === i
                        ? 'bg-[var(--color-accent)] border border-[var(--color-accent)] text-black scale-[1.02] shadow-[0_4px_16px_var(--color-accent-dim)]'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {selectedTime === i && <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />}
                    <span className="font-black text-sm sm:text-base relative z-10">{tc.sublabel}</span>
                    <span className={`text-[9px] sm:text-[10px] mt-0.5 font-bold uppercase tracking-wider relative z-10 ${selectedTime === i ? 'text-black/60' : 'text-white/40'}`}>
                      {tc.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 sm:py-5 rounded-2xl sm:rounded-[24px] bg-[var(--color-accent)] hover:brightness-110 text-black font-black text-lg shadow-[0_0_32px_var(--color-accent-dim)] transition-all overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Zap size={22} className="fill-black" />
              Find Match
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 sm:py-20 text-center bg-black/40 border border-white/10 rounded-[32px] backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-dim),transparent_70%)] opacity-20" />
          
          {/* Premium Animated rings */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8 sm:mb-10 z-10">
            <div className="absolute inset-0 rounded-full border border-[var(--color-accent)]/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-4 rounded-full border border-[var(--color-accent)]/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.4s' }} />
            <div className="absolute inset-8 rounded-full border border-[var(--color-accent)]/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.8s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_32px_var(--color-accent-dim)]">
                <Zap size={32} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
              </div>
            </div>
          </div>

          <motion.h2
            key={searchPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 relative z-10"
          >
            {searchMessages[searchPhase]}
          </motion.h2>

          <div className="flex items-center gap-6 sm:gap-10 mt-6 sm:mt-8 mb-10 sm:mb-12 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-[var(--color-accent)] tabular-nums drop-shadow-lg">
                {Math.floor(waitSeconds / 60).toString().padStart(2, '0')}:{(waitSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Wait Time</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-lg">{TIME_CONTROLS[selectedTime].sublabel}</span>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Time Control</span>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-bold transition-all border border-white/[0.08] relative z-10"
          >
            <X size={16} /> Cancel Search
          </button>
        </motion.div>
      )}
    </div>
  );
}
