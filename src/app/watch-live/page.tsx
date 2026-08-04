'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Globe, Video, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTopGames, LichessTvGame } from '@/services/lichess/tvApi';
import { LiveGameCard } from '@/components/watch-live/LiveGameCard';
import { HeroBanner } from '@/components/watch-live/HeroBanner';
import { SkeletonCard, SkeletonHero } from '@/components/ui/Skeleton';
import { ImageWithSkeleton } from '@/components/ui/ImageWithSkeleton';

interface Broadcast {
  tour: {
    id: string;
    name: string;
    description: string;
    url: string;
    image?: string;
  };
}

export default function WatchLivePage() {
  const router = useRouter();
  const [games, setGames] = useState<LichessTvGame[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);
  const [activeTab, setActiveTab] = useState<'world' | 'broadcasts'>('broadcasts');

  const fetchGames = async () => {
    try {
      setLoading(true);
      const topGames = await getTopGames();
      setGames(topGames);
    } catch (error) {
      console.error('Failed to fetch live games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      setLoadingBroadcasts(true);
      const response = await fetch('https://lichess.org/api/broadcast');
      if (response.ok) {
        const text = await response.text();
        // The API returns NDJSON (Newline Delimited JSON). Parse each line.
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const parsed = lines.map(line => JSON.parse(line));
        setBroadcasts(parsed);
      }
    } catch (error) {
      console.error('Failed to fetch broadcasts:', error);
    } finally {
      setLoadingBroadcasts(false);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchBroadcasts();
    // Poll every 30 seconds for new top games
    const interval = setInterval(fetchGames, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-white overflow-y-auto font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-6 h-[72px] flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm hidden sm:block">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-sm">Watch Live</span>
        </div>
        <button 
          onClick={() => { fetchGames(); fetchBroadcasts(); }}
          className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${loading ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCw size={18} />
        </button>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 lg:gap-8 relative">
        
        {/* Left Column (Hero, Tabs, Grid) */}
        <div className="flex-1 flex flex-col min-w-0">
          {loadingBroadcasts ? <SkeletonHero /> : <HeroBanner broadcasts={broadcasts} />}

        {/* Tabs for extra content */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit mb-8 mx-auto sm:mx-0">
          {[
            { id: 'broadcasts', icon: Video, label: 'Official Broadcasts' },
            { id: 'world', icon: Globe, label: 'Top Community Games' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-md' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'broadcasts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBroadcasts && broadcasts.length === 0 ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : broadcasts.length === 0 ? (
              <div className="col-span-full w-full h-40 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
                <Video size={40} className="text-white/20 mb-3" />
                <h3 className="text-lg font-bold text-white/80 mb-1">No Broadcasts Active</h3>
                <p className="text-white/50 text-sm">There are no official tournaments right now.</p>
              </div>
            ) : (
              broadcasts.map((broadcast, i) => (
                  <a 
                    key={broadcast.tour.id || i}
                    href={`https://lichess.org/broadcast/-/${broadcast.tour.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden cursor-pointer"
                  >
                    {broadcast.tour.image ? (
                      <div className="relative w-full h-36 shrink-0 border-b border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                        <ImageWithSkeleton 
                          src={broadcast.tour.image} 
                          alt={broadcast.tour.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          wrapperClassName="w-full h-full absolute inset-0"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-36 shrink-0 border-b border-white/10 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                        <Trophy size={48} className="text-white/20" />
                      </div>
                    )}
                    
                    <div className="flex flex-col flex-1 p-5 relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live Tournament</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-1 mb-4">
                        {broadcast.tour.name}
                      </h3>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className="text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors line-clamp-1 max-w-[80%]">
                          {broadcast.tour.description || "Official Lichess Broadcast"}
                        </span>
                        <ExternalLink size={16} className="text-white/30 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </a>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'world' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading && games.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : games.length === 0 ? (
              <div className="w-full h-64 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
                <Globe size={48} className="text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white/80 mb-2">No Live Games Found</h3>
                <p className="text-white/50 text-sm">Check your network connection or try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, i) => (
                  <LiveGameCard key={game.id} game={game} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
        </div>

        {/* Right Column (Sticky Live Board) */}
        <div className="w-full xl:w-[400px] shrink-0">
          <div className="sticky top-[100px] flex flex-col items-center xl:items-start">
            <div className="text-center xl:text-left mb-6">
              <div className="flex items-center justify-center xl:justify-start gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Live Now</h2>
              </div>
              <p className="text-white/50 text-sm">Top rated blitz match</p>
            </div>
            
            <div className="w-full max-w-[400px] aspect-[400/444] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 bg-[#161512] relative">
              <iframe 
                src="https://lichess.org/tv/frame?theme=brown&bg=dark" 
                className="absolute inset-0 w-full h-full"
                frameBorder="0" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
