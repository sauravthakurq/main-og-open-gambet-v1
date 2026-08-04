'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCcw, Activity } from 'lucide-react';
import { useOnlineStore } from '@/store/useOnlineStore';
import { isFirebaseConfigured } from '@/lib/firebase';

export function ConnectionBadge() {
  const { firebaseUser, onlineGameId } = useOnlineStore();
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  let state: 'connected' | 'offline' | 'reconnecting' | 'none' = 'none';
  let message = '';
  let Icon = Wifi;
  let bgClass = '';
  let textClass = '';

  if (isOffline) {
    state = 'offline';
    message = 'Offline';
    Icon = WifiOff;
    bgClass = 'bg-red-500/10 border-red-500/20';
    textClass = 'text-red-400';
  } else if (!isFirebaseConfigured) {
    state = 'none';
  } else if (onlineGameId && firebaseUser) {
    state = 'connected';
    message = 'Connected';
    Icon = Activity;
    bgClass = 'bg-emerald-500/10 border-emerald-500/20';
    textClass = 'text-emerald-400';
  }

  if (state === 'none') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg ${bgClass}`}
      >
        <Icon size={12} className={state === 'offline' ? 'animate-pulse ' + textClass : textClass} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${textClass}`}>
          {message}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
