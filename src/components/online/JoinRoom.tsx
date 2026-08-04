'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeySquare, Loader2, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { PrivateRoom } from '@/lib/firebase-types';

interface JoinRoomProps {
  onBack: () => void;
  onJoined: (roomId: string) => void;
}

export default function JoinRoom({ onBack, onJoined }: JoinRoomProps) {
  const { firebaseUser, userProfile, setActiveRoom } = useOnlineStore();
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db || !firebaseUser || !userProfile) return;
    if (code.trim().length !== 6) {
      setError('Please enter a valid 6-character room code.');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const roomQuery = query(
        collection(db, 'rooms'),
        where('code', '==', code.trim().toUpperCase()),
        where('status', '==', 'open')
      );
      const snap = await getDocs(roomQuery);
      if (snap.empty) {
        setError('Room not found or already full. Check the code and try again.');
        setIsJoining(false);
        return;
      }

      const roomDoc = snap.docs[0];
      const room = roomDoc.data() as PrivateRoom;

      if (room.hostUid === firebaseUser.uid) {
        setError("You can't join your own room.");
        setIsJoining(false);
        return;
      }

      // Write join request to room
      await updateDoc(doc(db, 'rooms', roomDoc.id), {
        guestUid: firebaseUser.uid,
        guestProfile: {
          uid: firebaseUser.uid,
          username: userProfile.username,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          rating: userProfile.rating,
        },
      });

      setActiveRoom(roomDoc.id, code.trim().toUpperCase());
      onJoined(roomDoc.id);
    } catch (e: any) {
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center py-8 px-4 sm:px-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <button onClick={onBack} className="self-start text-white/50 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
          ← Back to Lobby
        </button>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md hidden sm:block">Join Room</h2>
      </div>

      <motion.form
        onSubmit={handleJoin}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4"
      >
        <div className="bg-black/40 border border-white/10 rounded-[32px] p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-[50%] bg-[radial-gradient(ellipse_at_top,var(--color-accent-dim),transparent_70%)] pointer-events-none opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mb-6 sm:mb-8 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <KeySquare size={28} className="text-[var(--color-accent)] sm:w-8 sm:h-8" />
            </div>
            
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Enter Room Code</h3>
              <p className="text-xs sm:text-sm text-white/50 font-bold tracking-wide">Ask your friend for their 6-character code</p>
            </div>

            <div className="w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-50 transition-opacity" />
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(''); }}
                placeholder="A7K9X2"
                maxLength={6}
                className="relative w-full text-center px-4 py-5 sm:py-6 bg-[#1A1A1C] border-2 border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-[var(--color-accent)]/50 transition-all text-3xl sm:text-4xl font-black font-mono tracking-[0.4em] sm:tracking-[0.5em] uppercase shadow-inner"
                autoFocus
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full mt-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-400 font-bold">{error}</p>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isJoining || code.length !== 6 || !isFirebaseConfigured}
              className="mt-6 sm:mt-8 w-full py-4 sm:py-5 rounded-2xl sm:rounded-[24px] bg-[var(--color-accent)] hover:brightness-110 text-black font-black text-base sm:text-lg transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_24px_var(--color-accent-dim)] group relative overflow-hidden"
            >
              {!isJoining && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />}
              {isJoining ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span className="tracking-wide">Join Room</span>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
