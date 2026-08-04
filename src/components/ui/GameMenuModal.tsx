'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useGameStore } from '@/store/useGameStore';
import { useChessClockStore } from '@/store/useChessClockStore';
import { useEngineStore } from '@/store/useEngineStore';
import { 
  Play, Pause, RotateCcw, Home, Settings, X, AlertTriangle, Monitor
} from 'lucide-react';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useToastStore } from '@/store/useToastStore';

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

  useAndroidBack('game-menu', () => setIsGameMenuOpen(false), isGameMenuOpen);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isGameMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Automatically pause game if not already paused
      if (!isPaused) {
        setIsPaused(true);
      }
    } else {
      document.body.style.overflow = '';
      setConfirmAction(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isGameMenuOpen]);

  if (!isGameMenuOpen) return null;

  const handleContinue = () => {
    setIsPaused(false);
    setIsGameMenuOpen(false);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const executeAction = () => {
    if (confirmAction === 'restart') {
      useEngineStore.getState().cancelAIRequest();
      resetGame();
      if (matchConfig.timeControl) {
        resetClock(matchConfig.timeControl.minutes * 60 * 1000);
      } else {
        resetClock(10 * 60 * 1000);
      }
      useChessClockStore.getState().startClock('w');
      setIsPaused(false);
      setIsGameMenuOpen(false);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Game Restarted',
        message: 'The board has been reset.',
        duration: 2000,
      });
    } else if (confirmAction === 'newgame' || confirmAction === 'home') {
      useEngineStore.getState().cancelAIRequest();
      resetGame();
      destroyEngine();
      setIsPaused(false);
      setAppState('onboarding');
      setIsGameMenuOpen(false);
    }
    setConfirmAction(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Blurred Backdrop */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsGameMenuOpen(false)}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-[400px] bg-[#1A1A1C]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-white tracking-tight">Game Menu</h2>
            <p className="text-sm text-white/50">{isPaused ? 'Game is Paused' : 'Game is Running'}</p>
          </div>
          <button 
            onClick={() => setIsGameMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!confirmAction ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-3"
            >
              <MenuButton 
                icon={isPaused ? Play : Pause} 
                label={isPaused ? "Resume Game" : "Pause Game"} 
                onClick={handleTogglePause}
                primary={isPaused}
              />
              <div className="h-px w-full bg-white/10 my-2" />
              <MenuButton 
                icon={RotateCcw} 
                label="Restart Match" 
                onClick={() => setConfirmAction('restart')}
              />
              <MenuButton 
                icon={Monitor} 
                label="New Game" 
                onClick={() => setConfirmAction('newgame')}
              />
              
              <button 
                onClick={() => {
                  setIsGameMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-settings'));
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group bg-white/5 hover:bg-white/10 text-white mt-2"
              >
                <Settings className="text-white/50 group-hover:text-white" size={20} />
                <span className="font-semibold">Settings</span>
              </button>
              <div className="h-px w-full bg-white/10 my-2" />
              <MenuButton 
                icon={Home} 
                label="Exit to Main Menu" 
                onClick={() => setConfirmAction('home')}
                danger
              />
            </motion.div>
          ) : (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-sm text-white/60 mb-8">
                {confirmAction === 'restart' && 'This will reset the board and clocks.'}
                {confirmAction === 'newgame' && 'This will end the current match and take you to mode selection.'}
                {confirmAction === 'home' && 'All progress in the current game will be lost.'}
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MenuButton({ icon: Icon, label, onClick, primary, danger }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
        ${primary ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white/5 hover:bg-white/10 text-white'}
        ${danger ? 'hover:bg-red-500/10 hover:text-red-400' : ''}
      `}
    >
      <Icon 
        size={20} 
        className={primary ? 'text-black' : danger ? 'text-white/50 group-hover:text-red-400' : 'text-white/50 group-hover:text-white'} 
      />
      <span className="font-semibold">{label}</span>
    </button>
  );
}
