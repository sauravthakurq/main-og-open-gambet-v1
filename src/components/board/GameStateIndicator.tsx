import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { AlertTriangle, Target, Flag, Handshake, ShieldAlert } from 'lucide-react';

export function GameStateIndicator() {
  const { game, isCheck, isCheckmate, gameResult, turn } = useGameStore();

  let title = '';
  let subtext = '';
  let Icon = AlertTriangle;
  let bannerType: 'check' | 'draw' | 'checkmate' | 'info' | null = null;

  if (isCheckmate || gameResult.reason === 'checkmate') {
    bannerType = 'checkmate';
    title = 'CHECKMATE!';
    subtext = `${turn === 'w' ? 'Black' : 'White'} wins the game`;
    Icon = Target;
  } else if (isCheck) {
    bannerType = 'check';
    title = 'CHECK!';
    subtext = `${turn === 'w' ? 'White' : 'Black'} King is under attack!`;
    Icon = ShieldAlert;
  } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
    bannerType = 'draw';
    title = 'GAME DRAW!';
    if (game.isStalemate()) subtext = 'Stalemate - No legal moves';
    else if (game.isThreefoldRepetition()) subtext = 'Threefold Repetition';
    else if (game.isInsufficientMaterial()) subtext = 'Insufficient Material';
    else subtext = '50-Move Rule';
    Icon = Handshake;
  } else if (gameResult.reason === 'resignation' || gameResult.reason === 'timeout') {
    bannerType = 'info';
    title = gameResult.reason === 'timeout' ? 'TIME OUT!' : 'RESIGNATION!';
    subtext = gameResult.reason === 'timeout' ? 'Player ran out of time' : 'Opponent resigned';
    Icon = Flag;
  }

  if (!bannerType) return null;

  const isRed = bannerType === 'check' || bannerType === 'checkmate';
  const isGold = bannerType === 'draw';

  return (
    <AnimatePresence>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-[420px] px-4">
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: [0.85, 1.04, 1],
          }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`
            relative overflow-hidden rounded-2xl border-2 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl pointer-events-auto
            ${isRed 
              ? 'bg-gradient-to-r from-red-950/90 via-red-900/95 to-red-950/90 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.7)] text-white'
              : isGold
              ? 'bg-gradient-to-r from-amber-950/90 via-amber-900/95 to-amber-950/90 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.7)] text-amber-100'
              : 'bg-gradient-to-r from-slate-900/90 via-slate-800/95 to-slate-900/90 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-white'}
          `}
        >
          {/* Background Ambient Glow */}
          <div 
            className={`absolute -inset-1 opacity-40 blur-xl pointer-events-none ${
              isRed ? 'bg-red-500 animate-pulse' : isGold ? 'bg-amber-500 animate-pulse' : 'bg-white/20'
            }`}
          />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
              isRed ? 'bg-red-500/20 border-red-400/40 text-red-300' : isGold ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-white/10 border-white/20 text-white'
            }`}>
              <Icon size={24} className="animate-bounce" />
            </div>

            <div className="flex flex-col">
              <span className={`text-[17px] font-black uppercase tracking-wider leading-tight drop-shadow ${
                isRed ? 'text-red-200' : isGold ? 'text-amber-200' : 'text-white'
              }`}>
                {title}
              </span>
              <span className="text-[12px] font-medium opacity-85 mt-0.5 tracking-wide">
                {subtext}
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shrink-0 relative z-10 ${
            isRed ? 'bg-red-500/30 border-red-400/50 text-red-200' : isGold ? 'bg-amber-500/30 border-amber-400/50 text-amber-200' : 'bg-white/20 border-white/30 text-white'
          }`}>
            ALERT
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
