'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Cpu, Zap, Brain, Circle, CheckCircle2, Cloud, HardDrive, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useEngineStore } from '@/store/useEngineStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useAppStore } from '@/store/useAppStore';
import { Move } from 'chess.js';
import { AIThinkingIndicator } from '../ui/AIThinkingIndicator';

export default function RightSidebar({ showSettings, setShowSettings }: { showSettings: boolean, setShowSettings: (v: boolean) => void }) {
  const { history, fen, undoMove, redoMove, game, turn } = useGameStore();
  const { engineInfo, isThinking, connectionState, currentResponseTime, averageResponseTime, fastestResponse, slowestResponse, cancelAIRequest, triggerRetry } = useEngineStore();
  const { engineType, provider, model, isConnected, setEngineType, setProvider, setModel } = useAISettingsStore();
  const { matchConfig } = useAppStore();
  const difficulty = matchConfig.difficulty;
  const moveListRef = useRef<HTMLDivElement>(null);
  const [isAIMinimized, setIsAIMinimized] = React.useState(false);

  const QUICK_MODELS = [
    { id: 'openai', name: 'OpenAI', model: 'GPT-4o', icon: 'openai.svg' },
    { id: 'anthropic', name: 'Anthropic', model: 'Claude 3.5 Sonnet', icon: 'anthropic.svg' },
    { id: 'google', name: 'Google', model: 'Gemini 2.5 Pro', icon: 'google.svg' },
    { id: 'deepseek', name: 'DeepSeek', model: 'Deepseek Reasoner', icon: 'deepseek.svg' },
  ];

  // Auto-scroll move list
  useEffect(() => {
    if (moveListRef.current) {
      moveListRef.current.scrollTop = moveListRef.current.scrollHeight;
    }
  }, [history.length]);

  const groupedMoves = history.reduce((acc, move, i) => {
    if (i % 2 === 0) {
      acc.push([move]);
    } else {
      acc[acc.length - 1].push(move);
    }
    return acc;
  }, [] as Move[][]);

  // Status text determination
  let statusText = "Idle";
  let StatusIcon = Circle;
  let statusColor = "text-white/30";
  let statusBg = "bg-white/[0.03]";
  let statusBorder = "border-white/[0.05]";

  if (game.isCheckmate()) {
    statusText = "Checkmate";
    statusColor = "text-red-400";
    statusBg = "bg-red-400/10";
    statusBorder = "border-red-400/20";
  } else if (game.inCheck()) {
    statusText = "Check";
    statusColor = "text-orange-400";
    statusBg = "bg-orange-400/10";
    statusBorder = "border-orange-400/20";
  } else if (isThinking) {
    statusText = engineType === 'cloud' ? connectionState : "Calculating...";
    statusColor = "text-[var(--color-accent)]";
    statusBg = "bg-[var(--color-accent)]/10";
    statusBorder = "border-[var(--color-accent)]/20";
  } else if (connectionState !== 'Connected' && connectionState !== 'Connecting' && connectionState !== 'Cancelled') {
    statusText = connectionState;
    statusColor = "text-red-400";
    statusBg = "bg-red-400/10";
    statusBorder = "border-red-400/20";
  }

  const handleDownloadPGN = () => {
    const blob = new Blob([game.pgn()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OpenGambit_Game.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <aside className={`flex flex-col gap-3 h-full w-[320px] md:w-[360px] transition-opacity duration-300 ${showSettings ? 'opacity-20 pointer-events-none' : 'opacity-100'} overflow-y-auto overflow-x-hidden pb-6 custom-scrollbar`}>
      
      {/* 1. AI Control Card */}
      <motion.div className="flex flex-col p-4 rounded-xl border border-white/[0.04] bg-[#141414]/90 backdrop-blur-3xl shadow-lg relative overflow-hidden shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 p-1.5">
               {engineType === 'local' ? (
                 <Cpu className="w-full h-full text-white/90" />
               ) : (
                 <img src={`/icons/${provider.toLowerCase().replace(' ', '-')}.svg`} alt={provider} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
               )}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white/90 tracking-tight leading-tight truncate max-w-[120px]" title={engineType === 'local' ? 'Stockfish 16' : model}>
                {engineType === 'local' ? 'Stockfish 16' : model.split(' ').slice(0, 4).join(' ')}
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">{engineType === 'local' ? 'Local Engine' : provider}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-[10px] font-medium text-white/60">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/[0.04] pt-3 mt-1">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Quick Select Provider</span>
          {QUICK_MODELS.map(m => (
            <button 
              key={m.id}
              onClick={() => {
                 setEngineType('cloud');
                 setProvider(m.name);
                 setModel(m.model);
                 setShowSettings(true);
              }}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${provider === m.name && engineType === 'cloud' ? 'bg-white/10 border-white/20 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
               <div className="flex items-center gap-3">
                  <img src={`/icons/${m.icon}`} alt={m.name} className="w-5 h-5 object-contain" />
                  <div className="flex flex-col items-start text-left">
                     <span className="text-sm font-semibold text-white/90 leading-none">{m.name}</span>
                     <span className="text-xs text-white/50 mt-1">{m.model}</span>
                  </div>
               </div>
               {provider === m.name && engineType === 'cloud' && (
                 <div className="flex items-center gap-1.5">
                   <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                   <span className="text-xs text-emerald-400 font-medium">Active</span>
                 </div>
               )}
            </button>
          ))}
          
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center w-full gap-2 px-3 py-2.5 mt-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-colors text-xs font-bold"
          >
            <Settings2 size={14} /> Configure All Models
          </button>
        </div>
      </motion.div>

      {/* 2. AI Thinking & Engine Dashboard */}
      <motion.div className={`p-4 rounded-xl border border-white/[0.04] bg-[#141414]/90 backdrop-blur-3xl shadow-lg relative overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${isAIMinimized ? 'h-[52px]' : ''}`}>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-[var(--color-accent)] opacity-80" />
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-white/70">AI Status</h3>
          </div>
          
          <button 
            onClick={() => setIsAIMinimized(!isAIMinimized)}
            className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            {isAIMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} className="-rotate-90" />}
          </button>
        </div>

        {!isAIMinimized && (
          <>
            {engineType === 'local' && (
              <>
                <div className="grid grid-cols-4 gap-2 mb-4 relative z-10 bg-black/20 p-2 rounded-lg border border-white/5">
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-xs uppercase tracking-wider text-white/40 mb-1">Depth</span>
                    <span className="font-mono text-sm font-semibold text-white/90">{engineInfo?.depth || 0}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-xs uppercase tracking-wider text-white/40 mb-1">Nodes</span>
                    <span className="font-mono text-sm font-semibold text-white/90">{((engineInfo?.nodes || 0) / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-xs uppercase tracking-wider text-white/40 mb-1">NPS</span>
                    <span className="font-mono text-sm font-semibold text-white/90">{((engineInfo?.nps || 0) / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-xs uppercase tracking-wider text-white/40 mb-1">Time</span>
                    <span className="font-mono text-sm font-semibold text-white/90">{((engineInfo?.time || 0) / 1000).toFixed(1)}s</span>
                  </div>
                </div>

                {/* 3. Engine Variations */}
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Top Lines</h3>
                  
                  {(!engineInfo?.variations || engineInfo.variations.length === 0) && (
                    <div className="text-xs text-white/40 italic p-2 bg-black/20 rounded-lg">Awaiting analysis...</div>
                  )}

                  {engineInfo?.variations && engineInfo.variations
                    .sort((a, b) => a.multipv - b.multipv)
                    .map((v, i) => {
                      const scoreStr = v.score > 9000 ? `M${10000 - v.score}` : v.score < -9000 ? `-M${10000 - Math.abs(v.score)}` : (v.score / 100 > 0 ? '+' : '') + (v.score / 100).toFixed(2);
                      const scoreColor = v.score > 0 ? 'text-emerald-400' : v.score < 0 ? 'text-red-400' : 'text-white/60';
                      
                      return (
                        <div key={i} className={`flex items-start gap-3 p-2 rounded-lg text-sm font-mono transition-colors ${i === 0 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20' : 'bg-black/20 border border-white/[0.02]'}`}>
                          <span className={`w-12 font-bold shrink-0 ${scoreColor}`}>{scoreStr}</span>
                          <span className="text-white/70 line-clamp-2 leading-relaxed">{v.pv.join(' ')}</span>
                        </div>
                      );
                  })}
                </div>
              </>
            )}

            {engineType === 'cloud' && (
              <div className="flex flex-col gap-3 relative z-10">
                {isThinking ? (
                  <AIThinkingIndicator onCancel={cancelAIRequest} />
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-sm bg-black/20 p-4 rounded-lg border border-white/5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Provider</span>
                      <span className="text-white/90 font-semibold truncate">{provider}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Model</span>
                      <span className="text-white/90 font-semibold truncate">{model.split(' ').slice(0,2).join(' ')}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Response</span>
                      <span className="text-emerald-400 font-mono font-bold">{(currentResponseTime / 1000).toFixed(1)} s</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Average</span>
                      <span className="text-emerald-500 font-mono font-bold">{(averageResponseTime / 1000).toFixed(1)} s</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Current Turn</span>
                      <span className="text-white/90 font-semibold capitalize">{turn === 'w' ? 'White' : 'Black'}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-white/40 uppercase tracking-widest font-bold text-xs">Game State</span>
                      <span className="text-white/90 font-semibold">{game.isCheckmate() ? 'Checkmate' : game.inCheck() ? 'Check' : game.isDraw() ? 'Draw' : 'Active'}</span>
                    </div>
                  </div>
                )}
                
                {connectionState !== 'Connected' && connectionState !== 'Connecting' && connectionState !== 'Cancelled' && (
                  <button 
                    onClick={triggerRetry}
                    className="mt-2 w-full py-2.5 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    Retry Request
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* 4. Move List */}
      <motion.div className="p-4 rounded-xl border border-white/[0.04] bg-[#141414]/90 backdrop-blur-3xl shadow-lg relative flex flex-col flex-1 overflow-hidden min-h-[250px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white/70">Move List</h3>
          <div className="flex items-center gap-1">
            <button onClick={undoMove} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Undo"><ChevronLeft size={16}/></button>
            <button onClick={redoMove} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Redo"><ChevronRight size={16}/></button>
            <button onClick={handleDownloadPGN} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors ml-1" title="Download PGN"><Download size={16}/></button>
          </div>
        </div>

        <div 
          ref={moveListRef}
          className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-0.5"
        >
          {groupedMoves.length === 0 && (
            <div className="text-sm text-white/40 italic flex h-full items-center justify-center">No moves played yet.</div>
          )}
          {groupedMoves.map((turnMoves, idx) => (
            <div key={idx} className={`flex items-center text-sm rounded-md px-2 py-1.5 ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
              <span className="w-10 text-white/30 font-mono text-xs">{idx + 1}.</span>
              <span className="flex-1 font-semibold text-white/80 hover:text-white cursor-pointer px-1">{turnMoves[0].san}</span>
              <span className="flex-1 font-semibold text-white/80 hover:text-white cursor-pointer px-1">{turnMoves[1] ? turnMoves[1].san : ''}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </aside>
  );
}
