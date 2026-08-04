'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useDragControls, PanInfo } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Loader2,
  X 
} from 'lucide-react';
import { Toast as ToastType, useToastStore } from '@/store/useToastStore';

interface ToastProps {
  toast: ToastType;
}

const ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-orange-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  loading: <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />,
};

const BORDERS = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-orange-500/30',
  info: 'border-blue-500/30',
  loading: 'border-indigo-500/30',
};

const BGS = {
  success: 'bg-emerald-500/10',
  error: 'bg-red-500/10',
  warning: 'bg-orange-500/10',
  info: 'bg-blue-500/10',
  loading: 'bg-indigo-500/10',
};

export function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const controls = useAnimation();
  const startTime = useRef(Date.now());
  const remainingTime = useRef(toast.duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast.duration === 0) return; // Infinite

    if (!isPaused) {
      startTime.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current;
        const newRemaining = (remainingTime.current ?? toast.duration ?? 3000) - elapsed;
        
        if (newRemaining <= 0) {
          clearInterval(intervalRef.current!);
          setProgress(0);
          removeToast(toast.id);
        } else {
          setProgress((newRemaining / toast.duration!) * 100);
        }
      }, 16);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        const elapsed = Date.now() - startTime.current;
        remainingTime.current = (remainingTime.current ?? toast.duration ?? 3000) - elapsed;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, toast.duration, toast.id, removeToast]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50 || info.offset.x < -50) {
      removeToast(toast.id);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(4px)' }}
      animate={controls}
      onAnimationComplete={() => {
        // Only set the initial animate state if controls hasn't been used yet
        if (!(controls as any).current) {
          controls.set({ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
        }
      }}
      exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="pointer-events-auto relative w-[320px] rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
    >
      <div className={`absolute inset-0 border ${BORDERS[toast.type || 'info']} rounded-xl pointer-events-none`} />
      <div className={`absolute inset-0 ${BGS[toast.type || 'info']} opacity-50 pointer-events-none`} />
      <div className="absolute inset-0 bg-[#1c1c1f]/80 pointer-events-none" />

      <div className="relative p-4 flex gap-3 z-10">
        <div className="shrink-0 mt-0.5">
          {ICONS[toast.type || 'info']}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-sm font-semibold text-white/90 leading-tight">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-xs text-white/60 mt-1 leading-snug break-words">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 self-start px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded-md text-xs font-semibold text-white/90 border border-white/5"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors text-white/40 hover:text-white/80 self-start -mr-1 -mt-1"
        >
          <X size={14} />
        </button>
      </div>

      {toast.duration! > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
          <motion.div 
            className={`h-full ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      )}
    </motion.div>
  );
}
