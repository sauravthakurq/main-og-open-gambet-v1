'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';
import { useChessClockStore } from '@/store/useChessClockStore';
import { Trophy, RefreshCcw, LogOut, Download, Activity, X, Skull, Handshake, Timer, Flag, Scale, Target, Clock, RotateCcw, Crown, Sparkles, Eye, Home } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useEngineStore } from '@/store/useEngineStore';
import { AIAnalysisModal } from '@/components/ui/AIAnalysisModal';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';

const ChessKnightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.5 19H7.5V20.5H16.5V19ZM15 4.5C15 4.5 14.5 3.5 13 3C11.5 2.5 9 3 9 3C9 3 10 5.5 10 7C10 8 9.5 8.5 8 9C7 9.3 5.5 9.5 5 11C4.5 12.5 5 14 6 15C7 16 8.5 17 9 17H15L16.5 14L15.5 12L17 10C17.5 9 18 7.5 17 6C16 4.5 15 4.5 15 4.5Z" />
    <path d="M8.5 6C9.32843 6 10 5.32843 10 4.5C10 3.67157 9.32843 3 8.5 3C7.67157 3 7 3.67157 7 4.5C7 5.32843 7.67157 6 8.5 6Z" fill="#141414" />
  </svg>
);

const ChessBoardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 3H21V21H3V3ZM8 8H12V12H8V8ZM12 8H16V12H12V8ZM8 12H16V16H8V12ZM12 12H16V16H12V12ZM5 5H8V8H5V5ZM16 5H19V8H16V5ZM5 16H8V19H5V16ZM16 16H19V19H16V16ZM8 5H12V8H8V5ZM12 5H16V8H12V5ZM5 8H8V12H5V8ZM16 8H19V12H16V8ZM5 12H8V16H5V12ZM16 12H19V16H16V12ZM8 16H12V19H8V16ZM12 16H16V19H12V16Z" clipRule="evenodd" />
  </svg>
);

const LaurelWreath = ({ className, flipped }: { className?: string, flipped?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className={className} style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path fill="currentColor" opacity="0.15" d="M30,180 C20,150 10,110 30,70 C40,50 60,30 80,20 C85,35 80,50 65,65 C55,75 40,80 30,70 Z M35,160 C25,135 20,100 40,65 C50,45 70,35 85,30 C88,45 80,55 70,65 C55,80 40,80 35,65 Z M45,140 C35,115 35,85 55,55 C65,40 85,35 95,35 C95,50 85,60 75,65 C60,75 50,70 45,60 Z M55,115 C45,95 50,70 70,45 C80,30 95,30 100,35 C95,50 85,55 75,55 C60,55 55,50 55,45 Z" />
  </svg>
);

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes text-shine {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes glint {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    .text-shine-active {
      animation: text-shine 0.8s ease-in-out forwards;
    }
    .animate-glint {
      animation: glint 1.5s ease-in-out infinite;
    }
    .elite-timeout-shadow {
      box-shadow: 
        0 0 0 1px rgba(255, 255, 255, 0.04),
        0 24px 48px rgba(0, 0, 0, 0.8),
        0 0 80px -20px rgba(220, 38, 38, 0.15);
    }
    @keyframes elite-enter {
      0% { opacity: 0; transform: scale(0.96) translateY(12px); }
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
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes timer-drain {
      0% { stroke-dashoffset: 0; stroke: #ef4444; }
      80% { stroke-dashoffset: 276; stroke: #ef4444; filter: drop-shadow(0 0 6px rgba(239,68,68,0.8)); }
      100% { stroke-dashoffset: 276; stroke: #7f1d1d; filter: drop-shadow(0 0 0px rgba(0,0,0,0)); }
    }
    .modal-enter { animation: elite-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .modal-exit { animation: elite-exit 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .backdrop-enter { animation: backdrop-in 0.6s ease-out forwards; }
    
    .timer-ring-deplete { 
      animation: timer-drain 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
      animation-delay: 0.2s;
    }
    .stagger-1 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.1s; }
    .stagger-2 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.2s; }
    .stagger-3 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.3s; }
    .stagger-4 { opacity: 0; animation: stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.4s; }
    .text-shimmer-red {
      background: linear-gradient(to bottom, #ffffff, #fca5a5 30%, #ef4444 80%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .critical-pulse {
      animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse-red {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.05); }
    }
  `}} />
);

export default function GameOverModal() {
  const { game, gameResult, resetGame, history } = useGameStore();
  const { setAppState, matchConfig } = useAppStore();
  const { whiteTime, blackTime, stopClock } = useChessClockStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { fetchAnalysis } = useAnalysisStore();
  const { provider, model, apiKeys, baseUrls, organizations } = useAISettingsStore();
  useAndroidBack('game-over-modal', () => {
    if (showAnalysis) {
      setShowAnalysis(false);
      return;
    }
    if (isVisible) setIsVisible(false);
  }, isVisible || showAnalysis);
  const [isShining, setIsShining] = useState(false);

  useEffect(() => {
    if (game.isGameOver() || gameResult.reason !== null) {
      setIsVisible(true);
      stopClock();
      
      // Prefetch AI analysis silently in the background
      const currentPgn = history.map(m => m.san).join(' ');
      if (currentPgn) {
        const apiKey = apiKeys[provider]?.[0]?.key || '';
        const baseUrl = baseUrls[provider] || '';
        const organization = organizations[provider] || '';
        
        fetchAnalysis({
          pgn: currentPgn,
          provider,
          model,
          apiKey,
          baseUrl,
          organization
        }).catch(err => {
          console.error("Background prefetch analysis failed:", err);
        });
      }

      const userColor = matchConfig?.color || 'w';
      const isAIVsAI = matchConfig?.opponentType === 'aivsai';
      
      let didUserWin = false;
      let isDraw = game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial() || gameResult.winner === 'draw';
      
      if (!isDraw) {
        if (isAIVsAI) {
           didUserWin = true; // Confetti for AI vs AI always
        } else {
           if (gameResult.winner) {
             didUserWin = gameResult.winner === userColor;
           } else {
             // fallback to game.turn() loser
             didUserWin = game.turn() !== userColor;
           }
        }
      }

      if (didUserWin && !isDraw) {
        // Fire Confetti!
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F59E0B', '#FCD34D', '#FFFBEB'],
            zIndex: 1000
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F59E0B', '#FCD34D', '#FFFBEB'],
            zIndex: 1000
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        setTimeout(frame, 300); // Slight delay for animation
      }
    } else {
      setIsVisible(false);
    }
  }, [game.fen(), gameResult]);

  useEffect(() => {
    // Only run shining effect if visible and user won
    const userColor = matchConfig?.color || 'w';
    const isAIVsAI = matchConfig?.opponentType === 'aivsai';
    
    let isDraw = game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial() || gameResult.winner === 'draw';
    let didUserWin = false;
    if (!isDraw) {
      if (isAIVsAI) didUserWin = true;
      else didUserWin = (gameResult.winner || (game.turn() === 'w' ? 'b' : 'w')) === userColor;
    }

    if (isVisible && didUserWin && !isDraw) {
      const initialTimeout = setTimeout(() => setIsShining(true), 500);
      const initialOffTimeout = setTimeout(() => setIsShining(false), 1300);

      const interval = setInterval(() => {
        setIsShining(true);
        setTimeout(() => setIsShining(false), 800);
      }, 2000);

      return () => {
        clearTimeout(initialTimeout);
        clearTimeout(initialOffTimeout);
        clearInterval(interval);
      };
    }
  }, [isVisible, game, gameResult, matchConfig]);

  if (!isVisible) return null;

  const isAIVsAI = matchConfig?.opponentType === 'aivsai';
  const userColor = matchConfig?.color || 'w';
  
  let winner = gameResult.winner;
  if (!winner && !game.isDraw() && !game.isStalemate() && !game.isThreefoldRepetition() && !game.isInsufficientMaterial()) {
     winner = game.turn() === 'w' ? 'b' : 'w';
  }

  const isDraw = game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial() || winner === 'draw';
  const didUserWin = isAIVsAI ? true : (winner === userColor);

  let title = 'GAME OVER';
  let reason = '';
  
  const opponentName = matchConfig?.opponentType === 'computer' 
    ? 'GPT-5' 
    : matchConfig?.opponentType === 'online' ? 'Opponent' : 'Guest User';

  const aiWhiteName = matchConfig?.aiVsAiConfig?.white.provider || 'WHITE';
  const aiBlackName = matchConfig?.aiVsAiConfig?.black.provider || 'BLACK';

  if (isDraw) {
    if (gameResult.reason === 'timeout_insufficient') {
      title = 'DRAW'; // Actually user wants "🤝 Draw" but the icon is separate usually. Wait, user specifically said title: "🤝 Draw". Let's handle emoji below or just add it.
      reason = 'Time expired, but the opponent has insufficient material to deliver checkmate.';
    } else {
      title = 'DRAW';
      if (game.isStalemate()) reason = 'by Stalemate';
      else if (game.isThreefoldRepetition()) reason = 'by Repetition';
      else if (game.isInsufficientMaterial()) reason = 'Insufficient Material';
      else reason = 'by 50-Move Rule';
    }
  } else if (didUserWin) {
    if (isAIVsAI) {
      title = `${winner === 'w' ? aiWhiteName.toUpperCase() : aiBlackName.toUpperCase()} WINS!`;
      if (gameResult.reason === 'timeout') reason = `${winner === 'w' ? aiBlackName : aiWhiteName} ran out of time.`;
      else if (game.isCheckmate() || gameResult.reason === 'checkmate') reason = 'by Checkmate';
    } else {
      title = 'YOU WIN!';
      if (gameResult.reason === 'timeout') {
        title = 'VICTORY';
        reason = `${opponentName} ran out of time.`;
      } else if (game.isCheckmate() || gameResult.reason === 'checkmate') {
        reason = 'by Checkmate';
      }
    }
  } else {
    // User lost
    title = isAIVsAI ? 'GAME OVER' : 'YOU LOSE';
    if (gameResult.reason === 'timeout') {
      title = "TIME'S UP";
      reason = 'Guest User ran out of time.';
    } else if (game.isCheckmate() || gameResult.reason === 'checkmate') {
      reason = 'by Checkmate';
    } else if (gameResult.reason === 'resignation') {
      reason = 'by Resignation';
    }
  }

  // Fallback for missing reasons
  if (!reason && !isDraw) {
    if (game.isCheckmate() || gameResult.reason === 'checkmate') reason = 'by Checkmate';
    else if (gameResult.reason === 'timeout') reason = 'by Time Out';
    else if (gameResult.reason === 'resignation') reason = 'by Resignation';
  }

  const totalMoves = Math.floor(history.length / 2) + (history.length % 2);
  const lastMove = history.length > 0 ? history[history.length - 1]?.san : '-';

  const formatTimeStr = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    // 1. Cancel/reset the engine state FIRST — this aborts any in-flight request
    //    and bumps retryCount so the AI loop re-fires on the new game.
    useEngineStore.getState().resetEngineState();
    
    // 2. Reset the chess board (generates a new gameId — AI loop detects this)
    resetGame();
    
    // 3. Reset and start the clock
    if (matchConfig.timeControl) {
      useChessClockStore.getState().resetClock(matchConfig.timeControl.minutes * 60 * 1000);
    } else {
      useChessClockStore.getState().resetClock(10 * 60 * 1000);
    }
    useChessClockStore.getState().startClock('w');
    
    // 4. Hide the modal
    setIsVisible(false);

    // 5. CRITICAL: Set appState back to 'playing' so useAIGameLoop guard passes.
    //    Must happen AFTER resetGame() so the new gameId is already in the store.
    useAppStore.getState().restartGame();
  };


  const handleNewGame = () => {
    useEngineStore.getState().cancelAIRequest();
    setIsVisible(false);
    setAppState('onboarding');
    resetGame();
  };

  const downloadPgn = () => {
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-gambit-game-${new Date().getTime()}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (didUserWin && !isDraw) {
    return (
      <>
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 font-sans overflow-hidden selection:bg-[#e1aa53] selection:text-black">
          <CustomStyles />
        
        {/* Background glow to ground the popup */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
        <div className="absolute w-[600px] h-[600px] bg-[#e1aa53] rounded-full blur-[150px] opacity-[0.05] pointer-events-none z-0" />

        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-[420px] bg-[#0c0c0c] rounded-t-[2rem] md:rounded-[2rem] border-t md:border border-white/5 shadow-[0_-20px_70px_-20px_rgba(225,170,83,0.15)] md:shadow-[0_20px_70px_-20px_rgba(225,170,83,0.15)] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6 z-10 flex flex-col items-center backdrop-blur-xl"
        >
          
          {/* Subtle inner top glow for 3D depth */}
          <div className="absolute top-0 inset-x-0 flex justify-center overflow-hidden rounded-t-[2rem]">
            <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#e1aa53] to-transparent opacity-50 shadow-[0_0_15px_rgba(225,170,83,0.8)]" />
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-150 z-20"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Auto Shining Trophy Section */}
          <div className="relative mt-6 mb-4 flex justify-center items-center w-full">
            
            {/* Animated Wreaths */}
            <LaurelWreath className={`w-28 h-52 absolute left-2 -top-6 text-[#e1aa53] transition-all duration-150 ${isShining ? '-translate-x-2 -rotate-2 opacity-100' : 'opacity-80'}`} />
            <LaurelWreath className={`w-28 h-52 absolute right-2 -top-6 text-[#e1aa53] transition-all duration-150 ${isShining ? 'translate-x-2 rotate-2 opacity-100' : 'opacity-80'}`} flipped />
            
            {/* Core Trophy Element */}
            <div className="relative z-10 animate-float">
              <div className={`relative text-[110px] leading-none select-none filter transition-all duration-150 ${isShining ? 'drop-shadow-[0_0_35px_rgba(225,170,83,0.9)] scale-105' : 'drop-shadow-[0_15px_20px_rgba(225,170,83,0.4)] scale-100'}`}>
                <span 
                  className={isShining ? 'text-shine-active' : ''}
                  style={{ 
                    background: 'linear-gradient(135deg, #fff2c8 0%, #e1aa53 30%, #ffffff 50%, #e1aa53 70%, #996a1a 100%)',
                    backgroundSize: '200% auto',
                    backgroundPosition: '200% center',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}>
                  🏆
                </span>
              </div>
              
              {/* Auto Sparkles */}
              <Sparkles 
                className={`absolute -top-4 -right-4 w-8 h-8 text-yellow-300 transition-all duration-150 ${isShining ? 'scale-100 opacity-100 rotate-12' : 'scale-0 opacity-0'}`} 
                strokeWidth={1.5}
              />
              <Sparkles 
                className={`absolute top-10 -left-6 w-5 h-5 text-yellow-100 transition-all duration-150 delay-75 ${isShining ? 'scale-100 opacity-80 -rotate-12' : 'scale-0 opacity-0'}`} 
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center z-10 mb-8 mt-2">
            <h1 className="text-[3.25rem] font-extrabold tracking-tight mb-2 flex items-center justify-center gap-3 leading-none whitespace-nowrap">
              {isAIVsAI ? (
                <span className="bg-gradient-to-b from-[#fff5d6] via-[#e5b65c] to-[#b37d26] text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                  {winner === 'w' ? aiWhiteName.toUpperCase() : aiBlackName.toUpperCase()} WINS!
                </span>
              ) : (
                <>
                  <span className="text-white drop-shadow-md">YOU</span>
                  <span className="bg-gradient-to-b from-[#fff5d6] via-[#e5b65c] to-[#b37d26] text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">WIN!</span>
                </>
              )}
            </h1>
            <div className="flex items-center justify-center gap-4 opacity-80">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#e1aa53]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#e1aa53] shadow-[0_0_5px_#e1aa53]" />
              <h2 className="text-xs font-bold tracking-[0.35em] text-[#e1aa53] uppercase">
                {reason}
              </h2>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#e1aa53] shadow-[0_0_5px_#e1aa53]" />
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#e1aa53]" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6 z-10">
            <div className="bg-[#111111] border border-white/5 hover:border-white/10 hover:bg-[#161616] transition-colors duration-150 rounded-2xl p-4 flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2a2416] to-[#120f09] border border-[#3d3320] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Target size={20} className="text-[#e1aa53]" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-0.5">FINAL MOVE</p>
                <p className="text-xl font-bold text-white leading-none">{lastMove}</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 hover:border-white/10 hover:bg-[#161616] transition-colors duration-150 rounded-2xl p-4 flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2a2416] to-[#120f09] border border-[#3d3320] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ChessKnightIcon className="w-5 h-5 text-[#e1aa53]" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-0.5">TOTAL MOVES</p>
                <p className="text-xl font-bold text-white leading-none">{totalMoves}</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 hover:border-white/10 hover:bg-[#161616] transition-colors duration-150 rounded-2xl p-4 flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-[#333] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock size={20} className="text-gray-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-0.5">WHITE TIME</p>
                <p className="text-xl font-bold text-white leading-none">{formatTimeStr(whiteTime)}</p>
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 hover:border-white/10 hover:bg-[#161616] transition-colors duration-150 rounded-2xl p-4 flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-[#333] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock size={20} className="text-gray-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 mb-0.5">BLACK TIME</p>
                <p className="text-xl font-bold text-white leading-none">{formatTimeStr(blackTime)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mb-7 z-10">
            <button onClick={handleRestart} className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-150 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-300 hover:text-white font-semibold text-sm group">
              <RotateCcw size={18} className="group-hover:-rotate-90 transition-transform duration-150" />
              Rematch
            </button>
            
            <button 
              onClick={handleNewGame}
              className="flex-1 rounded-xl py-4 flex items-center justify-center gap-2 text-black font-bold text-sm relative overflow-hidden transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(225,170,83,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(225,170,83,0.7)] group"
              style={{
                background: 'linear-gradient(135deg, #e5b65c 0%, #fad77b 50%, #c78d2e 100%)'
              }}
            >
              <div className="absolute inset-0 opacity-[0.08] group-hover:scale-110 transition-transform duration-300" style={{
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 8px 8px'
              }} />
              
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:animate-glint skew-x-[-20deg]" />

              <div className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                <Home size={18} className="text-black" />
                Home
              </div>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="w-full flex items-center justify-between text-gray-400 text-[11px] font-bold tracking-wide uppercase z-10 px-2 pb-1">
            <button onClick={() => setShowAnalysis(true)} className="flex items-center gap-2 hover:text-[#e1aa53] transition-colors group">
              <Activity size={15} className="group-hover:scale-110 transition-transform" />
              AI Analysis
            </button>

            <div className="flex-1 flex items-center justify-center mx-4 relative">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="absolute bg-[#0c0c0c] px-3">
                <Crown size={14} className="text-gray-600" />
              </div>
            </div>

            <button onClick={() => setIsVisible(false)} className="flex items-center gap-2 hover:text-[#e1aa53] transition-colors group">
              <Eye size={15} className="group-hover:translate-y-[2px] transition-transform" />
              Review Game
            </button>
          </div>

        </motion.div>
        </div>
        {showAnalysis && (
          <AIAnalysisModal pgn={history.map(m => m.san).join(' ')} onClose={() => setShowAnalysis(false)} />
        )}
      </>
    );
  }

  // Cinematic Time's Up Popup
  if (gameResult.reason === 'timeout' && !didUserWin && !isDraw) {
    const userIsWhite = userColor === 'w';
    const highlightWhiteTime = !userIsWhite;
    
    return (
      <>
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden selection:bg-red-500/30">
          <CustomStyles />

        {/* Background ambient lighting */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-[#050505] to-[#010101] opacity-90"></div>
        
        <div className="absolute inset-0 bg-black/60 backdrop-enter"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.05)_0%,transparent_100%)] z-0"></div>

        <div className="relative z-10 w-[90%] max-w-[380px] rounded-[28px] bg-[#0c0909]/80 backdrop-blur-[40px] border border-white/[0.06] p-5 md:p-6 flex flex-col items-center elite-timeout-shadow overflow-hidden modal-enter">
            {/* Precision top refractive light line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-red-400/30 to-transparent"></div>
            
            <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.1] text-white/30 hover:text-white transition-colors z-20 focus:outline-none">
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center w-full mt-1">
              <div className="stagger-1 relative flex items-center justify-center w-[140px] h-[140px] md:w-[160px] md:h-[160px] mb-4 mt-2">
                <div className="absolute inset-0 bg-red-600/20 rounded-full blur-[35px] critical-pulse"></div>
                <svg className="absolute w-[105%] h-[105%] animate-[spin_25s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(185, 28, 28, 0.7)" strokeWidth="3" strokeDasharray="2 12" />
                </svg>
                <svg className="absolute w-[88%] h-[88%] animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" strokeDasharray="15 10" />
                </svg>
                <svg className="absolute w-[95%] h-[95%] transform -rotate-90 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="276" strokeDashoffset="276" className="timer-ring-deplete" strokeLinecap="round" />
                </svg>
                <div className="absolute w-[95px] h-[95px] md:w-[110px] md:h-[110px] bg-gradient-to-b from-[#1a0505] to-[#0a0202] rounded-full border border-red-500/20 shadow-[inset_0_2px_12px_rgba(239,68,68,0.3)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse mix-blend-screen" style={{ animationDuration: '1.5s' }}></div>
                  <Timer size={48} strokeWidth={1.5} className="text-red-400 relative z-10 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] md:w-[60px] md:h-[60px]" />
                </div>
              </div>

              <h2 className="stagger-2 text-[28px] md:text-[32px] font-black tracking-tighter mb-1 drop-shadow-[0_2px_12px_rgba(239,68,68,0.4)] text-shimmer-red">
                TIME'S UP
              </h2>
              <p className="stagger-2 text-white/40 font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px] mb-6">
                Match concluded • Time depletion
              </p>

              <div className="stagger-3 w-full grid grid-cols-2 gap-2.5 mb-6">
                <div className="flex flex-col bg-white/[0.02] rounded-[18px] p-3.5 border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] items-center justify-center backdrop-blur-md relative group hover:bg-white/[0.04] transition-colors">
                  <span className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-1 group-hover:text-white/50 transition-colors">Final Move</span>
                  <span className="text-white/90 font-mono text-lg font-bold tracking-tight">{lastMove}</span>
                </div>
                <div className="flex flex-col bg-white/[0.02] rounded-[18px] p-3.5 border border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] items-center justify-center backdrop-blur-md relative group hover:bg-white/[0.04] transition-colors">
                  <span className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-1 group-hover:text-white/50 transition-colors">Total Moves</span>
                  <span className="text-white/90 font-mono text-lg font-bold tracking-tight">{totalMoves}</span>
                </div>
                
                {/* White Time */}
                <div className={`flex flex-col rounded-[18px] p-3.5 border items-center justify-center backdrop-blur-md relative overflow-hidden transition-colors ${highlightWhiteTime ? 'bg-red-950/30 border-red-500/20 shadow-[inset_0_1px_12px_rgba(239,68,68,0.1)]' : 'bg-white/[0.02] border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'}`}>
                  {highlightWhiteTime && <div className="absolute inset-0 bg-red-500/10 critical-pulse"></div>}
                  <span className={`text-[9px] uppercase tracking-widest font-bold mb-1 relative z-10 ${highlightWhiteTime ? 'text-red-300/70' : 'text-white/30'}`}>White Time</span>
                  <span className={`font-mono text-lg font-bold tracking-tight relative z-10 ${highlightWhiteTime ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-white/90'}`}>{formatTimeStr(whiteTime)}</span>
                </div>
                
                {/* Black Time */}
                <div className={`flex flex-col rounded-[18px] p-3.5 border items-center justify-center backdrop-blur-md relative overflow-hidden transition-colors ${!highlightWhiteTime ? 'bg-red-950/30 border-red-500/20 shadow-[inset_0_1px_12px_rgba(239,68,68,0.1)]' : 'bg-white/[0.02] border-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'}`}>
                  {!highlightWhiteTime && <div className="absolute inset-0 bg-red-500/10 critical-pulse"></div>}
                  <span className={`text-[9px] uppercase tracking-widest font-bold mb-1 relative z-10 ${!highlightWhiteTime ? 'text-red-300/70' : 'text-white/30'}`}>Black Time</span>
                  <span className={`font-mono text-lg font-bold tracking-tight relative z-10 ${!highlightWhiteTime ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-white/90'}`}>{formatTimeStr(blackTime)}</span>
                </div>
              </div>

              <div className="stagger-4 w-full flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                  <button onClick={handleRestart} className="group relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] bg-white/[0.04] text-white font-semibold transition-all hover:bg-white/[0.08] hover:scale-[1.02] border border-white/[0.08] active:scale-[0.98] overflow-hidden focus:outline-none">
                    <RefreshCcw size={16} className="text-white/50 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                    <span className="text-[13px] tracking-wide">Rematch</span>
                  </button>
                  <button onClick={handleNewGame} className="group relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] bg-gradient-to-b from-[#E5C5A8] to-[#c29b7a] text-black font-bold transition-all hover:brightness-110 hover:scale-[1.02] shadow-[0_4px_20px_rgba(229,197,168,0.15)] hover:shadow-[0_8px_32px_rgba(229,197,168,0.25)] border border-[#E5C5A8]/50 active:scale-[0.98] focus:outline-none">
                    <Home size={16} className="text-black/80 group-hover:text-black transition-colors" />
                    <span className="text-[13px] tracking-wide">Home</span>
                  </button>
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => setShowAnalysis(true)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-transparent text-white/40 hover:text-white hover:bg-white/[0.03] transition-all font-medium text-[12px] group focus:outline-none active:scale-[0.98]">
                    <Activity size={14} className="group-hover:text-[#E5C5A8] transition-colors" />
                    AI Analysis
                  </button>
                  <button onClick={() => setIsVisible(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-transparent text-white/40 hover:text-white hover:bg-white/[0.03] transition-all font-medium text-[12px] group focus:outline-none active:scale-[0.98]">
                    <Eye size={14} className="group-hover:text-[#E5C5A8] transition-colors" />
                    Review Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showAnalysis && (
          <AIAnalysisModal pgn={history.map(m => m.san).join(' ')} onClose={() => setShowAnalysis(false)} />
        )}
      </>
    );
  }

  // Fallback for Defeat and Draw states
  let themeColor = 'from-slate-900/90 to-slate-800/95';
  let accentColor = 'text-white';
  let badgeColor = 'bg-white/10 border-white/20 text-white';
  let Icon = Handshake;
  let glowColor = 'rgba(255,255,255,0.2)';

  if (isDraw) {
    themeColor = 'from-slate-800/95 to-slate-900/95 border-slate-600/50 shadow-[0_0_50px_rgba(148,163,184,0.3)]';
    accentColor = 'text-slate-300';
    badgeColor = 'bg-slate-500/20 border-slate-400/40 text-slate-300';
    Icon = Scale;
    glowColor = 'rgba(148,163,184,0.2)';
  } else {
    themeColor = 'from-red-950/95 to-slate-900/95 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.4)]';
    accentColor = 'text-red-500';
    badgeColor = 'bg-red-500/20 border-red-400/40 text-red-300';
    Icon = Skull;
    glowColor = 'rgba(239,68,68,0.25)';
  }

  // Override Icon for timeout/resignation
  if (!isDraw) {
    if (gameResult.reason === 'timeout') Icon = Timer;
    else if (gameResult.reason === 'resignation') Icon = Flag;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4">
      {/* Dim Overlay with Blur */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60"
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-0" />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
        }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full max-w-[420px] overflow-hidden rounded-t-[2rem] md:rounded-3xl border-t md:border-2 bg-gradient-to-b ${themeColor} backdrop-blur-3xl p-6 md:p-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-8 z-10 flex flex-col items-center shadow-[0_-20px_60px_rgba(0,0,0,0.5)] md:shadow-none`}
      >
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,${glowColor},transparent_60%)] pointer-events-none mix-blend-screen`} />

        <button 
          onClick={() => setIsVisible(false)} 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center w-full mt-2">
          
          {/* Animated Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, bounce: 0.6 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${badgeColor} shadow-inner transform-gpu`}
          >
            <Icon className={`w-10 h-10 ${accentColor}`} />
          </motion.div>

          {/* Titles */}
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl font-black tracking-tight mb-1 drop-shadow-lg ${accentColor}`}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 font-semibold tracking-widest uppercase text-xs mb-8"
          >
            {reason}
          </motion.p>

          {/* Statistics Grid */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full grid grid-cols-2 gap-3 mb-8"
          >
            <div className="flex flex-col bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner items-center justify-center">
              <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Final Move</span>
              <span className="text-white/90 font-mono text-xl font-medium">{lastMove}</span>
            </div>
            <div className="flex flex-col bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner items-center justify-center">
              <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Total Moves</span>
              <span className="text-white/90 font-mono text-xl font-medium">{totalMoves}</span>
            </div>
            <div className="flex flex-col bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner items-center justify-center">
              <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">White Time</span>
              <span className="text-white/90 font-mono text-xl font-medium">{formatTimeStr(whiteTime)}</span>
            </div>
            <div className="flex flex-col bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner items-center justify-center">
              <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Black Time</span>
              <span className="text-white/90 font-mono text-xl font-medium">{formatTimeStr(blackTime)}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full flex flex-col gap-3"
          >
            <div className="flex gap-3">
              <button onClick={handleRestart} className="group relative flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 text-white font-bold transition-all hover:bg-white/10 hover:-translate-y-0.5 border border-white/10 hover:border-white/20 active:translate-y-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <RefreshCcw size={18} />
                Rematch
              </button>
              <button onClick={handleNewGame} className="group relative flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-accent)] text-black font-bold transition-all hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_24px_var(--color-accent-dim)] hover:shadow-[0_8px_32px_rgba(184,164,142,0.4)] border border-[var(--color-accent)]/50 active:translate-y-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Home size={18} className="text-black" />
                Home
              </button>
            </div>
            
            <div className="flex gap-3 mt-1">
              <button onClick={() => setShowAnalysis(true)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent text-white/50 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm border border-transparent hover:border-white/10 group">
                <Activity size={16} className="group-hover:scale-110 transition-transform" />
                AI Analysis
              </button>
              <button onClick={() => setIsVisible(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent text-white/50 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm border border-transparent hover:border-white/10 group">
                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                Review Game
              </button>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
