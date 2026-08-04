'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, AlertCircle, Loader2, Wifi, Globe } from 'lucide-react';
import { signInWithGoogle, signInAsGuest } from '@/hooks/useFirebaseAuth';
import { isFirebaseConfigured } from '@/lib/firebase';
import { useAndroidBack } from '@/hooks/useAndroidBack';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<'main' | 'guest'>('main');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useAndroidBack('auth-modal', onClose, true);

  const handleGoogle = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await signInAsGuest(username.trim());
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to create guest account.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-[380px] bg-[#1a1a1c]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-8 shadow-2xl text-center"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Wifi className="text-orange-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Firebase Not Configured</h2>
          <p className="text-sm text-white/50 mb-6">
            Add your Firebase credentials to <code className="text-amber-400 bg-white/5 px-1 rounded">.env.local</code> to enable online play.
          </p>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
          >
            Open Firebase Console
          </a>
          <button onClick={onClose} className="mt-3 text-sm text-white/30 hover:text-white/60 transition-colors">
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Background Image with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/signin.png')" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-[400px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[28px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
      >
        {/* Top glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <X size={16} />
        </button>

        <AnimatePresence mode="wait">
          {view === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <Globe size={24} className="text-white/80" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Join the Battle</h2>
                <p className="text-sm text-white/50">Sign in to play against real players worldwide</p>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-black font-semibold text-sm transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg mb-3"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Guest */}
              <button
                onClick={() => setView('guest')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all border border-white/8 disabled:opacity-60"
              >
                <User size={18} />
                Continue as Guest
              </button>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <p className="text-xs text-white/20 text-center mt-6">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="guest"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <button
                onClick={() => { setView('main'); setError(''); }}
                className="text-white/50 hover:text-white text-sm flex items-center gap-2 mb-6 transition-colors"
              >
                ← Back
              </button>

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <User size={24} className="text-white/70" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Choose a Username</h2>
                <p className="text-sm text-white/50">Pick a unique name for your guest profile</p>
              </div>

              <form onSubmit={handleGuestSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="e.g. chess_knight99"
                  maxLength={20}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors text-sm font-mono"
                  autoFocus
                />

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !username.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Start Playing
                </button>
              </form>

              <p className="text-xs text-white/20 text-center mt-5">
                Guest profiles are stored locally and in Firebase.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
