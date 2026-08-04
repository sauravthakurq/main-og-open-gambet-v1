'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Maximize, RefreshCw, Share2 } from 'lucide-react';
import { SpectatorBoard } from '@/components/watch-live/SpectatorBoard';
import { PlayerCardSpectator } from '@/components/watch-live/PlayerCardSpectator';
import { LiveBadge } from '@/components/watch-live/LiveBadge';
import { fetchLichess } from '@/services/lichess/lichessClient';
import { SkeletonChessBoard, SkeletonText } from '@/components/ui/Skeleton';

export default function WatchGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const [gameData, setGameData] = useState<any>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch to get player names and ratings
    fetch(`https://lichess.org/game/export/${gameId}?tags=true&clocks=false&evals=false&opening=true`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then((data: any) => setGameData(data))
      .catch((err) => console.error('Failed to fetch game metadata', err));
  }, [gameId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-void)] text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="w-full px-4 h-[60px] flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-xl shrink-0 z-50">
        <button 
          onClick={() => router.push('/watch-live')}
          className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Live</span>
        </button>
        
        <div className="flex items-center gap-4">
          <LiveBadge />
          <div className="h-4 w-px bg-white/20" />
          <button className="text-white/50 hover:text-white transition-colors" title="Share Game">
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-2 sm:p-4 gap-4 overflow-hidden relative">
        
        {/* Board Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-0 w-full h-full pb-4">
          
          {!gameData ? (
            <SkeletonChessBoard />
          ) : (
            <div className="w-full max-w-[800px] flex flex-col gap-2">
              {/* Opponent (Top) */}
              <PlayerCardSpectator 
                color="b"
                name={gameData?.players?.black?.user?.name}
                title={gameData?.players?.black?.user?.title}
                rating={gameData?.players?.black?.rating}
                isActive={false} // Would need stream data to know active turn
              />

              <SpectatorBoard 
                gameId={gameId} 
                onMovesUpdate={setMoves} 
              />

              {/* Player (Bottom) */}
              <PlayerCardSpectator 
                color="w"
                name={gameData?.players?.white?.user?.name}
                title={gameData?.players?.white?.user?.title}
                rating={gameData?.players?.white?.rating}
                isActive={true}
              />
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-4 shrink-0 h-full max-h-full">
          <div className="flex-1 bg-black/40 border border-white/[0.05] rounded-2xl p-4 flex flex-col backdrop-blur-xl shadow-2xl">
            <h3 className="font-bold text-lg mb-2">Move History</h3>
            <div className="w-full h-px bg-white/10 mb-4" />
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
              {moves.length === 0 ? (
                <p className="text-white/50 text-sm text-center italic mt-10">Waiting for game to begin...</p>
              ) : (
                <div className="grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-1 text-sm">
                  {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="text-white/30 text-right font-mono py-1">{i + 1}.</div>
                      <div className="text-white hover:bg-white/10 px-2 py-1 rounded cursor-pointer">{moves[i * 2]}</div>
                      <div className="text-white hover:bg-white/10 px-2 py-1 rounded cursor-pointer">{moves[i * 2 + 1] || ''}</div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors">
                Flip Board
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20 font-semibold text-sm transition-colors">
                Analyze
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
