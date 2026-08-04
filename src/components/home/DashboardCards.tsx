'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, Bot, Tv, History, TrendingUp, Sparkles, 
  GraduationCap, Activity, Trophy, ChevronRight, Play
} from 'lucide-react';

const CardWrapper = ({ children, className, onClick, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer group transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </motion.div>
);

export const PuzzlesCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5 flex flex-col justify-between" delay={0.1}>
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
        <Puzzle size={20} />
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white/70">Daily</span>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-white mb-1">Tactics & Puzzles</h3>
      <p className="text-sm text-white/50 mb-3">Solve today's 1500 ELO puzzle.</p>
      <button className="flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300">
        Solve Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </CardWrapper>
);

export const AIModelsCard = ({ onClick }: { onClick: () => void }) => (
  <CardWrapper className="col-span-1 md:col-span-2 p-5 flex flex-col justify-between relative overflow-hidden" onClick={onClick} delay={0.15}>
    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity blur-[2px]">
      <Bot size={120} />
    </div>
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
        <Bot size={20} />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">Play vs AI</h3>
      <p className="text-sm text-white/60 mb-4 max-w-[200px]">Challenge GPT-5, Claude, Gemini, DeepSeek, and Grok.</p>
      <div className="flex gap-2">
        {['GPT-5', 'Claude 3', 'Gemini'].map(name => (
          <span key={name} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/10 text-white/70 border border-white/5">{name}</span>
        ))}
      </div>
    </div>
  </CardWrapper>
);

export const WatchLiveCard = ({ onClick }: { onClick?: () => void }) => (
  <CardWrapper className="col-span-1 row-span-1 p-5 flex flex-col justify-between" delay={0.2} onClick={onClick}>
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
        <Tv size={20} />
      </div>
      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400 animate-pulse flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> LIVE
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-white mb-1">Watch Matches</h3>
      <p className="text-sm text-white/50 mb-3">Watch GM games live.</p>
      <button className="flex items-center gap-2 text-sm font-semibold text-red-400 group-hover:text-red-300">
        Spectate <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </CardWrapper>
);

export const RecentGamesCard = () => (
  <CardWrapper className="col-span-1 md:col-span-2 row-span-1 p-5 flex flex-col justify-between" delay={0.25}>
    <div className="flex items-center gap-3 mb-4 text-white/70">
      <History size={18} />
      <span className="font-semibold text-sm">Recent Games</span>
    </div>
    
    <div className="flex flex-col gap-2">
      {[
        { opp: 'Stockfish 16', res: '1-0', date: 'Today', oppIcon: '🤖' },
        { opp: 'Guest_7842', res: '1/2-1/2', date: 'Yesterday', oppIcon: '👤' }
      ].map((g, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">{g.oppIcon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{g.opp}</span>
              <span className="text-[10px] text-white/40">{g.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${g.res === '1-0' ? 'text-green-400' : 'text-gray-400'}`}>{g.res}</span>
            <button className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Play size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </CardWrapper>
);

export const TrendingModelsCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5" delay={0.3}>
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp size={18} className="text-[var(--color-accent)]" />
      <h3 className="text-sm font-bold text-white">Trending Models</h3>
    </div>
    <div className="flex flex-col gap-3">
      {[
        { name: 'GPT-5', elo: '3500+' },
        { name: 'Claude 3', elo: '3450' },
        { name: 'Gemini 1.5', elo: '3300' }
      ].map((m, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-sm text-white/80 font-medium">{i+1}. {m.name}</span>
          <span className="text-xs text-[var(--color-accent)]">{m.elo}</span>
        </div>
      ))}
    </div>
  </CardWrapper>
);

export const LatestUpdatesCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5 bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent border-[var(--color-accent)]/30" delay={0.35}>
    <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
      <Sparkles size={18} />
      <span className="text-[10px] font-bold uppercase tracking-widest">v2.1 Update</span>
    </div>
    <h3 className="text-lg font-bold text-white mb-2">New AI Analysis</h3>
    <p className="text-xs text-white/60 mb-4 line-clamp-2">Experience deeper insights with the new Claude 3 Opus analysis engine.</p>
    <button className="text-xs font-bold text-[var(--color-accent)]">Read Release Notes &rarr;</button>
  </CardWrapper>
);

export const LearnChessCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5 flex flex-col justify-between" delay={0.4}>
    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
      <GraduationCap size={20} />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">Academy</h3>
    <p className="text-xs text-white/50 mb-3">Learn strategies from Grandmasters.</p>
  </CardWrapper>
);

export const AnalysisCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5 flex flex-col justify-between" delay={0.45}>
    <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
      <Activity size={20} />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">Analyze</h3>
    <p className="text-xs text-white/50 mb-3">Import PGNs and analyze.</p>
  </CardWrapper>
);

export const LeaderboardsCard = () => (
  <CardWrapper className="col-span-1 row-span-1 p-5 flex flex-col justify-between opacity-70" delay={0.5}>
    <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4">
      <Trophy size={20} />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">Leaderboards</h3>
    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/50 self-start">Coming Soon</span>
  </CardWrapper>
);
