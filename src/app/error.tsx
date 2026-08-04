'use client'; // Error components must be Client Components

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

import { useToastStore } from '@/store/useToastStore';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Global Error Boundary]', error);
    
    // Attempt to show in Toast UI if provider is still mounted
    useToastStore.getState().addToast({
      type: 'error',
      title: 'Unexpected Error',
      message: error.message || 'A critical error occurred.',
      duration: 5000
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#e1aa53] selection:text-black">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#e1aa53]/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
        className="relative z-10 w-full max-w-md bg-[#141414]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
          <AlertTriangle size={32} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-sm text-white/50 mb-8 max-w-sm">
          A critical error occurred in the application. We apologize for the interruption to your game.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 py-3.5 px-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
