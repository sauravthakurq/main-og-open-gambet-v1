'use client';

import React, { useState, useEffect } from 'react';
import ChessBoard3D from '@/components/board/ChessBoard3D';
import ChessBoard2D from '@/components/board/ChessBoard2D';
import EvalBar from '@/components/board/EvalBar';
import RightSidebar from '@/components/layout/RightSidebar';
import AISettingsPanel from '@/components/ui/AISettingsPanel';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import GameOverModal from '@/components/ui/GameOverModal';
import GameMenuModal from '@/components/ui/GameMenuModal';
import CapturedPieces from '@/components/ui/CapturedPieces';
import Navbar from '@/components/layout/Navbar';
import { useGameStore } from '@/store/useGameStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAIGameLoop } from '@/hooks/useAIGameLoop';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useAppStore } from '@/store/useAppStore';
import { useChessClockStore } from '@/store/useChessClockStore';
import PlayerTimer from '@/components/game/PlayerTimer';
import GameInsights from '@/components/game/GameInsights';
import PlayerCard from '@/components/game/PlayerCard';
import { useChessClockLoop } from '@/hooks/useChessClockLoop';
import { useAIVsAILoop } from '@/hooks/useAIVsAILoop';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { usePresence } from '@/hooks/usePresence';
import { useOnlineGameSync } from '@/hooks/useOnlineGameSync';
import InGameChat from '@/components/online/InGameChat';
import DrawOfferBanner from '@/components/online/DrawOfferBanner';
import ReconnectBanner from '@/components/online/ReconnectBanner';
import MatchIntro from '@/components/online/MatchIntro';
import { useOnlineStore } from '@/store/useOnlineStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useGambitAIStore } from '@/store/useGambitAIStore';
import { useLearningStore } from '@/store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, Puzzle, Sparkles, BrainCircuit, GraduationCap, Swords, ChevronRight } from 'lucide-react';



export default function Home() {
  const { appState, matchConfig, isPaused, setIsPaused, isGameMenuOpen, setIsGameMenuOpen, playbackSpeed, setPlaybackSpeed } = useAppStore();
  const { viewMode, setViewMode, fen, history, turn, game, resetGame } = useGameStore();
  const { initEngine, destroyEngine, startThinking, engineInfo, isThinking } = useEngineStore();
  const { provider, engineType, model, setEngineType } = useAISettingsStore();
  const { resetClock } = useChessClockStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [gameKey, setGameKey] = useState(0); // increments on each new game, triggers AI loops
  
  // AI plays opposite to user color
  const userColor = matchConfig?.color || 'w';
  const aiColor = userColor === 'w' ? 'b' : 'w';
  const isAIVsAI = matchConfig?.opponentType === 'aivsai';
  
  const { onlineGameId } = useOnlineStore();
  
  useAndroidBack(); // Global listener for double-tap exit on home screen
  useAndroidBack('mobile-drawer', () => setShowMobileDrawer(false), showMobileDrawer);
  useAndroidBack('settings', () => setShowSettings(false), showSettings);
  useAIGameLoop(aiColor);
  useAIVsAILoop(gameKey);
  useChessClockLoop();
  useFirebaseAuth();
  usePresence();

  const isOnline = matchConfig?.opponentType === 'online';
  const { submitOnlineMove, isMyTurn, myColor, onlineGame, resign, offerDraw } = useOnlineGameSync();

  // Handle Game Start — increment gameKey to (re)trigger AI loops
  useEffect(() => {
    if (appState === 'playing') {
      resetGame();
      setGameKey((k) => k + 1); // signals AI loops to restart
      const timeControl = matchConfig.timeControl;
      if (timeControl) {
        resetClock(timeControl.minutes * 60 * 1000);
      } else {
        resetClock(10 * 60 * 1000); // 10 minutes fallback
      }

      if (matchConfig.opponentType === 'computer' || matchConfig.opponentType === 'online') {
        setEngineType('local');
      } else if (matchConfig.opponentType === 'ai' || matchConfig.opponentType === 'local') {
        setEngineType('cloud');
      }
    }
  }, [appState]);

  // Engine Lifecycle
  useEffect(() => {
    initEngine();
    return () => destroyEngine();
  }, [initEngine, destroyEngine]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    if (appState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsGameMenuOpen(!isGameMenuOpen);
      } else if (e.code === 'Space' && !isGameMenuOpen) {
        e.preventDefault(); // Prevent page scroll
        setIsPaused(!isPaused);
      } else if (e.key.toLowerCase() === 'r' && !isGameMenuOpen) {
        // We can just open the game menu to restart
        setIsGameMenuOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, isGameMenuOpen, isPaused, setIsGameMenuOpen, setIsPaused]);

  useEffect(() => {
    // Only do background evaluation if it is NOT the computer's turn
    if (fen && turn !== aiColor) {
      startThinking(fen, 18);
    }
  }, [fen, turn, aiColor, startThinking]);

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--color-void)] text-[var(--color-ivory)] overflow-hidden font-sans relative">
      <OnboardingModal />
      <GameOverModal />
      <GameMenuModal />
      {/* Online multiplayer overlays */}
      <ReconnectBanner />
      <MatchIntro />
      {isOnline && <DrawOfferBanner />}
      {isOnline && onlineGameId && <InGameChat gameId={onlineGameId} />}
      
      {(appState === 'playing' || appState === 'game_over') && (
        <div className="flex-1 flex flex-col h-full w-full relative bg-transparent overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
          <Navbar />
          
          <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-3 sm:p-4 lg:p-6 pt-3 sm:pt-[80px] lg:pt-[80px] pb-[96px] sm:pb-[calc(1rem+env(safe-area-inset-bottom))] gap-4 lg:gap-6 w-full max-w-[1800px] mx-auto">
            
            {/* Left Column: Player Workspace (Desktop) / Top & Bottom (Mobile) */}
            <aside className="flex flex-col gap-4 lg:h-full w-full lg:w-[320px] shrink-0 order-1 lg:order-1">
              {/* Top Player (Opponent) */}
              {isAIVsAI ? (
                <PlayerCard 
                  type="ai"
                  color="b"
                  provider={matchConfig.aiVsAiConfig?.black.provider}
                  model={matchConfig.aiVsAiConfig?.black.model}
                  engineType={matchConfig.aiVsAiConfig?.black.engineType}
                  isThinking={turn === 'b' && isThinking}
                  isActive={turn === 'b'}
                />
              ) : (
                <PlayerCard 
                  type="ai"
                  color={aiColor as 'w'|'b'}
                  provider={provider}
                  model={model}
                  engineType={engineType}
                  isThinking={isThinking}
                  isActive={turn === aiColor}
                />
              )}

              {/* Game Insights - Hidden on mobile, shown on desktop */}
              <GameInsights />

              {/* Bottom Player (You) - Moved below board on mobile */}
              {isAIVsAI ? (
                <PlayerCard 
                  type="ai"
                  color="w"
                  provider={matchConfig.aiVsAiConfig?.white.provider}
                  model={matchConfig.aiVsAiConfig?.white.model}
                  engineType={matchConfig.aiVsAiConfig?.white.engineType}
                  isThinking={turn === 'w' && isThinking}
                  isActive={turn === 'w'}
                  isDesktopOnly
                />
              ) : (
                <PlayerCard 
                  type="human"
                  color={userColor as 'w'|'b'}
                  isActive={turn === userColor}
                  isDesktopOnly
                />
              )}
            </aside>

            {/* Center Column: Chessboard */}
            <div className={`flex-1 flex flex-col items-center gap-4 lg:gap-6 relative transition-all duration-1000 order-2 lg:order-2 w-full lg:w-auto ${game.isCheckmate() ? 'board-container-checkmate' : ''}`}>
              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSettings(false)}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[rgba(0,0,0,0.65)] backdrop-blur-md overflow-y-auto"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-[101] w-full max-w-[1000px] h-[92vh] max-h-[780px] min-h-[540px]"
                    >
                      <AISettingsPanel onClose={() => setShowSettings(false)} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex w-full max-w-[800px] justify-center relative items-stretch gap-4">
                
                {/* Vertical Eval Bar */}
                <EvalBar />

                {/* Board Container */}
                <div className="relative flex-1 aspect-square w-full max-w-[90vw] lg:max-w-[700px] p-1.5 sm:p-2 rounded-xl border border-[var(--color-charcoal)] board-frame-bg transition-all">
                  <div className="absolute -bottom-5 left-[10%] w-[80%] h-4 bg-[var(--color-accent)] blur-[25px] opacity-40 rounded-full pointer-events-none hidden lg:block"></div>
                  <div className="w-full h-full bg-[var(--color-obsidian)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-carbon)] relative z-10 touch-none">
                    {viewMode === '3D' ? <ChessBoard3D /> : <ChessBoard2D />}
                  </div>
                </div>
              </div>

              {/* Bottom Player (You) - Mobile Only */}
              {isAIVsAI ? (
                <PlayerCard 
                  type="ai"
                  color="w"
                  provider={matchConfig.aiVsAiConfig?.white.provider}
                  model={matchConfig.aiVsAiConfig?.white.model}
                  engineType={matchConfig.aiVsAiConfig?.white.engineType}
                  isThinking={turn === 'w' && isThinking}
                  isActive={turn === 'w'}
                  isMobileOnly
                />
              ) : (
                <PlayerCard 
                  type="human"
                  color={userColor as 'w'|'b'}
                  isActive={turn === userColor}
                  isMobileOnly
                />
              )}

              {/* Playback Controls for AI vs AI */}
              {isAIVsAI && (
                <div className="w-full max-w-[800px] flex items-center justify-between border border-[var(--color-charcoal)] bg-[rgba(10,10,10,0.6)] rounded-xl p-3 px-4 mb-2">
                  <span className="text-xs text-[var(--color-slate)] font-bold tracking-widest uppercase">Spectator Controls</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors bg-white/5 border border-white/5 text-white"
                    >
                      {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1)}
                      className="p-2 px-3 rounded-lg hover:bg-white/10 transition-colors bg-white/5 border border-white/5 text-white flex items-center gap-1 font-mono text-sm font-bold"
                    >
                      <FastForward size={16} /> {playbackSpeed}x
                    </button>
                  </div>
                </div>
              )}


            </div>

            {/* Right Column: AI Control Center */}
            <div className="hidden lg:block shrink-0 w-[360px] order-3">
              <RightSidebar showSettings={showSettings} setShowSettings={setShowSettings} />
            </div>
            
            {/* Mobile Bottom Sheet (Drawer) */}
            <AnimatePresence>
              {showMobileDrawer && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMobileDrawer(false)}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                  />
                  <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-[var(--color-void)] border-t border-[var(--color-charcoal)] rounded-t-3xl overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col lg:hidden"
                  >
                    <div className="w-full flex justify-center pt-3 pb-1">
                      <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-[calc(3rem+env(safe-area-inset-bottom))]">
                      <RightSidebar showSettings={showSettings} setShowSettings={setShowSettings} />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
