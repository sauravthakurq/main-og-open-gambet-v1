import React from 'react';
import { motion } from 'framer-motion';
import CapturedPieces from '@/components/ui/CapturedPieces';
import PlayerTimer from '@/components/game/PlayerTimer';
import { PlayerColor } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';

interface PlayerCardProps {
  type: 'human' | 'ai';
  color: PlayerColor;
  provider?: string;
  model?: string;
  engineType?: string;
  isThinking?: boolean;
  isActive: boolean;
  isMobileOnly?: boolean;
  isDesktopOnly?: boolean;
}

export default function PlayerCard({ type, color, provider, model, engineType, isThinking, isActive, isMobileOnly, isDesktopOnly }: PlayerCardProps) {
  const displayClass = isMobileOnly ? 'lg:hidden w-full max-w-[800px]' : (isDesktopOnly ? 'hidden lg:flex' : 'w-full');
  const { account } = useSettingsStore();
  
  return (
    <motion.div whileHover={{ scale: 1.01 }} className={`${displayClass} p-3 lg:p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-black/30 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px] lg:min-h-[155px] mx-auto`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none"></div>
      <div className="flex items-start justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {type === 'ai' ? (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center p-2 border border-white/[0.08] backdrop-blur-md shrink-0">
              <img src={`/icons/${provider?.toLowerCase().replace(' ', '-') || 'openai'}.svg`} alt="AI" className="w-full h-full opacity-90 drop-shadow-md object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xl backdrop-blur-md overflow-hidden shrink-0">
              <img src="/guest.png" alt="Guest" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[14px] font-bold text-white/90 tracking-tight truncate">
                {type === 'ai' ? (engineType === 'local' ? 'Stockfish 16.1' : model) : (account.username || 'Guest User')}
              </span>
              {type === 'human' && account.country && (
                <img 
                  src={`/flags/${account.country.toLowerCase()}.svg`} 
                  alt={account.country} 
                  className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm shrink-0 border border-white/10 inline-block"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              )}
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium mt-0.5 truncate">
              {type === 'ai' ? provider : 'Human Player'}
            </span>
            <CapturedPieces color={color as 'w' | 'b'} />
          </div>
        </div>
        
        {type === 'ai' && (
          <div className="flex flex-col items-end gap-1 mt-0.5 shrink-0">
            {isThinking ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Thinking</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Waiting</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between border-t border-white/[0.06] pt-3 mt-3 relative z-10 shrink-0">
        <div className="flex flex-col">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Playing as {color === 'w' ? 'White' : 'Black'}</span>
          <PlayerTimer color={color as 'w' | 'b'} isActive={isActive} />
        </div>
      </div>
    </motion.div>
  );
}
