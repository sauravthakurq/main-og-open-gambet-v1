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
    <div className="w-full max-w-[960px] mx-auto relative px-4">
      <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-6 py-6">
            
            {/* Header Area */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => { audioManager.play('select'); onBack(); }} className="text-white/50 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl">
                ← Back
              </button>
              
              <div className="flex items-center gap-3">
                {firebaseUser ? (
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-sm text-white/90 font-bold tracking-wide">{userProfile?.username || 'You'}</span>
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
            <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-3xl shadow-2xl p-8 lg:p-12 flex flex-col justify-end min-h-[280px]">
              <div className="absolute inset-0 bg-[url('/bg.webp')] opacity-20 bg-cover bg-center mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-dim),transparent_70%)] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </div>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={12} /> Global Server • {ping}ms
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg">Play Online</h1>
                <p className="text-white/50 text-sm lg:text-base font-medium max-w-md leading-relaxed">Compete with players worldwide. Climb the ranks, challenge your friends, and master your opening repertoire in real-time matches.</p>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Actions) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4">
                  <StatCard icon={Users} label="Players Online" value={isFirebaseConfigured ? onlineCount.toString() : '—'} />
                  <StatCard icon={Swords} label="Live Games" value={isFirebaseConfigured ? activeGames.toString() : '—'} />
                  <StatCard icon={Trophy} label="Your Rating" value={userProfile?.rating?.toString() || '—'} highlight />
                </div>

                {/* Primary Action */}
                <button 
                  onClick={() => handleGatedAction(() => setView('quickmatch'))}
                  className="group relative w-full rounded-3xl p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[var(--color-accent)]/50 transition-all flex items-center justify-between overflow-hidden shadow-xl hover:shadow-[0_8px_32px_var(--color-accent-dim)] hover:-translate-y-1 active:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Zap size={28} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">Quick Match</span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest">Recommended</span>
                      </div>
                      <span className="text-sm font-medium text-white/50">Find an opponent instantly based on your rating</span>
                    </div>
                  </div>
                  
                  <ChevronRight size={28} className="text-white/20 group-hover:text-white/80 group-hover:translate-x-2 transition-all relative z-10" />
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <SecondaryAction
                    icon={Users}
                    title={isCreating ? "Creating..." : "Create Room"}
                    description="Private match with invite code"
                    onClick={() => handleGatedAction(handleCreateRoom)}
                  />
                  <SecondaryAction
                    icon={Hash}
                    title="Join Room"
                    description="Enter a 6-digit code to join"
                    onClick={() => handleGatedAction(() => setView('join'))}
                  />
                </div>
              </div>

              {/* Right Column (Leaderboard/Social) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Leaderboard Preview */}
                <div className="w-full bg-black/40 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-[var(--color-accent)]" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">Top Players</span>
                    </div>
                    <button onClick={() => setView('leaderboard')} className="text-[11px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {topPlayers.map((p, i) => (
                      <div key={p.uid} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                        <span className={`w-5 text-center text-xs font-black ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-white/20'}`}>{i+1}</span>
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70 shadow-inner">
                          {p.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate flex-1">{p.username}</span>
                        <span className="text-sm font-black text-[var(--color-accent)] tabular-nums">{p.rating}</span>
                      </div>
                    ))}
                    {topPlayers.length === 0 && <span className="text-xs text-white/40 italic py-4 text-center">Loading players...</span>}
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
    <div className={`relative p-5 rounded-3xl border flex flex-col justify-center overflow-hidden transition-colors ${highlight ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30' : 'bg-black/40 border-white/10'}`}>
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <Icon size={14} className={highlight ? 'text-[var(--color-accent)]' : 'text-white/40'} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-[var(--color-accent)]' : 'text-white/40'}`}>{label}</span>
      </div>
      <span className={`text-3xl font-black tracking-tight tabular-nums relative z-10 ${highlight ? 'text-[var(--color-accent)] drop-shadow-md' : 'text-white'}`}>{value}</span>
      {highlight && <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--color-accent)] blur-[40px] opacity-20 pointer-events-none" />}
    </div>
  );
}

function SecondaryAction({ icon: Icon, title, description, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col p-5 rounded-3xl bg-black/40 border border-white/10 hover:border-white/30 transition-all text-left overflow-hidden hover:-translate-y-1 active:translate-y-0"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all">
        <Icon size={18} className="text-white/70 group-hover:text-white" />
      </div>
      <span className="font-bold text-white text-[15px] tracking-wide mb-1">{title}</span>
      <span className="text-xs text-white/40 font-medium">{description}</span>
    </button>
  );
}
