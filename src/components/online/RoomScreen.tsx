'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Clock, Shield, Globe, Lock, Play, Link as LinkIcon, CheckCircle2, Loader2, ShieldCheck, Crown } from 'lucide-react';
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
    <div className="w-full max-w-[800px] mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center py-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button onClick={onBack} className="self-start text-white/50 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
          ← Leave Room
        </button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Room Code</span>
              <span className="text-2xl font-black text-white tracking-widest leading-none drop-shadow-md">{room.code}</span>
            </div>
            <button 
              onClick={copyCode} 
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'}`}
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-dim),transparent_70%)] pointer-events-none opacity-30" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          
          {/* Player Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Host Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 sm:p-8 relative overflow-hidden flex flex-col items-center text-center shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1A1A1C] border-2 border-[var(--color-accent)]/30 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(0,0,0,0.5)]">
                    {room.hostProfile.photoURL ? (
                      <img src={room.hostProfile.photoURL} alt={room.hostProfile.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-[var(--color-accent)]">{room.hostProfile.displayName?.[0]?.toUpperCase() || 'H'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#1A1A1C] p-1 rounded-full border border-white/10">
                    <Crown size={16} className="text-amber-400" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-1 truncate w-full px-4">{room.hostProfile.username}</h3>
                <span className="text-[10px] text-[var(--color-accent)] uppercase tracking-widest font-black mb-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10">Host</span>
                <div className="text-sm font-bold text-white/50">{room.hostProfile.rating} Elo</div>
                
                <div className="h-10 mt-4 flex items-center justify-center">
                  {room.hostReady ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-full text-sm font-black border border-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={18} /> Ready
                    </div>
                  ) : (
                    <div className="text-white/30 text-xs font-bold uppercase tracking-widest">Configuring...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Guest Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 sm:p-8 relative overflow-hidden flex flex-col items-center text-center shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 w-full flex flex-col items-center justify-center h-full min-h-[220px]">
                {room.guestProfile ? (
                  <>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1A1A1C] border-2 border-blue-500/30 flex items-center justify-center mb-4 overflow-hidden shadow-[0_0_24px_rgba(0,0,0,0.5)]">
                      {room.guestProfile.photoURL ? (
                        <img src={room.guestProfile.photoURL} alt={room.guestProfile.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black text-blue-400">{room.guestProfile.displayName?.[0]?.toUpperCase() || 'G'}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-white mb-1 truncate w-full px-4">{room.guestProfile.username}</h3>
                    <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black mb-2 px-3 py-1 rounded-full bg-blue-500/10">Guest</span>
                    <div className="text-sm font-bold text-white/50">{room.guestProfile.rating} Elo</div>
                    
                    <div className="h-10 mt-4 flex items-center justify-center">
                      {room.guestReady ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-full text-sm font-black border border-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 size={18} /> Ready
                        </div>
                      ) : (
                        <div className="text-white/30 text-xs font-bold uppercase tracking-widest">Waiting...</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full opacity-60">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6 animate-[spin_8s_linear_infinite]">
                      <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
                    </div>
                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Waiting for player...</span>
                    <span className="text-white/30 text-xs mt-2">Share code to invite</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Match Configuration */}
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-inner mb-8 flex-1">
            <h3 className="text-base sm:text-lg font-black text-white mb-6 flex items-center gap-3">
              <Shield size={20} className="text-[var(--color-accent)]" />
              Match Settings
              {room.isLocked && <div className="ml-auto flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest"><Lock size={12} /> Locked</div>}
            </h3>

            {(!isHost || room.isLocked) ? (
              // Read-only view
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 uppercase font-black tracking-widest">Time Control</span>
                  <span className="text-lg sm:text-xl font-black text-white">{minutes}+{increment}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 uppercase font-black tracking-widest">Match Type</span>
                  <span className="text-base sm:text-lg font-black text-white">{isRated ? 'Rated' : 'Casual'}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-5 sm:col-span-2 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 uppercase font-black tracking-widest">Host Plays As</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border border-white/20 ${hostColor === 'white' ? 'bg-white' : hostColor === 'black' ? 'bg-black' : 'bg-gradient-to-r from-white to-black'}`} />
                    <span className="text-base sm:text-lg font-black text-white capitalize">{hostColor}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Host editable view
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-[11px] text-white/50 uppercase font-black tracking-widest pl-1">Minutes</label>
                    <select value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-base sm:text-lg font-bold outline-none focus:border-[var(--color-accent)]/50 transition-colors appearance-none cursor-pointer">
                      {[1, 3, 5, 10, 15, 30].map(m => <option key={m} value={m} className="bg-[#1A1A1C]">{m} min</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-[11px] text-white/50 uppercase font-black tracking-widest pl-1">Increment</label>
                    <select value={increment} onChange={e => setIncrement(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-base sm:text-lg font-bold outline-none focus:border-[var(--color-accent)]/50 transition-colors appearance-none cursor-pointer">
                      {[0, 1, 2, 3, 5, 10].map(i => <option key={i} value={i} className="bg-[#1A1A1C]">{i} sec</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-[11px] text-white/50 uppercase font-black tracking-widest pl-1">Match Type</label>
                    <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1.5 h-[60px]">
                      <button onClick={() => setIsRated(true)} className={`flex-1 rounded-xl text-sm font-black transition-all ${isRated ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>Rated</button>
                      <button onClick={() => setIsRated(false)} className={`flex-1 rounded-xl text-sm font-black transition-all ${!isRated ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>Casual</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-[11px] text-white/50 uppercase font-black tracking-widest pl-1">You Play As</label>
                    <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1.5 h-[60px]">
                      {['white', 'random', 'black'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setHostColor(color as any)} 
                          className={`flex-1 flex justify-center items-center rounded-xl transition-all ${hostColor === color ? 'bg-white/20 shadow-sm' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 border-white/20 ${color === 'white' ? 'bg-white' : color === 'black' ? 'bg-black' : 'bg-gradient-to-br from-white to-black'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex justify-center mt-auto">
            {!room.guestUid ? (
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 size={24} className="animate-spin text-[var(--color-accent)] opacity-80" />
                <span className="text-white/80 text-sm font-bold">Waiting for opponent to join...</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Share code: {room.code}</span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                {isHost && !room.isLocked && (
                  <button 
                    onClick={handleLockSettings} 
                    className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-[var(--color-accent)] hover:brightness-110 text-black font-black rounded-[20px] sm:rounded-[24px] shadow-[0_4px_24px_var(--color-accent-dim)] transition-all hover:-translate-y-1 active:translate-y-0 w-full sm:max-w-[400px] flex items-center justify-center gap-3 overflow-hidden text-base sm:text-lg"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    <ShieldCheck size={22} className="fill-black/10" />
                    <span className="tracking-wide">Lock Settings</span>
                  </button>
                )}
                
                {isGuest && !room.isLocked && (
                  <div className="w-full sm:max-w-[400px] overflow-hidden rounded-[24px] bg-white/5 border border-white/10 p-5 relative text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />
                    <span className="text-[var(--color-accent)] font-bold text-sm block">Host is configuring the match...</span>
                  </div>
                )}

                {room.isLocked && ((isHost && !room.hostReady) || (isGuest && !room.guestReady)) && (
                  <button 
                    onClick={handleReady} 
                    className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-[var(--color-accent)] hover:brightness-110 text-black font-black rounded-[20px] sm:rounded-[24px] shadow-[0_0_32px_var(--color-accent-dim)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 w-full sm:max-w-[400px] overflow-hidden text-base sm:text-lg"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    <Play size={22} className="fill-black" /> 
                    <span className="tracking-wide uppercase">Ready to Play</span>
                  </button>
                )}

                {room.isLocked && ((isHost && room.hostReady) || (isGuest && room.guestReady)) && (
                  <div className="relative px-6 sm:px-8 py-4 sm:py-5 bg-[#1A1A1C] border-2 border-[var(--color-accent)]/30 text-[var(--color-accent)] font-black rounded-[20px] sm:rounded-[24px] shadow-[0_0_24px_var(--color-accent-dim)] flex flex-col items-center justify-center gap-1.5 w-full sm:max-w-[400px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)]/10 to-transparent w-[200%] animate-shimmer" />
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="relative">
                        <Loader2 size={24} className="animate-spin" />
                        <div className="absolute inset-0 bg-[var(--color-accent)] blur-md opacity-40 animate-pulse" />
                      </div>
                      <span className="tracking-wide drop-shadow-md text-base sm:text-lg">Waiting for opponent...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
