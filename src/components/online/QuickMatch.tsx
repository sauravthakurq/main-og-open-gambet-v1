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
          transition={{ duration: 0 }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-white">Quick Match</h2>
          </div>

          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
              <Clock size={12} /> Time Control
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TIME_CONTROLS.map((tc, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTime(i)}
                  className={`flex flex-col items-center py-3 px-2 rounded-2xl transition-all border ${
                    selectedTime === i
                      ? 'bg-white text-black border-white scale-[1.03] shadow-lg'
                      : 'bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.07]'
                  }`}
                >
                  <span className="font-bold text-sm">{tc.sublabel}</span>
                  <span className={`text-[10px] mt-0.5 ${selectedTime === i ? 'text-black/60' : 'text-white/40'}`}>
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
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-[0_0_32px_rgba(16,185,129,0.3)] transition-all"
          >
            <Zap size={22} className="fill-white" />
            Find Match
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          {/* Animated rings */}
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping" />
            <div className="absolute inset-3 rounded-full border-2 border-emerald-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-6 rounded-full border-2 border-emerald-500/30 animate-ping" style={{ animationDelay: '0.6s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Zap size={28} className="text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          <motion.h2
            key={searchPhase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {searchMessages[searchPhase]}
          </motion.h2>

          <div className="flex items-center gap-8 mt-6 mb-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tabular-nums">
                {Math.floor(waitSeconds / 60).toString().padStart(2, '0')}:{(waitSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-white/40 uppercase tracking-wider mt-1">Wait Time</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{TIME_CONTROLS[selectedTime].sublabel}</span>
              <span className="text-xs text-white/40 uppercase tracking-wider mt-1">Time Control</span>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all border border-white/[0.06]"
          >
            <X size={14} /> Cancel Search
          </button>
        </motion.div>
      )}
    </div>
  );
}
