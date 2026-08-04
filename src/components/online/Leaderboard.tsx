'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { LeaderboardEntry } from '@/lib/firebase-types';

interface LeaderboardProps {
  onBack: () => void;
  compact?: boolean;
}

export default function Leaderboard({ onBack, compact = false }: LeaderboardProps) {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      orderBy('rating', 'desc'),
      limit(compact ? 10 : 50)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPlayers(snap.docs.map(d => d.data() as LeaderboardEntry));
      setLoading(false);
    });

    return unsub;
  }, []);

  const medalIcon = (idx: number) => {
    if (idx === 0) return <Crown size={16} className="text-amber-400" />;
    if (idx === 1) return <Medal size={16} className="text-slate-300" />;
    if (idx === 2) return <Medal size={16} className="text-amber-700" />;
    return <span className="text-xs text-white/30 w-4 text-center">{idx + 1}</span>;
  };

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            Leaderboard
          </h2>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12">
          <Trophy size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No players yet. Be the first!</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 bg-white/[0.02] border-b border-white/[0.06]">
            <span className="text-[10px] text-white/30 uppercase tracking-wider w-8">#</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Player</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Rating</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:block">Wins</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:block">Games</span>
          </div>

          {players.map((player, idx) => (
            <motion.div
              key={player.uid}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center border-b border-white/[0.04] last:border-0 ${idx === 0 ? 'bg-amber-500/5' : ''} hover:bg-white/[0.03] transition-colors`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {medalIcon(idx)}
              </div>

              {/* Player */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0 overflow-hidden">
                  {player.photoURL ? (
                    <img src={player.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    player.displayName?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{player.username}</p>
                  {player.country && (
                    <p className="text-[10px] text-white/30">{player.country}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <span className={`text-sm font-bold tabular-nums ${idx === 0 ? 'text-amber-400' : 'text-white'}`}>
                {player.rating}
              </span>

              {/* Wins */}
              <span className="text-sm text-emerald-400 font-medium hidden sm:block">{player.wins}</span>

              {/* Games */}
              <span className="text-sm text-white/40 hidden sm:block">{player.gamesPlayed}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
