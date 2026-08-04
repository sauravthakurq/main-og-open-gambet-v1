import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X } from 'lucide-react';

const MESSAGES = [
  "Evaluating position",
  "Analyzing tactical ideas",
  "Calculating best continuation",
  "Exploring candidate moves",
  "Checking king safety",
  "Searching deeper",
  "Evaluating exchanges",
  "Looking for tactical opportunities",
  "Predicting opponent responses",
  "Running deep analysis",
  "Optimizing move selection",
  "Finalizing best move"
];

interface AIThinkingIndicatorProps {
  onCancel: () => void;
}

export function AIThinkingIndicator({ onCancel }: AIThinkingIndicatorProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0a]/80 backdrop-blur-md border border-[var(--color-accent)]/20 p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-accent),transparent_70%)] opacity-10 pointer-events-none mix-blend-screen" />
      
      {/* Premium Shimmer background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmerBg 3s infinite linear',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <Brain className="w-8 h-8 text-[var(--color-accent)] animate-pulse drop-shadow-[0_0_8px_var(--color-accent)]" strokeWidth={1.5} />
          <div className="absolute inset-0 blur-lg bg-[var(--color-accent)] opacity-40 mix-blend-screen animate-pulse" />
        </div>

        <div className="h-[24px] relative w-full overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ y: 15, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -15, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute flex items-center justify-center"
            >
              <span 
                className="text-[13px] font-semibold text-center whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-[var(--color-accent)] to-white/90"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'shimmerText 2s linear infinite'
                }}
              >
                {MESSAGES[msgIndex]}
                <span className="inline-block w-[12px] text-left">
                  <span className="animate-[dots_1.5s_infinite_steps(4,end)]">...</span>
                </span>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={onCancel}
          className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 group"
        >
          <X size={12} className="group-hover:text-red-400 group-hover:scale-110 transition-transform" />
          Cancel Request
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmerBg {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes dots {
          0%, 20% { color: transparent; text-shadow: .25em 0 0 transparent, .5em 0 0 transparent; }
          40% { color: inherit; text-shadow: .25em 0 0 transparent, .5em 0 0 transparent; }
          60% { text-shadow: .25em 0 0 inherit, .5em 0 0 transparent; }
          80%, 100% { text-shadow: .25em 0 0 inherit, .5em 0 0 inherit; }
        }
      `}} />
    </div>
  );
}
