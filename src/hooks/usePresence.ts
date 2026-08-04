'use client';

import { useEffect } from 'react';
import { ref, onValue, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { rtdb, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';

/**
 * usePresence — tracks a user's online/offline status via Firebase Realtime Database.
 * Uses onDisconnect() so the server updates status even on ungraceful disconnects.
 */
export function usePresence() {
  const { firebaseUser, onlineGameId, isSearching } = useOnlineStore();

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser || !rtdb) return;

    const uid = firebaseUser.uid;
    const presenceRef = ref(rtdb, `presence/${uid}`);
    const connectedRef = ref(rtdb, '.info/connected');

    const currentStatus = onlineGameId
      ? 'playing'
      : isSearching
      ? 'searching'
      : 'online';

    const unsubscribe = onValue(connectedRef, async (snap) => {
      if (!snap.val()) return;

      // When connected: write current status
      await set(presenceRef, {
        online: true,
        status: currentStatus,
        lastSeen: serverTimestamp(),
      });

      // When disconnected: automatically write offline status
      onDisconnect(presenceRef).set({
        online: false,
        status: 'offline',
        lastSeen: serverTimestamp(),
      });
    });

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(async () => {
      if (!rtdb) return;
      await set(presenceRef, {
        online: true,
        status: onlineGameId ? 'playing' : isSearching ? 'searching' : 'online',
        lastSeen: serverTimestamp(),
      });
    }, 30_000);

    return () => {
      unsubscribe();
      clearInterval(heartbeat);
      // Mark offline on cleanup
      if (rtdb) {
        set(presenceRef, {
          online: false,
          status: 'offline',
          lastSeen: serverTimestamp(),
        }).catch(() => {});
      }
    };
  }, [firebaseUser?.uid, onlineGameId, isSearching]);
}
