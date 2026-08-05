'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  RotateCcw, RotateCw, Sparkles, Activity, Radio,
  RefreshCcw, Palette, Settings2, RefreshCw, ChevronDown,
  Maximize, Minimize, Volume2, VolumeX, Home, GraduationCap
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { SparkleIcon } from '@/components/icons/SparkleIcon';
import { useGambitAIStore } from '@/store/useGambitAIStore';
import { useLearningStore } from '@/store/useLearningStore';
import { Orb } from '../../../orb';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { signInWithGoogle, signInAsGuest } from '@/hooks/useFirebaseAuth';
import { useToastStore } from '@/store/useToastStore';

const GambitAINavButton = ({ onClick }: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer group rounded-xl p-1.5 transition-all duration-150 active:scale-95"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img 
        src="/icon%20we.webp" 
        alt="Gambit AI" 
        className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-150 drop-shadow-[0_0_10px_rgba(227,193,149,0.3)]" 
        draggable={false}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] px-3 py-1.5 rounded-lg border text-[12px] font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none bg-[#1c1c1e] border-[var(--color-accent)]/50 text-[var(--color-accent)]"
          >
            Gambit AI Voice Assistant
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavButtonProps {
  icon: any;
  label?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  isPremium?: boolean;
  color?: string;
}

const NavButton = ({ icon: Icon, label, onClick, active, disabled, isPremium, color }: NavButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          ${active && !isPremium ? 'bg-white/10 text-white shadow-inner' : color ? 'hover:bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}
          ${!disabled && isPremium ? 'bg-white/5 border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] shadow-[0_0_15px_rgba(227,193,149,0.15)] hover:shadow-[0_0_20px_rgba(227,193,149,0.3)]' : ''}
        `}
        style={color && !active ? { color } : {}}
      >
        <Icon size={20} strokeWidth={2} color={isPremium ? "var(--color-accent)" : "currentColor"} />
      </button>

      <AnimatePresence>
        {isHovered && !disabled && label && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-[calc(100%+8px)] px-3 py-1.5 rounded-lg border text-[12px] font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none ${
              isPremium ? 'bg-[#1c1c1e] border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-[#2c2b29] border-white/10 text-white'
            }`}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HomeNavbar() {
  const { setWorkspaceOpen } = useGambitAIStore();
  const { appState, setAppState } = useAppStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hardcoded auth state for now until we link Firebase
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    try {
      await signInWithGoogle();
      setIsLoggedIn(true);
      setIsAuthOpen(false);
    } catch (e: any) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: e.message || 'Failed to sign in with Google.',
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoadingAuth(true);
    try {
      const guestName = 'Guest_' + Math.floor(Math.random() * 10000);
      await signInAsGuest(guestName);
      setIsLoggedIn(true);
      setIsAuthOpen(false);
    } catch (e: any) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Guest Sign In Failed',
        message: e.message || 'Failed to continue as guest.',
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  if (appState === 'playing') return null;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl h-[60px] flex items-center justify-between px-3 sm:px-4 bg-transparent transition-all duration-150">
      
      {/* Left: Branding */}
      <div className="flex items-center justify-start gap-2.5 w-auto cursor-pointer group" onClick={() => setAppState('onboarding')}>
        <img alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-150 group-hover:scale-110 group-hover:rotate-3 shrink-0" draggable="false" src="/logo.png" />
        <div className="flex flex-col text-left">
          <span className="text-[15px] sm:text-[17px] font-extrabold text-white leading-none tracking-wide group-hover:text-white/90 transition-colors drop-shadow-sm">Open Gambit</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-[#b58863] uppercase tracking-[0.15em] leading-none mt-[3px] drop-shadow-sm">CHESS AI</span>
        </div>
      </div>

      {/* Right: Actions & "Get app" */}
      <div className="flex items-center justify-end w-auto gap-1 sm:gap-2 relative">
        <a id="navAppBtn" onClick={() => window.dispatchEvent(new Event('show-install-prompt'))} className="group relative z-0 border border-white/10 inline-flex justify-center items-center rounded-full font-medium gap-[.3em] disabled:pointer-events-none disabled:opacity-30 text-center py-[.25em] transition-all text-white bg-white/5 hover:bg-white/10 active:scale-[.96] text-[11px] sm:text-[12px] min-h-7 sm:min-h-8 px-3 leading-[1.125] cursor-pointer mr-1">
            <span className="contents">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                    <rect x="0.4" y="0.4" width="8.2" height="12.2" rx="0.6" stroke="white" strokeWidth="0.8"></rect>
                    <path d="M5 2H4" stroke="white" strokeWidth="0.8" strokeLinecap="round"></path>
                    <path d="M3 11H6" stroke="white" strokeWidth="0.8" strokeLinecap="round"></path>
                </svg>
                <span className="ml-1.5">Get app</span>
            </span>
        </a>
        <NavButton icon={Radio} label="Watch Live" color="#ef4444" onClick={() => router.push('/watch-live')} />
        <div className="hidden sm:block">
          <NavButton icon={GraduationCap} label="Learn" onClick={() => {
              const store = useLearningStore.getState();
              store.setWorkspaceOpen(!store.isWorkspaceOpen);
          }} />
        </div>
        <GambitAINavButton onClick={() => setWorkspaceOpen(true)} />
        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
        
        <ProfileDropdown onOpenSettings={() => setShowSettingsMenu(true)} />
        <SettingsModal isOpen={showSettingsMenu} onClose={() => setShowSettingsMenu(false)} />
      </div>

    </header>
  );
}
