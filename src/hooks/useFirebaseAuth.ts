'use client';

import { useEffect, useRef } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, serverTimestamp, Timestamp, updateDoc
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { UserProfile } from '@/lib/firebase-types';

/**
 * useFirebaseAuth — initializes Firebase Auth listener and manages user profiles.
 * Mount this once at the app root.
 */
export function useFirebaseAuth() {
  const {
    setFirebaseUser,
    setUserProfile,
    setIsAuthLoading,
    setIsFirebaseReady,
  } = useOnlineStore();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthLoading(false);
      setIsFirebaseReady(false);
      return;
    }

    setIsFirebaseReady(true);

    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user && db) {
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profile = profileSnap.data() as UserProfile;
          setUserProfile(profile);
          // Update lastSeen
          await updateDoc(profileRef, {
            lastSeen: serverTimestamp(),
            online: true,
          });
        } else {
          // New user — create profile
          const newProfile: UserProfile = {
            uid: user.uid,
            username: user.displayName?.toLowerCase().replace(/\s+/g, '_') || `guest_${user.uid.slice(0, 6)}`,
            displayName: user.displayName || 'Guest',
            photoURL: user.photoURL,
            country: null,
            rating: 1200,
            wins: 0,
            losses: 0,
            draws: 0,
            gamesPlayed: 0,
            createdAt: serverTimestamp() as Timestamp,
            lastSeen: serverTimestamp() as Timestamp,
            online: true,
            playing: false,
            isGuest: user.isAnonymous,
          };
          await setDoc(profileRef, newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(null);
      }

      setIsAuthLoading(false);
    });

    return unsub;
  }, []);
}

// ─── Auth Actions ─────────────────────────────────────────

export async function signInWithGoogle(): Promise<void> {
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase not configured');
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signInAsGuest(username: string): Promise<void> {
  if (!isFirebaseConfigured || !auth || !db) throw new Error('Firebase not configured');

  // Check username uniqueness
  const { getDocs, query, collection, where } = await import('firebase/firestore');
  const usernameQuery = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const existing = await getDocs(usernameQuery);
  if (!existing.empty) throw new Error('Username already taken. Please choose another.');

  const cred = await signInAnonymously(auth);
  const profileRef = doc(db, 'users', cred.user.uid);
  const newProfile: UserProfile = {
    uid: cred.user.uid,
    username: username.toLowerCase(),
    displayName: username,
    photoURL: null,
    country: null,
    rating: 1200,
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0,
    createdAt: serverTimestamp() as Timestamp,
    lastSeen: serverTimestamp() as Timestamp,
    online: true,
    playing: false,
    isGuest: true,
  };
  await setDoc(profileRef, newProfile);
  useOnlineStore.getState().setUserProfile(newProfile);
}

export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured || !auth || !db) return;
  const user = useOnlineStore.getState().firebaseUser;
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      online: false,
      lastSeen: serverTimestamp(),
    }).catch(() => {});
  }
  await firebaseSignOut(auth);
  useOnlineStore.getState().setFirebaseUser(null);
  useOnlineStore.getState().setUserProfile(null);
}
