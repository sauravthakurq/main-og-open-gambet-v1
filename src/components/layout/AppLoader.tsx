'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useGameStore } from '@/store/useGameStore';
import { audioManager } from '@/lib/audioManager';

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    audioManager.init();

    let appHydrated = false;
    let gameHydrated = false;
    
    // Check hydration status
    if (useAppStore.persist.hasHydrated()) appHydrated = true;
    if (useGameStore.persist.hasHydrated()) gameHydrated = true;

    // Listeners for hydration if not already hydrated
    const unsubApp = useAppStore.persist.onFinishHydration(() => { 
      appHydrated = true; 
      checkReady(); 
    });
    
    const unsubGame = useGameStore.persist.onFinishHydration(() => { 
      gameHydrated = true; 
      checkReady(); 
    });

    // Preload Critical Assets
    const assetsToLoad = [
      '/think-like-ai.png',
      '/battle.png',
      '/wK.svg',
      '/bK.svg'
    ];
    
    let assetsComplete = false;

    const checkReady = () => {
      if (appHydrated && gameHydrated && assetsComplete) {
        // Small delay to ensure minimum loading screen time for premium feel and to let Zustand propagate
        setTimeout(() => setIsReady(true), 400);
      }
    };

    Promise.all(
      assetsToLoad.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // continue even if error
            img.src = src;
          })
      )
    ).then(() => {
      assetsComplete = true;
      checkReady();
    });

    checkReady(); // Check immediately in case everything is already cached and hydrated

    return () => {
      unsubApp();
      unsubGame();
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            <div className="w-[80px] h-[80px] mb-8 relative flex items-center justify-center">
              <motion.img 
                src="/wK.svg" 
                className="w-[45px] absolute drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-t-[2px] border-l-[2px] border-r-[2px] border-t-[var(--color-accent)] border-l-[var(--color-accent)] border-r-transparent border-b-transparent opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h1 className="text-[18px] font-[700] text-[#F5F5F7] tracking-[0.2em] uppercase mb-3">Open Gambit</h1>
            <p className="text-[13px] font-[500] text-[#86868B] tracking-wide animate-pulse">Restoring your game...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* We only mount the children when ready, so the chess logic receives the fully rehydrated store */}
      {isReady && children}
    </>
  );
}
