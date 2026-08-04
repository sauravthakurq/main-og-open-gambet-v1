'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, X, Check } from 'lucide-react';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useOnlineGameSync } from '@/hooks/useOnlineGameSync';

export default function DrawOfferBanner() {
  const { firebaseUser, onlineGame } = useOnlineStore();
  const { respondToDraw } = useOnlineGameSync();

  const isMyOffer = onlineGame?.drawOfferBy === firebaseUser?.uid;
  const isOpponentOffer = onlineGame?.drawOfferBy && onlineGame.drawOfferBy !== firebaseUser?.uid;
  const opponentName = onlineGame
    ? (onlineGame.whiteUid === firebaseUser?.uid
        ? onlineGame.blackProfile?.username
        : onlineGame.whiteProfile?.username)
    : null;

  return (
    <AnimatePresence>
      {(isMyOffer || isOpponentOffer) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-[380px] px-4"
        >
          <div className="bg-[#1a1a1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Handshake size={18} className="text-white/70" />
              </div>
              <div className="flex-1">
                {isOpponentOffer ? (
                  <>
                    <p className="text-sm font-semibold text-white mb-0.5">Draw Offer</p>
                    <p className="text-xs text-white/50 mb-3">{opponentName} is offering a draw.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToDraw(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-semibold transition-colors border border-emerald-500/20"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => respondToDraw(false)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition-colors"
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-white mb-0.5">Draw Offered</p>
                    <p className="text-xs text-white/50">Waiting for {opponentName} to respond…</p>
                  </>
                )}
              </div>
              <button
                onClick={() => respondToDraw(false)}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
