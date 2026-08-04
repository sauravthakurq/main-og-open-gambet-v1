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
    <div className="w-full max-w-[480px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-white">Join Room</h2>
      </div>

      <motion.form
        onSubmit={handleJoin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/[0.08] flex flex-col items-center gap-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="w-20 h-20 rounded-[20px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
            <KeySquare size={32} className="text-blue-400 opacity-90" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Enter Room Code</h3>
            <p className="text-sm text-white/50 font-medium">Ask your friend for their 6-character room code</p>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(''); }}
            placeholder="A7K9X2"
            maxLength={6}
            className="w-full text-center px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-colors text-2xl font-black font-mono tracking-[0.4em] uppercase"
            autoFocus
          />

          {error && (
            <div className="w-full flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isJoining || code.length !== 6 || !isFirebaseConfigured}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isJoining ? <Loader2 size={20} className="animate-spin" /> : null}
            Join Room
          </button>
        </div>
      </motion.form>
    </div>
  );
}
