'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed previously
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a short delay so it's not jarring
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999]"
        >
          <div className="relative overflow-hidden bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
            {/* Glass effect overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Open Gambit" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">Install Open Gambit</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Play chess anywhere with the full app experience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Offline Support
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Fast Launch
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Native App Feel
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Auto Updates
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button 
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Maybe Later
              </button>
              <button 
                onClick={handleInstallClick}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={16} />
                Install App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
