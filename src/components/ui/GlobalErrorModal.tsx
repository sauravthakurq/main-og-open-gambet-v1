'use client';

import React, { useState } from 'react';
import { useErrorStore } from '@/store/useErrorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  WifiOff, 
  Cpu, 
  Lock, 
  Server, 
  Database,
  ChevronDown,
  XCircle,
  Swords,
  Settings
} from 'lucide-react';

export function GlobalErrorModal() {
  const { currentError, clearError } = useErrorStore();
  const [showDevDetails, setShowDevDetails] = useState(false);

  if (!currentError) return null;

  const IconMap = {
    Authentication: Lock,
    Network: WifiOff,
    AI: Cpu,
    Warning: AlertTriangle,
    Critical: XCircle,
    Server: Server,
    Chess: Swords,
    Storage: Database,
    System: Settings,
  };

  const IconComponent = IconMap[currentError.category] || AlertTriangle;

  return (
    <AnimatePresence>
      {currentError && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          {/* Heavy Blur Backdrop */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-[#000000]/60"
            onClick={clearError}
          />

          {/* Premium Pill Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="relative w-full max-w-[420px] bg-[#121214]/90 backdrop-blur-3xl rounded-[28px] p-6 overflow-hidden flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]"
          >
            {/* Top Light Reflection */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Ambient Background Glow based on Error Type */}
            <div className={`absolute -top-[80px] left-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-full blur-[50px] pointer-events-none ${
              currentError.category === 'Critical' || currentError.category === 'Authentication' ? 'bg-red-500/10' : 
              currentError.category === 'Network' ? 'bg-orange-500/10' : 'bg-white/5'
            }`}></div>

            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-center text-center mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
                currentError.category === 'Critical' || currentError.category === 'Authentication' ? 'bg-red-500/10 text-red-500' : 
                currentError.category === 'Network' ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-white/80'
              }`}>
                <IconComponent className="w-7 h-7" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-[20px] font-semibold text-white tracking-tight leading-tight mb-2">
                {currentError.title}
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed px-2 font-medium">
                {currentError.message}
              </p>
            </div>


            {/* Actions */}
            <div className="relative z-10 flex flex-col w-full gap-2.5 mt-auto">
              {currentError.actions && currentError.actions.length > 0 ? (
                currentError.actions.map((action, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      action.onClick();
                      clearError();
                    }}
                    className={`w-full py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] ${
                      action.primary
                        ? 'bg-white text-black hover:bg-white/90 shadow-[0_2px_10px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {action.label}
                  </button>
                ))
              ) : (
                <button 
                  onClick={clearError}
                  className="w-full py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
