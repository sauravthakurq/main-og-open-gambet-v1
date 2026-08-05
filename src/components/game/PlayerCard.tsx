import React from 'react';
import { motion } from 'framer-motion';
import CapturedPieces from '@/components/ui/CapturedPieces';
import PlayerTimer from '@/components/game/PlayerTimer';
import { PlayerColor } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useOnlineStore } from '@/store/useOnlineStore';

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
  playerNameOverride?: string;
  ratingOverride?: number;
  timeRemainingOverride?: number;
}

export default function PlayerCard({ 
  type, color, provider, model, engineType, isThinking, isActive, isMobileOnly, isDesktopOnly,
  playerNameOverride, ratingOverride, timeRemainingOverride
}: PlayerCardProps) {
  const displayClass = isMobileOnly ? 'lg:hidden w-full max-w-[800px]' : (isDesktopOnly ? 'hidden lg:flex w-full flex-1 min-w-0' : 'w-full flex-1 min-w-0');
  const { account } = useSettingsStore();
  const { userProfile } = useOnlineStore();
  
  const playerName = playerNameOverride || (type === 'ai' 
    ? (engineType === 'local' ? 'Stockfish 16.1' : model) 
    : (userProfile?.username || account.username || 'Guest User'));
  
  const customStyles = `
    @keyframes shimmer-text {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .animate-shimmer-text {
      background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.7) 100%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: shimmer-text 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    @keyframes breathe-card {
      0% { box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06); }
      50% { box-shadow: 0 8px 32px rgba(16,185,129,0.15), inset 0 0 0 1px rgba(16,185,129,0.3); }
      100% { box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06); }
    }
    .animate-breathe-card {
      animation: breathe-card 3s ease-in-out infinite;
    }
  `;
  
  return (
    <motion.div whileHover={{ scale: 1.01 }} className={`${displayClass} p-3 lg:p-4 rounded-2xl border ${isThinking ? 'border-emerald-500/30 animate-breathe-card' : 'border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'} bg-gradient-to-b from-white/[0.04] to-black/30 backdrop-blur-3xl transition-all relative flex flex-col justify-between h-[164px] lg:h-[174px] mx-auto shrink-0 overflow-hidden`}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none"></div>
      <div className="flex items-start justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-start gap-3 min-w-0 flex-1">
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
              <span className={`text-[14px] font-bold tracking-tight truncate max-w-full sm:max-w-[180px] ${isThinking ? 'animate-shimmer-text' : 'text-white/90'}`} title={playerName}>
                {playerName}
              </span>
              {type === 'human' && account.country && !playerNameOverride && (
                <img 
                  src={`/flags/${account.country.toLowerCase()}.svg`} 
                  alt={account.country} 
                  className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm shrink-0 border border-white/10 inline-block"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              )}
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium mt-0.5 truncate shrink-0">
              {ratingOverride ? `${ratingOverride} ELO` : (type === 'ai' ? provider : 'Human Player')}
            </span>
            <CapturedPieces color={color as 'w' | 'b'} />
          </div>
        </div>
        
        {type === 'ai' && (
          <div className="flex flex-col items-end gap-1 mt-0.5 shrink-0">
            {isThinking ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Thinking...</span>
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
        <div className="flex flex-col min-w-0 shrink-0 h-[64px] justify-end">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Playing as {color === 'w' ? 'White' : 'Black'}</span>
          {timeRemainingOverride !== undefined ? (
            <div className={`font-mono text-[30px] sm:text-[38px] font-light leading-[1] tracking-tighter shrink-0 pb-1 ${isActive ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'text-white/40'}`}>
              {Math.floor(timeRemainingOverride / 60).toString().padStart(2, '0')}:{(timeRemainingOverride % 60).toString().padStart(2, '0')}
            </div>
          ) : (
            <PlayerTimer color={color as 'w' | 'b'} isActive={isActive} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
