'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LichessTvGame } from '@/services/lichess/tvApi';
import { LiveBadge } from './LiveBadge';

interface LiveGameCardProps {
  game: LichessTvGame;
  index: number;
}

export const LiveGameCard: React.FC<LiveGameCardProps> = ({ game, index }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => router.push(`/watch-live/${game.id}`)}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer group transition-all duration-150 p-5 flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <LiveBadge />
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/10 text-white/70 border border-white/5 uppercase tracking-widest">
          {game.rating > 2800 ? 'GM Match' : 'High ELO'}
        </span>
      </div>
      
      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-wide">
            {game.player.title && <span className="text-[#e1aa53] mr-1">{game.player.title}</span>}
            {game.player.name}
          </span>
          <span className="text-sm font-semibold text-white/50">{game.rating} ELO</span>
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#e1aa53] group-hover:text-black transition-colors duration-150">
          <Play size={16} fill="currentColor" className="ml-0.5" />
        </button>
      </div>
    </motion.div>
  );
};
