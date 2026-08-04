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
          <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/[0.08] rounded-3xl shadow-2xl flex flex-col w-full max-w-sm">
            {/* Banner Image */}
            <div className="w-full h-32 relative">
              <img 
                src="/think-like-ai.png" 
                alt="Premium Chess" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
              
              <button 
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/70 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col items-center text-center -mt-8 relative z-10">
              {/* App Logo */}
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/10 p-2.5 flex items-center justify-center overflow-hidden shadow-xl mb-3">
                <img src="/logo.png" alt="Open Gambit" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <h3 className="font-bold text-white text-xl tracking-tight mb-1">Open Gambit</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Play chess anywhere with our native app experience. Offline support included.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-2">
                <button 
                  onClick={handleInstallClick}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <Download size={18} strokeWidth={2.5} />
                  Install Application
                </button>
                <button 
                  onClick={handleDismiss}
                  className="w-full py-2 rounded-xl font-medium text-xs text-white/40 hover:text-white/80 transition-colors"
                >
                  Not right now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
