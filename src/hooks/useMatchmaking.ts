'use client';

import { useEffect, useCallback, useRef } from 'react';
import {
  collection, addDoc, doc, onSnapshot,
  query, where, serverTimestamp, deleteDoc,
  updateDoc, getDocs, limit, orderBy, Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useAppStore } from '@/store/useAppStore';
import { MatchmakingEntry, OnlineGame } from '@/lib/firebase-types';

const RATING_RANGE = 200; // Match players within 200 rating points
const MATCH_TIMEOUT_MS = 30_000; // 30 seconds before expanding search

export function useMatchmaking() {
  const {
    firebaseUser, userProfile,
    isSearching, setIsSearching,
    matchmakingEntryId, setMatchmakingEntryId,
    setOnlineGameId, setOnlineGame,
  } = useOnlineStore();
  const { updateMatchConfig, setAppState } = useAppStore();
  const unsubRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelSearch = useCallback(async () => {
    setIsSearching(false);
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (matchmakingEntryId && db) {
      await deleteDoc(doc(db, 'matchmaking', matchmakingEntryId)).catch(() => {});
    }
    setMatchmakingEntryId(null);
  }, [matchmakingEntryId]);

  const startSearch = useCallback(async (timeControl: { minutes: number; increment: number } | null) => {
    if (!isFirebaseConfigured || !db || !firebaseUser || !userProfile) return;

    setIsSearching(true);

    // Step 1: Add self to matchmaking queue
    const entry: Omit<MatchmakingEntry, 'status'> = {
      uid: firebaseUser.uid,
      username: userProfile.username,
      rating: userProfile.rating,
      timeControl,
      createdAt: serverTimestamp() as Timestamp,
    };

    const entryRef = await addDoc(collection(db, 'matchmaking'), {
      ...entry,
      status: 'searching',
    });
    setMatchmakingEntryId(entryRef.id);

    // Step 2: Listen for an opponent — someone who already created a game for us
    const gameQuery = query(
      collection(db, 'games'),
      where('blackUid', '==', firebaseUser.uid),
      where('status', '==', 'waiting'),
      limit(1)
    );

    const unsubGame = onSnapshot(gameQuery, (snap) => {
      if (!snap.empty) {
        const gameDoc = snap.docs[0];
        const game = { id: gameDoc.id, ...gameDoc.data() } as OnlineGame;
        unsubGame();
        setOnlineGame(game);
        setOnlineGameId(gameDoc.id);
        setIsSearching(false);
        deleteDoc(entryRef).catch(() => {});
        setMatchmakingEntryId(null);
        // Set app match config and transition to game
        updateMatchConfig({ opponentType: 'online', color: 'b' });
        setAppState('playing');
      }
    });

    unsubRef.current = unsubGame;

    // Step 3: Also actively look for someone waiting
    const tryMatch = async () => {
      if (!db || !firebaseUser) return;
      const myRating = userProfile.rating;

      const opponentsQuery = query(
        collection(db, 'matchmaking'),
        where('status', '==', 'searching'),
        where('uid', '!=', firebaseUser.uid),
        orderBy('uid'),
        limit(10)
      );

      const opponentSnap = await getDocs(opponentsQuery);
      const opponents = opponentSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as MatchmakingEntry & { id: string }))
        .filter(o =>
          o.uid !== firebaseUser.uid &&
          Math.abs((o.rating || 1200) - myRating) <= RATING_RANGE
        );

      if (opponents.length > 0) {
        const opponent = opponents[0];
        // I found an opponent — create the game with me as white
        const now = serverTimestamp() as Timestamp;
        const gameData: Omit<OnlineGame, 'id'> = {
          whiteUid: firebaseUser.uid,
          blackUid: opponent.uid,
          whiteProfile: {
            uid: firebaseUser.uid,
            username: userProfile.username,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
            rating: userProfile.rating,
          },
          blackProfile: {
            uid: opponent.uid,
            username: opponent.username,
            displayName: opponent.username,
            photoURL: null,
            rating: opponent.rating,
          },
          status: 'active',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          pgn: '',
          turn: 'w',
          moveCount: 0,
          timeControl,
          whiteTimeMs: timeControl ? timeControl.minutes * 60 * 1000 : 0,
          blackTimeMs: timeControl ? timeControl.minutes * 60 * 1000 : 0,
          lastMoveAt: null,
          createdAt: now,
          result: null,
          endReason: null,
          drawOfferBy: null,
          isPrivate: false,
          roomCode: null,
          spectatorCount: 0,
        };

        const gameRef = await addDoc(collection(db, 'games'), gameData);

        // Mark opponent as matched
        await updateDoc(doc(db, 'matchmaking', opponent.id), { status: 'matched' }).catch(() => {});
        // Mark myself as matched and delete
        await deleteDoc(entryRef).catch(() => {});

        unsubGame();
        const game = { id: gameRef.id, ...gameData } as OnlineGame;
        setOnlineGame(game);
        setOnlineGameId(gameRef.id);
        setIsSearching(false);
        setMatchmakingEntryId(null);
        updateMatchConfig({ opponentType: 'online', color: 'w' });
        setAppState('playing');
      }
    };

    // Try immediately, then every 3 seconds
    await tryMatch();
    timeoutRef.current = setInterval(tryMatch, 3000);

  }, [firebaseUser, userProfile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  return { startSearch, cancelSearch, isSearching };
}
