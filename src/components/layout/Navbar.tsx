'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, RotateCw,
  RefreshCcw, Settings,
  Maximize, Minimize, Home, GraduationCap
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useGambitAIStore } from '@/store/useGambitAIStore';
import { useLearningStore } from '@/store/useLearningStore';
import { Orb } from '../../../orb';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { useNavigationConfirm } from '@/hooks/useNavigationConfirm';

const NavButton = ({ icon: Icon, label, onClick, disabled = false, isDanger = false }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`w-12 h-12 rounded-xl transition-all duration-150 outline-none flex items-center justify-center cursor-pointer ${
          disabled ? 'text-white/20 cursor-not-allowed' :
          isDanger ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10' :
          'text-white/60 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon size={20} strokeWidth={1.8} />
      </button>

      <AnimatePresence>
        {isHovered && !disabled && label && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute top-[calc(100%+6px)] px-2.5 py-1 rounded-lg bg-[#1c1c1e] border border-white/10 text-[11px] font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none text-white"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GambitAINavButton = ({ onClick }: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const orbState = useGambitAIStore((state) => state.orbState);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        aria-label="Gambit AI"
        className="p-1 rounded-xl transition-all duration-150 outline-none flex items-center justify-center cursor-pointer hover:bg-white/10 text-white relative w-9 h-9 overflow-hidden"
      >
        <div className="w-7 h-7 flex items-center justify-center relative overflow-hidden pointer-events-none">
          <Orb 
            theme="cloud" 
            size={32} 
            state={orbState === 'idle' ? 'thinking' : orbState} 
            className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute top-[calc(100%+6px)] px-2.5 py-1 rounded-lg bg-[#1c1c1e] border border-white/10 text-[11px] font-medium whitespace-nowrap z-50 pointer-events-none text-white shadow-xl"
          >
            Gambit AI
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const { undoMove, redoMove, resetGame, flipBoard } = useGameStore();
  const { setIsGameMenuOpen, isSoundEnabled, setIsSoundEnabled } = useAppStore();
  const { setWorkspaceOpen } = useGambitAIStore();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { appState } = useAppStore();
  const confirmNavigation = useNavigationConfirm();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  if (appState !== 'playing' && appState !== 'game_over') {
    return null;
  }

  return (
    <>
      {/* 
        Desktop Navbar (sm:up) 
        Fixed to TOP
      */}
      <header className="hidden sm:flex fixed top-0 left-0 w-full h-[60px] lg:h-[64px] items-center justify-between px-5 sm:px-6 z-40 bg-transparent pt-[env(safe-area-inset-top)]">
        
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 w-1/3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-9 h-9 object-contain cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
            draggable={false} 
            onClick={() => confirmNavigation(() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/';
              }
            })}
          />
          <div className="flex flex-col">
            <span className="text-[15px] font-black text-white leading-none tracking-tight">Open Gambit</span>
            <span className="text-[9px] font-bold text-[var(--color-accent)] uppercase tracking-[0.2em] leading-none mt-1">CHESS AI</span>
          </div>
        </div>

        {/* Center: Controls Pill */}
        <div className="flex items-center justify-center w-1/3">
          <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-1 gap-1 shadow-inner">
            <NavButton icon={RotateCcw} label="Undo" onClick={undoMove} />
            <NavButton icon={RotateCw} label="Redo" onClick={redoMove} />
            <div className="w-px h-5 bg-white/10 mx-1" />
            <NavButton icon={Home} label="Game Menu" onClick={() => setIsGameMenuOpen(true)} />
            <NavButton icon={RefreshCcw} label="Flip Board" onClick={flipBoard} />
          </div>
        </div>

        {/* Right: App Controls */}
        <div className="flex items-center justify-end gap-1 w-1/3">
          <NavButton icon={GraduationCap} label="Learn" onClick={() => confirmNavigation(() => {
            const store = useLearningStore.getState();
            store.setWorkspaceOpen(true);
          })} />
          <GambitAINavButton onClick={() => confirmNavigation(() => setWorkspaceOpen(true))} />
          <div className="w-px h-5 bg-white/10 mx-2" />
          <NavButton 
            icon={isFullscreen ? Minimize : Maximize} 
            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
            onClick={toggleFullscreen} 
          />
          <NotificationCenter />
          <NavButton 
            icon={Settings} 
            label="Settings" 
            onClick={() => setShowSettingsMenu(true)} 
          />
          <div className="w-px h-5 bg-white/10 mx-2" />
          <ProfileDropdown onOpenSettings={() => setShowSettingsMenu(true)} />
        </div>
      </header>

      {/* Mobile Navbar (xs) Fixed to BOTTOM */}
      <header className="flex sm:hidden fixed bottom-0 left-0 w-full items-center justify-between px-2 pb-[env(safe-area-inset-bottom)] z-50 bg-[#050505]/95 backdrop-blur-md border-t border-white/5 pt-1">
        <div className="flex items-center justify-between w-full max-w-[400px] mx-auto pt-1 pb-1">
          <button 
            onClick={() => setIsGameMenuOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-11 text-white/50 hover:text-white transition-colors"
          >
            <Home size={20} strokeWidth={2} />
            <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Menu</span>
          </button>
          
          <button 
            onClick={undoMove}
            className="flex flex-col items-center justify-center w-14 h-11 text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw size={20} strokeWidth={2} />
            <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Undo</span>
          </button>
          
          <div className="relative -top-6">
            <button
              onClick={() => confirmNavigation(() => setWorkspaceOpen(true))}
              className="rounded-full flex items-center justify-center transition-transform active:scale-95 bg-transparent border-none outline-none"
            >
              <Orb theme="cloud" size={54} state={useGambitAIStore.getState().orbState === 'idle' ? 'thinking' : useGambitAIStore.getState().orbState} />
            </button>
          </div>

          <button 
            onClick={flipBoard}
            className="flex flex-col items-center justify-center w-14 h-11 text-white/50 hover:text-white transition-colors"
          >
            <RefreshCcw size={20} strokeWidth={2} />
            <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Flip</span>
          </button>
          
          <button 
            onClick={() => setShowSettingsMenu(true)}
            className="flex flex-col items-center justify-center w-14 h-11 text-white/50 hover:text-white transition-colors"
          >
            <Settings size={20} strokeWidth={2} />
            <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Settings</span>
          </button>

        </div>
      </header>

      <SettingsModal 
        isOpen={showSettingsMenu} 
        onClose={() => setShowSettingsMenu(false)} 
      />
    </>
  );
}

