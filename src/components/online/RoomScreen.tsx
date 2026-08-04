'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Clock, Shield, Globe, Lock, Play, Link as LinkIcon, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { doc, onSnapshot, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useAppStore } from '@/store/useAppStore';
import { PrivateRoom } from '@/lib/firebase-types';

interface RoomScreenProps {
  roomId: string;
  onBack: () => void;
  onStartGame: () => void;
}

export default function RoomScreen({ roomId, onBack, onStartGame }: RoomScreenProps) {
  const { firebaseUser, userProfile, setOnlineGameId } = useOnlineStore();
  const { updateMatchConfig } = useAppStore();
  
  const [room, setRoom] = useState<PrivateRoom | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Local Config state (only editable by Host before lock)
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(0);
  const [isRated, setIsRated] = useState(true);
  const [hostColor, setHostColor] = useState<'white' | 'black' | 'random'>('random');

  const isHost = firebaseUser?.uid === room?.hostUid;
  const isGuest = firebaseUser?.uid === room?.guestUid;

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !roomId) return;
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PrivateRoom;
        setRoom(data);
        
        // Sync local state for guest or host if already saved
        if (data.timeControl) {
          setMinutes(data.timeControl.minutes);
          setIncrement(data.timeControl.increment);
        }
        if (data.isRated !== undefined) setIsRated(data.isRated);
        if (data.hostColorPreference) setHostColor(data.hostColorPreference);

        if (data.status === 'started' && data.gameId) {
          setOnlineGameId(data.gameId);
          // The host's color preference dictates the guest's color.
          // If random, we need to check the actual game document, but for now we set a temp color and let useOnlineGameSync correct it.
          const myAssignedColor = data.hostUid === firebaseUser?.uid 
            ? (data.hostColorPreference === 'black' ? 'b' : 'w')
            : (data.hostColorPreference === 'black' ? 'w' : 'b');
          
          updateMatchConfig({ opponentType: 'online', color: myAssignedColor });
          onStartGame();
        }
      }
    });
    return unsub;
  }, [roomId, firebaseUser?.uid, onStartGame, setOnlineGameId, updateMatchConfig]);

  // Handle Game Creation when both are ready
  useEffect(() => {
    if (isHost && room?.hostReady && room?.guestReady && room.status === 'open' && !room.gameId) {
      const createGame = async () => {
        const { addDoc: addDocument, collection: col } = await import('firebase/firestore');
        
        let finalHostColor = hostColor;
        if (finalHostColor === 'random') {
          finalHostColor = Math.random() > 0.5 ? 'white' : 'black';
        }

        const isHostWhite = finalHostColor === 'white';

        const gameData = {
          whiteUid: isHostWhite ? room.hostUid : room.guestUid,
          blackUid: isHostWhite ? room.guestUid : room.hostUid,
          whiteProfile: isHostWhite ? room.hostProfile : room.guestProfile,
          blackProfile: isHostWhite ? room.guestProfile : room.hostProfile,
          status: 'active',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          pgn: '',
          turn: 'w',
          moveCount: 0,
          timeControl: room.timeControl,
          whiteTimeMs: room.timeControl ? room.timeControl.minutes * 60 * 1000 : 0,
          blackTimeMs: room.timeControl ? room.timeControl.minutes * 60 * 1000 : 0,
          lastMoveAt: null,
          createdAt: serverTimestamp() as Timestamp,
          result: null,
          endReason: null,
          drawOfferBy: null,
          isPrivate: true,
          roomCode: room.code,
          spectatorCount: 0,
        };

        const gameRef = await addDocument(col(db, 'games'), gameData);
        await updateDoc(doc(db, 'rooms', roomId), {
          status: 'started',
          gameId: gameRef.id,
          hostColorPreference: finalHostColor // Save the finalized random color if it was random
        });
      };
      createGame();
    }
  }, [isHost, room, hostColor, roomId]);

  const copyCode = () => {
    if (!room?.code) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLockSettings = async () => {
    if (!isHost || !db) return;
    await updateDoc(doc(db, 'rooms', roomId), {
      timeControl: { minutes, increment },
      isRated,
      hostColorPreference: hostColor,
      isLocked: true
    });
  };

  const handleReady = async () => {
    if (!db) return;
    if (isHost) {
      await updateDoc(doc(db, 'rooms', roomId), { hostReady: true });
    } else if (isGuest) {
      await updateDoc(doc(db, 'rooms', roomId), { guestReady: true });
    }
  };

  if (!room) return null;

  return (
    <div className="w-full max-w-[600px] mx-auto min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          ← Leave Room
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-sm text-white/50 uppercase tracking-widest font-bold">Room Code</span>
            <span className="text-xl font-black text-white tracking-widest">{room.code}</span>
            <button onClick={copyCode} className="text-white/30 hover:text-white transition-colors">
              {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Host Card */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-white">{room.hostProfile.displayName?.[0]?.toUpperCase() || 'H'}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{room.hostProfile.username}</h3>
            <span className="text-xs text-white/50 uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full mb-3">Host</span>
            <div className="text-sm font-bold text-white/80">{room.hostProfile.rating} Elo</div>
            {room.hostReady && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full text-sm font-bold">
                <CheckCircle2 size={16} /> Ready
              </div>
            )}
          </div>
        </div>

        {/* Guest Card */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center text-center relative z-10">
            {room.guestProfile ? (
              <>
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-white">{room.guestProfile.displayName?.[0]?.toUpperCase() || 'G'}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{room.guestProfile.username}</h3>
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full mb-3">Guest</span>
                <div className="text-sm font-bold text-white/80">{room.guestProfile.rating} Elo</div>
                {room.guestReady && (
                  <div className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full text-sm font-bold">
                    <CheckCircle2 size={16} /> Ready
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-6">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4 animate-spin-slow">
                  <div className="w-2 h-2 bg-white/30 rounded-full" />
                </div>
                <div className="text-white/40 font-medium">Waiting for opponent...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match Configuration */}
      <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[24px] p-8 shadow-2xl mb-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <Shield size={20} className="text-purple-400" />
          Match Configuration
          {room.isLocked && <Lock size={16} className="text-emerald-400 ml-auto" />}
        </h3>

        {(!isHost || room.isLocked) ? (
          // Read-only view
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <span className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-1">Time Control</span>
              <span className="text-lg font-bold text-white">{minutes}+{increment}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <span className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-1">Type</span>
              <span className="text-lg font-bold text-white">{isRated ? 'Rated' : 'Casual'}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 col-span-2">
              <span className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-1">Host Plays As</span>
              <span className="text-lg font-bold text-white capitalize">{hostColor}</span>
            </div>
          </div>
        ) : (
          // Host editable view
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-2">Minutes</label>
                <select value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50">
                  {[1, 3, 5, 10, 15, 30].map(m => <option key={m} value={m} className="bg-[#1a1a1c]">{m} min</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-2">Increment</label>
                <select value={increment} onChange={e => setIncrement(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50">
                  {[0, 1, 2, 3, 5, 10].map(i => <option key={i} value={i} className="bg-[#1a1a1c]">{i} sec</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-2">Type</label>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                  <button onClick={() => setIsRated(true)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isRated ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>Rated</button>
                  <button onClick={() => setIsRated(false)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isRated ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}>Casual</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase font-bold tracking-wider block mb-2">You Play As</label>
                <select value={hostColor} onChange={e => setHostColor(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50">
                  <option value="white" className="bg-[#1a1a1c]">White</option>
                  <option value="black" className="bg-[#1a1a1c]">Black</option>
                  <option value="random" className="bg-[#1a1a1c]">Random</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex justify-center">
        {!room.guestUid ? (
          <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium flex items-center gap-3">
            <Loader2 size={16} className="animate-spin" /> Waiting for guest to join...
          </div>
        ) : (
          <>
            {isHost && !room.isLocked && (
              <button 
                onClick={handleLockSettings} 
                className="group relative px-8 py-4 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 text-white font-bold rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_32px_var(--color-accent-dim)] transition-all hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] w-full max-w-[300px] flex items-center justify-center gap-3 overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-150" />
                <ShieldCheck size={20} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                <span className="tracking-wide text-white/90 group-hover:text-white">Lock Configuration</span>
              </button>
            )}
            
            {isGuest && !room.isLocked && (
              <div className="w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
                <span className="text-white/50 font-medium block text-center">Host is configuring the match...</span>
              </div>
            )}

            {room.isLocked && ((isHost && !room.hostReady) || (isGuest && !room.guestReady)) && (
              <button onClick={handleReady} className="group relative px-8 py-4 bg-[var(--color-accent)] text-black font-bold rounded-2xl shadow-[0_0_24px_var(--color-accent-dim)] hover:shadow-[0_0_32px_rgba(184,164,142,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-3 w-full max-w-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <Play size={20} className="fill-black group-hover:scale-110 transition-transform" /> 
                <span className="tracking-wide uppercase text-sm">Ready to Play</span>
              </button>
            )}

            {room.isLocked && ((isHost && room.hostReady) || (isGuest && room.guestReady)) && (
              <div className="relative px-8 py-4 bg-black/40 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold rounded-2xl shadow-[0_0_24px_var(--color-accent-dim)] flex flex-col items-center justify-center gap-1 w-full max-w-[300px] backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)]/10 to-transparent w-[200%] animate-shimmer" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <Loader2 size={20} className="animate-spin opacity-80" />
                    <div className="absolute inset-0 bg-[var(--color-accent)] blur-md opacity-40 animate-pulse" />
                  </div>
                  <span className="tracking-wide text-[var(--color-accent)] drop-shadow-md">Waiting for opponent...</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1 relative z-10 font-semibold">Room Ready</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
