'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useAppStore } from '@/store/useAppStore';

export default function MatchIntro() {
  const { onlineGame } = useOnlineStore();
  const { appState } = useAppStore();
  const [show, setShow] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (appState === 'playing' && onlineGame && !isDone) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => setIsDone(true), 1000); // Wait for fade out
      }, 3500); // Show for 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [appState, onlineGame, isDone]);

  // Reset intro when leaving playing state
  useEffect(() => {
    if (appState !== 'playing') {
      setIsDone(false);
      setShow(false);
    }
  }, [appState]);

  if (isDone || !onlineGame) return null;

  const whiteProfile = onlineGame.whiteProfile;
  const blackProfile = onlineGame.blackProfile;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle animated background elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-purple-500/10 to-blue-500/10 blur-[100px] pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl px-8">
            <div className="flex items-center justify-between w-full">
              {/* White Player */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 flex-1"
              >
                <div className="w-24 h-24 rounded-full bg-white border-[4px] border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/10" />
                  <span className="text-4xl font-bold text-black drop-shadow-md">
                    {whiteProfile?.displayName?.[0]?.toUpperCase() || 'W'}
                  </span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-wide">{whiteProfile?.username}</h2>
                  <p className="text-lg text-white/50 font-bold uppercase tracking-widest mt-1">White</p>
                  <p className="text-sm font-bold text-emerald-400 mt-2">{whiteProfile?.rating} Elo</p>
                </div>
              </motion.div>

              {/* VS Indicator */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center px-8"
              >
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 italic tracking-tighter">
                  VS
                </span>
              </motion.div>

              {/* Black Player */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 flex-1"
              >
                <div className="w-24 h-24 rounded-full bg-[#111] border-[4px] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {blackProfile?.displayName?.[0]?.toUpperCase() || 'B'}
                  </span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white tracking-wide">{blackProfile?.username}</h2>
                  <p className="text-lg text-white/50 font-bold uppercase tracking-widest mt-1">Black</p>
                  <p className="text-sm font-bold text-emerald-400 mt-2">{blackProfile?.rating} Elo</p>
                </div>
              </motion.div>
            </div>

            {/* Match Details */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 flex gap-8 items-center"
            >
              <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 font-bold tracking-widest uppercase text-sm">
                {onlineGame.timeControl ? `${onlineGame.timeControl.minutes}+${onlineGame.timeControl.increment}` : 'Unlimited'}
              </div>
              <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 font-bold tracking-widest uppercase text-sm">
                {onlineGame.isPrivate ? 'Private Match' : 'Ranked Match'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
