'use client';
import React, { useState, useEffect } from 'react';
import { Zap, WifiOff, Cpu, Crown, Bell, Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const CinematicStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    /* Refined monochrome cinematic shadow */
    .elite-install-shadow {
      box-shadow: 
        0 0 0 1px rgba(255, 255, 255, 0.1),
        0 32px 64px rgba(0, 0, 0, 0.9),
        0 0 100px -20px rgba(255, 255, 255, 0.15);
    }

    @keyframes elite-enter {
      0% { opacity: 0; transform: scale(0.96) translateY(16px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    @keyframes elite-exit {
      0% { opacity: 1; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(0.96) translateY(12px); }
    }

    @keyframes backdrop-in {
      0% { opacity: 0; backdrop-filter: blur(0px); }
      100% { opacity: 1; backdrop-filter: blur(32px); }
    }

    @keyframes stagger-up {
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      0% { transform: translateX(-150%) skewX(-15deg); }
      100% { transform: translateX(200%) skewX(-15deg); }
    }

    .modal-enter { animation: elite-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .modal-exit { animation: elite-exit 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .backdrop-enter { animation: backdrop-in 0.6s ease-out forwards; }

    /* Staggered entry for content */
    .stagger-1 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.1s; }
    .stagger-2 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.2s; }
    .stagger-3 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.3s; }
    .stagger-4 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.4s; }
    .stagger-5 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.5s; }

    .btn-glow:hover {
      box-shadow: 0 0 32px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.5);
    }
  `}} />
);

// Store prompt event at module level to survive React re-renders and strict mode
let windowDeferredPrompt: BeforeInstallPromptEvent | null = null;

export const PWAInstallPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      windowDeferredPrompt = e as BeforeInstallPromptEvent;
      setTimeout(() => setIsOpen(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleManualTrigger = async () => {
      if (windowDeferredPrompt) {
        windowDeferredPrompt.prompt();
        const { outcome } = await windowDeferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsOpen(false);
        }
        windowDeferredPrompt = null;
      } else if (!isInstalled) {
        setIsOpen(true);
      }
    };
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsOpen(false);
      windowDeferredPrompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('show-install-prompt', handleManualTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('show-install-prompt', handleManualTrigger);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimatingOut(false);
      setShowIOSInstructions(false);
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }, 300);
  };

  const handleInstallClick = async () => {
    if (!windowDeferredPrompt) {
      // Browser doesn't support programmatic install (e.g., iOS Safari)
      setShowIOSInstructions(true);
      return;
    }
    
    windowDeferredPrompt.prompt();
    const { outcome } = await windowDeferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsOpen(false);
    }
    windowDeferredPrompt = null;
  };

  if (isInstalled && !isOpen && !isAnimatingOut) return null;
  if (!isOpen && !isAnimatingOut) return null;

  const features = [
    { icon: Zap, label: "Faster Launch" },
    { icon: WifiOff, label: "Offline Ready" },
    { icon: Cpu, label: "AI Powered" },
    { icon: Crown, label: "Premium Chess Experience" },
    { icon: Bell, label: "Smart Notifications" }
  ];

  return (
    <>
      <CinematicStyles />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans text-white pointer-events-none">
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/80 pointer-events-auto ${isAnimatingOut ? 'opacity-0 transition-opacity duration-300' : 'backdrop-enter'}`}
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="install-title"
          className={`pointer-events-auto relative z-10 w-full max-w-[500px] bg-[#0a0a0a]/90 backdrop-blur-[40px] rounded-[32px] overflow-hidden flex flex-col items-center elite-install-shadow ${isAnimatingOut ? 'modal-exit' : 'modal-enter'}`}
        >
          
          <button 
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors z-30 focus:outline-none backdrop-blur-md"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Prominent Banner Edge-to-Edge */}
          <div className="w-full h-48 sm:h-56 relative mb-6 shrink-0">
            <img src="/think-like-ai.png" alt="Open Gambit Chess" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none"></div>
            
            {/* Lines & Glow Overlay on Image */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/5 blur-[60px] pointer-events-none rounded-full z-0"></div>
          </div>

          <div className="flex flex-col items-center w-full px-6 sm:px-10 pb-8">
            {showIOSInstructions ? (
              <div className="flex flex-col items-center text-center w-full animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-white/80" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Install on iOS</h2>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  To install Open Gambit on your iPhone or iPad:
                </p>
                <div className="flex flex-col gap-3 w-full bg-black/40 rounded-xl p-4 border border-white/5 text-left mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold text-white">1</span>
                    <span className="text-sm text-white/80">Tap the <b>Share</b> button in Safari</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold text-white">2</span>
                    <span className="text-sm text-white/80">Scroll down and tap <b>Add to Home Screen</b></span>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-[20px] bg-white/10 hover:bg-white/20 text-white font-semibold transition-all focus:outline-none"
                >
                  Got it
                </button>
              </div>
            ) : (
              <>
                <h2 id="install-title" className="stagger-2 text-2xl sm:text-3xl font-black text-white tracking-tight mb-2.5 text-center relative z-10 drop-shadow-md">
                  Install Open Gambit
                </h2>
                <p className="stagger-3 text-white/50 text-[13px] sm:text-[15px] font-medium text-center mb-8 leading-relaxed max-w-[340px] relative z-10">
                  Play AI Chess faster with a native app experience. Instant launch, distraction-free.
                </p>

                <div className="stagger-4 flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-10 relative z-10 w-full px-2">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group cursor-default shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] hover:shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                    >
                      <feature.icon className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
                      <span className="text-[11px] sm:text-[12px] font-semibold text-white/50 group-hover:text-white/90 transition-colors tracking-wide">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="stagger-5 w-full flex flex-col gap-3.5 relative z-10 mt-auto">
                  <button 
                    onClick={handleInstallClick}
                    className="w-full py-4 rounded-[20px] bg-gradient-to-b from-[#ffffff] to-[#e5e5e5] border border-white shadow-[0_8px_24px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2.5 group hover:brightness-105 active:scale-[0.98] transition-all btn-glow focus:outline-none"
                  >
                    <Download className="w-[18px] h-[18px] text-black drop-shadow-sm group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                    <span className="text-[15px] font-bold text-black tracking-wide">
                      Install Open Gambit
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleClose}
                    className="w-full py-3.5 rounded-[20px] text-[13px] font-semibold text-white/40 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-all focus:outline-none"
                  >
                    Maybe Later
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
