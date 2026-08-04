import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X } from 'lucide-react';

const MESSAGES = [
  "Evaluating position...",
  "Analyzing variations...",
  "Calculating best move...",
  "Deep searching lines...",
  "Finalizing choice..."
];

interface AIThinkingIndicatorProps {
  onCancel: () => void;
}

export function AIThinkingIndicator({ onCancel }: AIThinkingIndicatorProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-black/40 border border-white/10 p-4">
      {/* Shimmer background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        <div className="relative">
          <Brain className="w-8 h-8 text-[var(--color-accent)] animate-pulse" />
          <div className="absolute inset-0 blur-md bg-[var(--color-accent)] opacity-30 mix-blend-screen" />
        </div>

        <div className="h-[20px] relative w-full overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[12px] font-semibold text-white/90 text-center absolute"
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          onClick={onCancel}
          className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors group"
        >
          <X size={12} className="group-hover:text-red-400 transition-colors" />
          Cancel Request
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}} />
    </div>
  );
}
