'use client';

import React, { useEffect, useState } from 'react';
import { useModalStore } from '@/store/useModalStore';
import { AlertCircle } from 'lucide-react';

const PremiumStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .premium-modal-shadow {
      box-shadow: 
        0 0 0 1px rgba(255, 255, 255, 0.05),
        0 24px 60px rgba(0, 0, 0, 0.8),
        0 60px 120px -20px rgba(0, 0, 0, 0.95);
    }

    @keyframes premium-enter {
      0% { opacity: 0; transform: scale(0.97) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    @keyframes premium-exit {
      0% { opacity: 1; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(0.97) translateY(10px); }
    }

    @keyframes premium-backdrop-in {
      0% { opacity: 0; backdrop-filter: blur(0px); }
      100% { opacity: 1; backdrop-filter: blur(30px); }
    }

    @keyframes premium-backdrop-out {
      0% { opacity: 1; backdrop-filter: blur(30px); }
      100% { opacity: 0; backdrop-filter: blur(0px); }
    }

    .premium-modal-enter {
      animation: premium-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .premium-modal-exit {
      animation: premium-exit 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .premium-bg-enter {
      animation: premium-backdrop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .premium-bg-exit {
      animation: premium-backdrop-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `}} />
);

export function ConfirmationModal() {
  const { currentModal, closeModal } = useModalStore();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (currentModal) {
      setIsAnimatingOut(false);
    }
  }, [currentModal]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentModal && !isAnimatingOut) {
        handleSecondary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentModal, isAnimatingOut]);

  if (!currentModal && !isAnimatingOut) return null;

  const handleCloseAnimation = (callback: () => void) => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      callback();
      closeModal();
      setIsAnimatingOut(false);
    }, 400); // Matches exit animation duration
  };

  const handlePrimary = () => {
    handleCloseAnimation(() => {
      currentModal?.primaryAction.onClick();
    });
  };

  const handleSecondary = () => {
    handleCloseAnimation(() => {
      if (currentModal?.secondaryAction?.onClick) {
        currentModal.secondaryAction.onClick();
      }
    });
  };

  const isDestructive = currentModal?.primaryAction.destructive;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <PremiumStyles />
      
      {/* Heavy Frosted Glass Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#000000]/70 ${isAnimatingOut ? 'premium-bg-exit' : 'premium-bg-enter'}`} 
        onClick={handleSecondary}
      ></div>

      {/* Premium Cinematic Card */}
      <div 
        className={`relative w-full max-w-[360px] bg-[#121214]/90 backdrop-blur-3xl rounded-[28px] p-6 premium-modal-shadow overflow-hidden flex flex-col items-center text-center ${isAnimatingOut ? 'premium-modal-exit' : 'premium-modal-enter'}`}
      >
        {/* Subtle top light reflection */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Ambient background glow */}
        <div className="absolute -top-[80px] left-1/2 -translate-x-1/2 w-[160px] h-[160px] bg-white/[0.04] rounded-full blur-[40px] pointer-events-none"></div>

        {/* Dynamic Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 relative z-10 ${isDestructive ? 'bg-red-500/10' : 'bg-white/5'}`}>
          <AlertCircle className={`w-7 h-7 ${isDestructive ? 'text-red-500' : 'text-white/80'}`} strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="relative z-10 space-y-2 mb-8 w-full">
          <h3 className="text-[19px] font-semibold text-white tracking-tight leading-tight">
            {currentModal?.title}
          </h3>
          <p className="text-[14px] text-white/50 leading-relaxed px-2 font-medium">
            {currentModal?.message}
          </p>
        </div>

        {/* Actions Stack */}
        <div className="relative z-10 flex flex-col w-full gap-2.5">
          <button 
            onClick={handleSecondary}
            className="w-full py-3.5 rounded-[14px] bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
          >
            {currentModal?.secondaryAction?.label || 'Continue Playing'}
          </button>
          
          <button 
            onClick={handlePrimary}
            className={`w-full py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] border ${
              isDestructive 
                ? 'bg-red-500/[0.08] text-red-500 border-red-500/20 hover:bg-red-500/15' 
                : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {currentModal?.primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
}
