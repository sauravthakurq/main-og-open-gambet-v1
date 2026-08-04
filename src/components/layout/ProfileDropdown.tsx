import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle, signInAsGuest, signOut } from '@/hooks/useFirebaseAuth';
import { useToastStore } from '@/store/useToastStore';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useModalStore } from '@/store/useModalStore';
import { User, Settings, HelpCircle, MessageSquare, Palette, LogOut } from 'lucide-react';

export function ProfileDropdown() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { firebaseUser, userProfile } = useOnlineStore();
  const { setSettingsOpen } = useModalStore();
  
  const isLoggedIn = !!firebaseUser;
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    try {
      await signInWithGoogle();
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

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthOpen(false);
    } catch (e: any) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Logout Failed',
        message: e.message || 'Failed to sign out.',
      });
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsAuthOpen(!isAuthOpen)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30 flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 shrink-0"
      >
        {isLoggedIn ? (
          <img src={userProfile?.photoURL || "/guest.png"} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 bg-black/40">
            <User size={18} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-64 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
          >
            {!isLoggedIn ? (
              <div className="flex flex-col px-2 gap-1">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoadingAuth}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-white group"
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 text-black">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  {isLoadingAuth ? 'Signing in...' : 'Sign in with Google'}
                </button>
                <div className="h-px w-full bg-white/5 my-1" />
                <button 
                  onClick={handleGuestSignIn}
                  disabled={isLoadingAuth}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-white/70 hover:text-white"
                >
                  Continue as Guest
                </button>
              </div>
            ) : (
              <div className="flex flex-col text-sm text-white font-medium px-2 gap-1">
                <button onClick={() => setIsAuthOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl transition-colors">
                  <User size={18} className="opacity-70" /> {userProfile?.displayName || 'Profile'}
                </button>
                <button 
                  onClick={() => {
                    setIsAuthOpen(false);
                    setSettingsOpen(true);
                  }} 
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Settings size={18} className="opacity-70" /> Settings
                </button>
                <button onClick={() => setIsAuthOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl transition-colors">
                  <HelpCircle size={18} className="opacity-70" /> Help & Docs
                </button>
                <button onClick={() => setIsAuthOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl transition-colors">
                  <MessageSquare size={18} className="opacity-70" /> Feedback
                </button>
                <button 
                  onClick={() => {
                    setIsAuthOpen(false);
                    setSettingsOpen(true); // Can route to theme tab if needed
                  }} 
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Palette size={18} className="opacity-70" /> Theme
                </button>
                <div className="h-px w-full bg-white/10 my-1" />
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl text-red-400 transition-colors"
                >
                  <LogOut size={18} className="opacity-70" /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
