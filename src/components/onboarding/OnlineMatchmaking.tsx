import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnlineMatchmakingProps {
  onBack: () => void;
  onNext: () => void; // Proceed to game setup with virtual opponent
}

export default function OnlineMatchmaking({ onBack, onNext }: OnlineMatchmakingProps) {
  const [mode, setMode] = useState<'select' | 'searching' | 'fallback' | 'friend'>('select');

  useEffect(() => {
    if (mode === 'searching') {
      const timer = setTimeout(() => {
        setMode('fallback');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  return (
    <div className="w-full text-center max-w-[600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
        >
          <span>←</span> Back
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white">Play Online</h1>
        <div className="w-[84px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <button
              onClick={() => setMode('searching')}
              className="group relative overflow-hidden p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                🌍
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Random Match</h2>
              <p className="text-sm text-slate-400">Find a player around the world with a similar skill level.</p>
            </button>

            <button
              onClick={() => setMode('friend')}
              className="group relative overflow-hidden p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                🤝
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Play with a Friend</h2>
              <p className="text-sm text-slate-400">Create a private room and share the invite code.</p>
            </button>
          </motion.div>
        )}

        {mode === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Searching for opponent...</h2>
            <div className="flex gap-8 text-sm text-slate-400 mt-6">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-white">4,281</span>
                <span className="text-xs uppercase tracking-wider">Players Online</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-white">~0:15</span>
                <span className="text-xs uppercase tracking-wider">Est. Wait Time</span>
              </div>
            </div>
            <button 
              onClick={() => setMode('select')}
              className="mt-12 text-sm text-slate-500 hover:text-white transition-colors"
            >
              Cancel Search
            </button>
          </motion.div>
        )}

        {mode === 'fallback' && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl mb-6">
              ⏳
            </div>
            <h2 className="text-xl font-bold text-white mb-3">No players available right now.</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-[400px]">
              Would you like to play against a <strong className="text-emerald-400">Smart Virtual Opponent</strong>? It has realistic timing, opening preferences, and plays like a real human.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setMode('select')}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onNext}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Yes, Play Virtual
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'friend' && (
          <motion.div
            key="friend"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Create a Private Match</h2>
            <p className="text-sm text-slate-400 mb-8">
              This feature requires the WebSockets backend which is currently under construction.
            </p>
            <button
              onClick={() => setMode('select')}
              className="py-3 px-8 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
