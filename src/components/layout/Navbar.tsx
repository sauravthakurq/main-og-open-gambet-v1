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
      {/* Solid black navbar - no blur, no transparency */}
      <header className="fixed top-0 left-0 w-full h-[56px] flex items-center justify-between px-5 z-40 bg-[#0a0a0a] border-b border-white/[0.06]">
        
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 w-1/3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
            draggable={false} 
            onClick={() => setIsGameMenuOpen(true)}
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-[16px] font-bold text-white leading-none tracking-wide">Open Gambit</span>
            <span className="text-[10px] font-semibold text-[#b58863] uppercase tracking-[0.15em] leading-none mt-[3px]">CHESS AI</span>
          </div>
        </div>

        {/* Center: Controls Pill */}
        <div className="flex items-center justify-center w-1/3">
          <div className="flex items-center bg-white/5 rounded-2xl border border-white/8 px-1 py-1 gap-0.5">
            <NavButton icon={RotateCcw} label="Undo" onClick={undoMove} />
            <NavButton icon={RotateCw} label="Redo" onClick={redoMove} />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <NavButton icon={Home} label="Game Menu" onClick={() => setIsGameMenuOpen(true)} />
            <NavButton icon={RefreshCcw} label="Flip Board" onClick={flipBoard} />
          </div>
        </div>

        {/* Right: App Controls */}
        <div className="flex items-center justify-end gap-0.5 w-1/3">
          <NavButton icon={GraduationCap} label="Learn" onClick={() => {
            const store = useLearningStore.getState();
            store.setWorkspaceOpen(!store.isWorkspaceOpen);
          }} />
          <GambitAINavButton onClick={() => setWorkspaceOpen(true)} />
          <div className="w-px h-4 bg-white/10 mx-1.5" />
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
          <div className="w-px h-4 bg-white/10 mx-1.5" />
          <ProfileDropdown />
        </div>

      </header>

      <SettingsModal 
        isOpen={showSettingsMenu} 
        onClose={() => setShowSettingsMenu(false)} 
      />
    </>
  );
}

