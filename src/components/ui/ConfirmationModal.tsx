'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '@/store/useModalStore';

export function ConfirmationModal() {
  const { currentModal, closeModal } = useModalStore();

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentModal) {
        if (currentModal.secondaryAction?.onClick) {
          currentModal.secondaryAction.onClick();
        }
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentModal, closeModal]);

  if (!currentModal) return null;

  const handlePrimary = () => {
    currentModal.primaryAction.onClick();
    closeModal();
  };

  const handleSecondary = () => {
    if (currentModal.secondaryAction?.onClick) {
      currentModal.secondaryAction.onClick();
    }
    closeModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={handleSecondary}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.15 }}
          className="relative w-full max-w-sm bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {currentModal.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {currentModal.message}
            </p>
          </div>
          
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-3 justify-end">
            <button
              onClick={handleSecondary}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {currentModal.secondaryAction?.label || 'Cancel'}
            </button>
            <button
              onClick={handlePrimary}
              autoFocus
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1c] ${
                currentModal.primaryAction.destructive 
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50' 
                  : 'bg-white text-black hover:bg-white/90 focus:ring-white/50'
              }`}
            >
              {currentModal.primaryAction.label}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
