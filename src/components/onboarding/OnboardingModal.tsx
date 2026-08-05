'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

import OpponentSelection from './OpponentSelection';
import ComputerConfig from './ComputerConfig';
import AISettingsPanel from '../ui/AISettingsPanel';
import OnlineLobby from '../online/OnlineLobby';
import LocalAIConfig from './LocalAIConfig';
import GameSetup from './GameSetup';
import HomeNavbar from '../layout/HomeNavbar';

type OnboardingStep = 'opponent' | 'config' | 'setup';

export default function OnboardingModal() {
  const { appState, matchConfig, updateMatchConfig, setAppState } = useAppStore();
  const [step, setStep] = useState<OnboardingStep>('opponent');

  React.useEffect(() => {
    if (appState === 'onboarding') {
      setStep('opponent');
    }
  }, [appState]);

  if (appState !== 'onboarding') return null;

  const handleOpponentSelect = (type: any) => {
    updateMatchConfig({ opponentType: type as any });
    if (type === 'aivsai') {
      setStep('setup');
    } else {
      setStep('config');
    }
  };

  const handleStartGame = (color: any, time: any, aiVsAiConfig?: any) => {
    let finalColor = color;
    if (color === 'random') {
      finalColor = Math.random() > 0.5 ? 'w' : 'b';
    }
    updateMatchConfig({ color: finalColor, timeControl: time, aiVsAiConfig });
    setAppState('playing');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto overflow-x-hidden bg-black selection:bg-white/20 pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(3rem+env(safe-area-inset-bottom))] sm:p-0 custom-scrollbar">
      
      {/* Home Navbar overlaying the modal (only on first step) */}
      {step === 'opponent' && <HomeNavbar />}

      {/* Cinematic Background Environment */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Core Volumetric Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            x: ['-5%', '5%', '-5%'],
            y: ['-5%', '5%', '-5%']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-accent)] blur-[140px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: ['5%', '-5%', '5%'],
            y: ['5%', '-5%', '5%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/30 blur-[150px]"
        />
        
        {/* Grain/Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")` }}
        ></div>
        
        {/* Chess Grid Projection */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            transform: 'perspective(1000px) rotateX(60deg) translateY(100px) scale(2.5)',
            transformOrigin: 'bottom center'
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step === 'setup' ? 'battle' : 'think'}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none select-none bg-cover bg-center"
            style={{ 
              backgroundImage: matchConfig.opponentType === 'online' 
                ? `url('/signin.png')` 
                : step === 'setup' ? `url('/battle.png')` : `url('/think-like-ai.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark Premium Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        </AnimatePresence>

        {/* Deep Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }} 
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        exit={{ scale: 0.95, opacity: 0, filter: 'blur(5px)' }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
        className="relative z-10 w-full max-w-[1200px] flex flex-col items-center m-auto px-4 py-4 sm:py-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === 'opponent' && (
            <motion.div
              key="opponent"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="w-full text-center"
            >

              <OpponentSelection onSelect={handleOpponentSelect} />
            </motion.div>
          )}

          {step === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="w-full flex justify-center"
            >
              {matchConfig.opponentType === 'computer' && (
                <ComputerConfig 
                  onBack={() => setStep('opponent')}
                  onNext={(diff) => {
                    updateMatchConfig({ difficulty: diff });
                    setStep('setup');
                  }}
                />
              )}
              {matchConfig.opponentType === 'ai' && (
                <div className="bg-[#111111]/95 border border-white/5 rounded-[20px] p-2 shadow-2xl">
                  <AISettingsPanel 
                    onCancel={() => setStep('opponent')}
                    onSave={() => setStep('setup')}
                  />
                </div>
              )}
              {matchConfig.opponentType === 'online' && (
                <OnlineLobby
                  onBack={() => setStep('opponent')}
                />
              )}
              {matchConfig.opponentType === 'local' && (
                <LocalAIConfig 
                  onBack={() => setStep('opponent')}
                  onNext={(model) => {
                    setStep('setup');
                  }}
                />
              )}
            </motion.div>
          )}

          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex items-center justify-center pt-10 sm:pt-0 pb-10"
            >
              <GameSetup 
                opponentType={matchConfig.opponentType}
                onBack={() => setStep(matchConfig.opponentType === 'aivsai' ? 'opponent' : 'config')} 
                onStart={handleStartGame} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
