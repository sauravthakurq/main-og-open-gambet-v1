'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useChessClockStore } from '@/store/useChessClockStore';
import { motion } from 'framer-motion';

export default function GameInsights() {
  const { history } = useGameStore();
  const { engineInfo } = useEngineStore();
  const whiteTime = useChessClockStore(s => s.whiteTime);
  const blackTime = useChessClockStore(s => s.blackTime);

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="hidden lg:flex p-6 rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all flex-col justify-center relative overflow-hidden">
      <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">Game Insights</h3>
      
      <div className="grid grid-cols-2 gap-y-6 gap-x-6">
        <div className="flex flex-col">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Evaluation</span>
          <span className={`text-[19px] font-medium tracking-tight ${engineInfo ? (engineInfo.score < 0 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]' : (engineInfo.score > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-white/80')) : 'text-white/80'}`}>
            {engineInfo ? (engineInfo.score / 100 > 0 ? '+' : '') + (engineInfo.score / 100).toFixed(2) : '+0.00'}
          </span>
        </div>
        
        <div className="flex flex-col border-l border-white/[0.04] pl-5">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Win Prob.</span>
          <span className="text-[19px] font-medium text-white/90 tracking-tight">
            {engineInfo ? (50 + 50 * (2 / (1 + Math.exp(-0.00368208 * engineInfo.score)) - 1)).toFixed(1) + '%' : '50.0%'}
          </span>
        </div>
        
        <div className="flex flex-col border-t border-white/[0.04] pt-5">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Moves</span>
          <span className="text-[19px] font-medium text-white/90 tracking-tight">{Math.floor(history.length / 2) + 1}</span>
        </div>
        
        <div className="flex flex-col border-t border-l border-white/[0.04] pt-5 pl-5">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Time Adv.</span>
          <span className="text-[19px] font-medium text-white/90 tracking-tight">
            {whiteTime > blackTime ? '+' : (whiteTime < blackTime ? '-' : '')}{Math.floor(Math.abs(whiteTime - blackTime) / 1000)}s
          </span>
        </div>
      </div>
    </motion.div>
  );
}
