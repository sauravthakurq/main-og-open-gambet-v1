'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Zap, Users, Trophy, Clock, ArrowRight,
  ChevronRight, Wifi, Crown, LogOut, User, Activity, Swords, Hash
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { signOut } from '@/hooks/useFirebaseAuth';
import AuthModal from './AuthModal';
import QuickMatch from './QuickMatch';
import JoinRoom from './JoinRoom';
import RoomScreen from './RoomScreen';
import Leaderboard from './Leaderboard';
import { LeaderboardEntry, PrivateRoom } from '@/lib/firebase-types';
import { audioManager } from '@/lib/audioManager';

interface OnlineLobbyProps {
  onBack: () => void;
}

export default function OnlineLobby({ onBack }: OnlineLobbyProps) {
  const { firebaseUser, userProfile, isAuthLoading } = useOnlineStore();
  const [view, setView] = useState<'lobby' | 'quickmatch' | 'create' | 'join' | 'leaderboard' | 'room'>('lobby');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [activeGames, setActiveGames] = useState(0);
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [ping] = useState(() => Math.floor(Math.random() * 20) + 15);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    if (rtdb) {
      const presenceRef = ref(rtdb, 'presence');
      const unsub = onValue(presenceRef, (snap) => {
        let count = 0;
        if (snap.val()) {
          Object.values(snap.val()).forEach((v: any) => { if (v?.online) count++; });
        }
        setOnlineCount(count);
      });
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const gamesQuery = query(collection(db, 'games'), where('status', '==', 'active'), limit(50));
    const unsub = onSnapshot(gamesQuery, (snap) => setActiveGames(snap.size));

    const lbQuery = query(collection(db, 'users'), orderBy('rating', 'desc'), limit(5));
    const lbUnsub = onSnapshot(lbQuery, (snap) => setTopPlayers(snap.docs.map(d => d.data() as LeaderboardEntry)));

    return () => { unsub(); lbUnsub(); };
  }, []);

  const handleGatedAction = (action: () => void) => {
    audioManager.play('select');
    if (!firebaseUser) setShowAuth(true);
    else action();
  };

  const handleCreateRoom = async () => {
    if (!isFirebaseConfigured || !db || !firebaseUser || !userProfile) return;
    setIsCreating(true);
    try {
      const code = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
      const room: Omit<PrivateRoom, 'id'> = {
        code, hostUid: firebaseUser.uid,
        hostProfile: { uid: firebaseUser.uid, username: userProfile.username, displayName: userProfile.displayName, photoURL: userProfile.photoURL, rating: userProfile.rating },
        guestUid: null, guestProfile: null, status: 'open', timeControl: { minutes: 10, increment: 0 }, isRated: true, spectatorsAllowed: true, isPublic: false, hostColorPreference: 'random', isLocked: false, hostReady: false, guestReady: false, createdAt: serverTimestamp() as Timestamp, gameId: null,
      };
      const roomRef = await addDoc(collection(db, 'rooms'), room);
      setRoomId(roomRef.id);
      setView('room');
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-100px)] max-w-[1200px] mx-auto relative px-4 sm:px-6 flex flex-col">
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-6 py-6 flex-1">
            
            {/* Header Area */}
            <div className="flex items-center justify-between">
              <button onClick={() => { audioManager.play('select'); onBack(); }} className="text-white/50 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                ← Back
              </button>
              
              <div className="flex items-center gap-3">
                {firebaseUser ? (
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-sm text-white/90 font-bold tracking-wide truncate max-w-[100px] sm:max-w-none">{userProfile?.username || 'You'}</span>
                    <button onClick={signOut} className="ml-2 p-1 rounded-md text-white/30 hover:text-white/80 hover:bg-white/10 transition-colors"><LogOut size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 bg-[var(--color-accent)] hover:brightness-110 px-5 py-2.5 rounded-xl text-sm text-black font-bold transition-all shadow-[0_4px_16px_var(--color-accent-dim)]">
                    <User size={16} /> Sign In
                  </button>
                )}
              </div>
            </div>

            {/* AAA Hero Section */}
            <div className="relative w-full rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 lg:p-12 flex flex-col justify-end min-h-[220px] sm:min-h-[280px]">
              <div className="absolute inset-0 bg-[url('/bg.webp')] opacity-20 bg-cover bg-center mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              <div className="absolute top-0 right-0 w-[80%] sm:w-[60%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-dim),transparent_70%)] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </div>
                  <span className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={12} /> Global Server • {ping}ms
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg">Play Online</h1>
                <p className="text-white/50 text-xs sm:text-sm lg:text-base font-medium max-w-md leading-relaxed hidden sm:block">Compete with players worldwide. Climb the ranks, challenge your friends, and master your opening repertoire in real-time matches.</p>
              </div>
            </div>

            {/* Strict CSS Grid Layout for Stats and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 flex-1 min-h-0">
              
              {/* Left Column (Stats & Actions) */}
              <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                
                {/* Stats Bar (Responsive wrap) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <StatCard icon={Users} label="Online" value={isFirebaseConfigured ? onlineCount.toString() : '—'} />
                  <StatCard icon={Swords} label="Matches" value={isFirebaseConfigured ? activeGames.toString() : '—'} />
                  <StatCard icon={Trophy} label="Rating" value={userProfile?.rating?.toString() || '—'} highlight />
                </div>

                {/* Primary Action - Quick Match */}
                <button 
                  onClick={() => handleGatedAction(() => setView('quickmatch'))}
                  className="group relative w-full rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 hover:border-[var(--color-accent)]/50 transition-all flex items-center justify-between overflow-hidden shadow-xl hover:shadow-[0_8px_32px_var(--color-accent-dim)] hover:-translate-y-1 active:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10 min-w-0">
                    <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Zap size={24} className="text-[var(--color-accent)] sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-md truncate">Quick Match</span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shrink-0 hidden sm:inline-block">Recommended</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-white/50 truncate">Find an opponent instantly based on rating</span>
                    </div>
                  </div>
                  
                  <ChevronRight size={24} className="text-white/20 group-hover:text-white/80 group-hover:translate-x-2 transition-all relative z-10 shrink-0 sm:w-7 sm:h-7" />
                </button>

                {/* Secondary Actions (Side by Side) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-1">
                  <SecondaryAction
                    icon={Users}
                    title={isCreating ? "Creating..." : "Create Room"}
                    description="Private match"
                    onClick={() => handleGatedAction(handleCreateRoom)}
                  />
                  <SecondaryAction
                    icon={Hash}
                    title="Join Room"
                    description="Use 6-digit code"
                    onClick={() => handleGatedAction(() => setView('join'))}
                  />
                </div>
              </div>

              {/* Right Column (Leaderboard) */}
              <div className="md:col-span-5 lg:col-span-4 flex flex-col min-w-0 h-full">
                <div className="w-full bg-black/40 border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col h-full min-h-[300px]">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-[var(--color-accent)]" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">Top Players</span>
                    </div>
                    <button onClick={() => setView('leaderboard')} className="text-[10px] sm:text-[11px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {topPlayers.map((p, i) => (
                      <div key={p.uid} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group cursor-default">
                        <span className={`w-5 text-center text-xs font-black ${i === 0 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-white/20'}`}>{i+1}</span>
                        <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70 shadow-inner shrink-0 overflow-hidden">
                          {p.photoURL ? <img src={p.photoURL} alt={p.username} className="w-full h-full object-cover" /> : p.displayName?.[0]?.toUpperCase() || '?'}
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1A1A1C] ${p.online ? 'bg-emerald-500' : 'bg-white/20'}`} />
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate flex-1">{p.username}</span>
                        <span className="text-sm font-black text-[var(--color-accent)] tabular-nums shrink-0">{p.rating}</span>
                      </div>
                    ))}
                    {topPlayers.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50 py-8">
                        <Activity className="animate-pulse" size={24} />
                        <span className="text-xs font-medium uppercase tracking-widest">Loading ranks...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {view === 'quickmatch' && <QuickMatch onBack={() => setView('lobby')} />}
        {view === 'join' && <JoinRoom onBack={() => setView('lobby')} onJoined={(id) => { setRoomId(id); setView('room'); }} />}
        {view === 'room' && roomId && <RoomScreen roomId={roomId} onBack={() => { setRoomId(null); setView('lobby'); }} onStartGame={() => {}} />}
        {view === 'leaderboard' && <Leaderboard onBack={() => setView('lobby')} />}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, highlight = false }: any) {
  return (
    <div className={`relative p-3 sm:p-5 rounded-[20px] sm:rounded-3xl border flex flex-col justify-center overflow-hidden transition-colors ${highlight ? 'bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border-[var(--color-accent)]/30' : 'bg-black/40 border-white/10'}`}>
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 relative z-10">
        <Icon size={12} className={`sm:w-3.5 sm:h-3.5 ${highlight ? 'text-[var(--color-accent)]' : 'text-white/40'}`} />
        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate ${highlight ? 'text-[var(--color-accent)]' : 'text-white/40'}`}>{label}</span>
      </div>
      <span className={`text-xl sm:text-3xl font-black tracking-tight tabular-nums relative z-10 truncate ${highlight ? 'text-[var(--color-accent)] drop-shadow-md' : 'text-white'}`}>{value}</span>
      {highlight && <div className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-[var(--color-accent)] blur-[30px] opacity-20 pointer-events-none" />}
    </div>
  );
}

function SecondaryAction({ icon: Icon, title, description, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col justify-between p-4 sm:p-6 rounded-[20px] sm:rounded-[32px] bg-black/40 border border-white/10 hover:border-white/30 transition-all text-left overflow-hidden hover:-translate-y-1 active:translate-y-0 min-h-[100px] sm:min-h-[140px]"
    >
      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all shrink-0">
        <Icon size={16} className="text-white/70 group-hover:text-white sm:w-5 sm:h-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-white text-sm sm:text-lg tracking-wide mb-0.5 sm:mb-1 truncate">{title}</span>
        <span className="text-[10px] sm:text-xs text-white/40 font-medium truncate">{description}</span>
      </div>
    </button>
  );
}
