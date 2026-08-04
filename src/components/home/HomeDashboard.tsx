'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import AIParticles from './AIParticles';
import { 
  PuzzlesCard, AIModelsCard, WatchLiveCard, RecentGamesCard, 
  TrendingModelsCard, LatestUpdatesCard, LearnChessCard, 
  AnalysisCard, LeaderboardsCard 
} from './DashboardCards';

const HERO_IMAGES = [
  '/dramatic-chess-piece_23-2151178536.jpg.avif',
  '/digital-art-style-abstract-chess-pieces_23-2151476046.jpg.avif',
  '/digital-art-style-abstract-chess-pieces_23-2151476060.jpg.avif',
  '/dramatic-chess-match-scene-intense-closeup-dark-background-copyspace-cinematic-atmosphere-free-photo.jpeg'
];

interface HomeDashboardProps {
  onStartNewGame: () => void;
  onContinueLastMatch: () => void;
}

import { useRouter } from 'next/navigation';

export default function HomeDashboard({ onStartNewGame, onContinueLastMatch }: HomeDashboardProps) {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    // Pick random hero image on mount
    const randomImg = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
    setHeroImage(randomImg);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-void)] text-white overflow-y-auto overflow-x-hidden pt-24 pb-20 selection:bg-white/20">
      
      {/* Background Particles */}
      <AIParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-6">
        
        {/* HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[360px] md:h-[420px] rounded-[32px] overflow-hidden group shadow-2xl"
        >
          {/* Animated Background */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage}')` }}
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          />
          
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Glassmorphism Inner Border */}
          <div className="absolute inset-0 border-[2px] border-white/10 rounded-[32px] pointer-events-none mix-blend-overlay" />

          {/* Content */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
              Master the Board
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-lg mb-8 drop-shadow-sm font-medium">
              Challenge the world's most advanced AI models or practice your tactical vision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onContinueLastMatch}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 duration-200"
              >
                <Play size={18} fill="currentColor" />
                Continue Match
              </button>
              
              <button 
                onClick={onStartNewGame}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors hover:scale-105 active:scale-95 duration-200"
              >
                <Plus size={18} />
                New Game
              </button>
            </div>
          </div>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full auto-rows-[160px]">
          <AIModelsCard onClick={onStartNewGame} />
          <RecentGamesCard />
          <PuzzlesCard />
          <WatchLiveCard onClick={() => router.push('/watch-live')} />
          <LearnChessCard />
          <AnalysisCard />
          <TrendingModelsCard />
          <LatestUpdatesCard />
          <LeaderboardsCard />
        </div>

      </div>
    </div>
  );
}
