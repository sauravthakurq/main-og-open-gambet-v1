'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Loader2 } from 'lucide-react';

export default function ReconnectBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      // Show reconnected briefly
      setTimeout(() => setWasOffline(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || wasOffline) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4"
        >
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${
            isOffline
              ? 'bg-red-950/90 border-red-500/30'
              : 'bg-emerald-950/90 border-emerald-500/30'
          }`}>
            {isOffline ? (
              <>
                <WifiOff size={16} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">Connection lost. Reconnecting…</span>
                <Loader2 size={14} className="text-red-400 animate-spin" />
              </>
            ) : (
              <>
                <Wifi size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Reconnected ✓</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
