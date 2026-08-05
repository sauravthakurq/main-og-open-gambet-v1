'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useGameStore } from '@/store/useGameStore';
import { useChessClockStore } from '@/store/useChessClockStore';
import { useEngineStore } from '@/store/useEngineStore';
import { 
  Play, RotateCcw, Monitor, Settings, LogOut, X, AlertTriangle
} from 'lucide-react';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CinematicStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .elite-modal-shadow {
      box-shadow: 
        0 0 0 1px rgba(255, 255, 255, 0.08),
        0 20px 50px rgba(0, 0, 0, 0.7),
        0 40px 100px -20px rgba(0, 0, 0, 0.95);
    }

    @keyframes elite-enter {
      0% { opacity: 0; transform: scale(0.96) translateY(8px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    @keyframes elite-exit {
      0% { opacity: 1; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(0.96) translateY(8px); }
    }

    @keyframes backdrop-in {
      0% { opacity: 0; backdrop-filter: blur(0px); }
      100% { opacity: 1; backdrop-filter: blur(24px); }
    }

    @keyframes backdrop-out {
      0% { opacity: 1; backdrop-filter: blur(24px); }
      100% { opacity: 0; backdrop-filter: blur(0px); }
    }

    .modal-enter {
      animation: elite-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .modal-exit {
      animation: elite-exit 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .backdrop-enter {
      animation: backdrop-in 0.5s ease-out forwards;
    }

    .backdrop-exit {
      animation: backdrop-out 0.35s ease-out forwards;
    }
  `}} />
);

export default function GameMenuModal() {
  const { 
    isGameMenuOpen, setIsGameMenuOpen, 
    isPaused, setIsPaused, 
    setAppState, matchConfig
  } = useAppStore();
  
  const { resetGame } = useGameStore();
  const { resetClock } = useChessClockStore();
  const { destroyEngine } = useEngineStore();

  const [confirmAction, setConfirmAction] = useState<'restart' | 'newgame' | 'home' | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useAndroidBack('game-menu', () => handleClose(), isGameMenuOpen);

  useEffect(() => {
    if (isGameMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (!isPaused) {
        setIsPaused(true);
      }
    } else {
      document.body.style.overflow = '';
      setConfirmAction(null);
      setIsAnimatingOut(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isGameMenuOpen]);

  if (!isGameMenuOpen && !isAnimatingOut) return null;

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsGameMenuOpen(false);
    }, 300);
  };

  const handleResume = () => {
    setIsPaused(false);
    handleClose();
  };

  const executeAction = () => {
    if (confirmAction === 'restart') {
      useEngineStore.getState().resetEngineState();
      resetGame();
      if (matchConfig.timeControl) {
        resetClock(matchConfig.timeControl.minutes * 60 * 1000);
      } else {
        resetClock(10 * 60 * 1000);
      }
      useChessClockStore.getState().startClock('w');
      useAppStore.getState().restartGame();
      handleClose();
    } else if (confirmAction === 'newgame' || confirmAction === 'home') {
      useEngineStore.getState().cancelAIRequest();
      resetGame();
      destroyEngine();
      setIsPaused(false);
      setAppState('onboarding');
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <CinematicStyles />

      {/* Deep frosted blur backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 ${isAnimatingOut ? 'backdrop-exit' : 'backdrop-enter'}`}
        onClick={handleClose}
      ></div>

      {/* Luxury Command Hub Card */}
      <div 
        className={`relative z-10 w-full max-w-[380px] bg-[#121215]/85 backdrop-blur-3xl border border-white/[0.09] rounded-[26px] p-5 elite-modal-shadow overflow-hidden ${isAnimatingOut ? 'modal-exit' : 'modal-enter'}`}
      >
        {/* Precision top refractive light line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Diffused ambient rear glow */}
        <div className="absolute -top-[90px] left-1/2 -translate-x-1/2 w-[180px] h-[180px] bg-white/[0.06] rounded-full blur-[50px] pointer-events-none"></div>

        {/* Top Header with Game Menu Title & Close Button */}
        <div className="flex items-center justify-between mb-4 relative z-10 px-1">
          <h2 className="text-[15px] font-semibold tracking-tight text-white/90">Game Menu</h2>
          <button 
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.12] text-white/40 hover:text-white transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-white/20 active:scale-95"
          >
            <X size={15} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!confirmAction ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 relative z-10"
            >
              
              {/* Primary Action - Solid luminous titanium white */}
              <button 
                onClick={handleResume}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group bg-white text-black hover:bg-white/95 hover:scale-[1.01] shadow-[0_4px_20px_rgba(255,255,255,0.15)] focus:outline-none active:scale-[0.98]"
              >
                <span className="font-semibold text-[14.5px] tracking-tight">Resume Game</span>
                <Play size={17} className="text-black fill-black" />
              </button>

              <div className="h-px w-full bg-white/[0.06] my-1"></div>

              {/* Secondary Actions */}
              <button 
                onClick={() => setConfirmAction('restart')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white focus:outline-none active:scale-[0.98]"
              >
                <span className="font-medium text-[14px]">Restart Match</span>
                <RotateCcw size={17} className="text-white/30 group-hover:text-white transition-colors duration-200" />
              </button>

              <button 
                onClick={() => setConfirmAction('newgame')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white focus:outline-none active:scale-[0.98]"
              >
                <span className="font-medium text-[14px]">New Game</span>
                <Monitor size={17} className="text-white/30 group-hover:text-white transition-colors duration-200" />
              </button>

              <button 
                onClick={() => {
                  handleClose();
                  setTimeout(() => window.dispatchEvent(new CustomEvent('open-settings')), 300);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white focus:outline-none active:scale-[0.98]"
              >
                <span className="font-medium text-[14px]">Settings</span>
                <Settings size={17} className="text-white/30 group-hover:text-white transition-colors duration-200" />
              </button>

              <div className="h-px w-full bg-white/[0.06] my-1"></div>

              {/* Destructive Action */}
              <button 
                onClick={() => setConfirmAction('home')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group bg-white/[0.02] hover:bg-red-500/[0.08] text-white/80 hover:text-red-400 focus:outline-none active:scale-[0.98]"
              >
                <span className="font-medium text-[14px]">Exit to Main Menu</span>
                <LogOut size={17} className="text-white/30 group-hover:text-red-400 transition-colors duration-200" />
              </button>
              
            </motion.div>
          ) : (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col relative z-10 text-center py-4 px-2"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-sm text-white/60 mb-8 px-2">
                {confirmAction === 'restart' && 'This will reset the board and clocks.'}
                {confirmAction === 'newgame' && 'This will end the current match and take you to mode selection.'}
                {confirmAction === 'home' && 'All progress in the current game will be lost.'}
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
