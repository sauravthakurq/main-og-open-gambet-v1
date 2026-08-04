import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerColor, TimeControl, OpponentType, AIPlayerConfig } from '@/store/useAppStore';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import AISettingsPanel from '@/components/ui/AISettingsPanel';
import { Zap, Flame, Timer, Landmark, ArrowLeft, Cpu, Sparkles, Triangle, Search, Wind, Box } from 'lucide-react';

interface GameSetupProps {
  opponentType: OpponentType;
  onBack: () => void;
  onStart: (color: PlayerColor, time: TimeControl, aiVsAiConfig?: { white: AIPlayerConfig, black: AIPlayerConfig }) => void;
}

const PROVIDERS = [
  { id: 'OpenAI', name: 'OpenAI', models: [{ id: 'gpt-5', name: 'GPT-5' }, { id: 'gpt-4o', name: 'GPT-4o' }] },
  { id: 'Anthropic', name: 'Anthropic', models: [{ id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }, { id: 'claude-opus-4.1', name: 'Claude Opus 4.1' }] },
  { id: 'Google', name: 'Google', models: [{ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' }, { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' }, { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }] },
  { id: 'xAI', name: 'xAI', models: [{ id: 'grok-3', name: 'Grok 3' }, { id: 'grok-2', name: 'Grok 2' }] },
  { id: 'Groq', name: 'Groq', models: [{ id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' }, { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' }] },
  { id: 'Stockfish', name: 'Stockfish', models: [{ id: 'stockfish-16', name: 'Stockfish 16.1' }] }
];

const TIME_CATEGORIES = [
  { id: 'bullet', label: 'Bullet', icon: Zap },
  { id: 'blitz', label: 'Blitz', icon: Flame },
  { id: 'rapid', label: 'Rapid', icon: Timer },
  { id: 'classical', label: 'Classical', icon: Landmark }
];

const TIME_CONTROLS: Record<string, { label: string, minutes: number, increment: number }[]> = {
  bullet: [
    { label: '1 min', minutes: 1, increment: 0 },
    { label: '1 | 1', minutes: 1, increment: 1 },
    { label: '2 | 1', minutes: 2, increment: 1 }
  ],
  blitz: [
    { label: '3 min', minutes: 3, increment: 0 },
    { label: '3 | 2', minutes: 3, increment: 2 },
    { label: '5 min', minutes: 5, increment: 0 }
  ],
  rapid: [
    { label: '10 min', minutes: 10, increment: 0 },
    { label: '15 | 10', minutes: 15, increment: 10 },
    { label: '30 min', minutes: 30, increment: 0 }
  ],
  classical: [
    { label: '60 min', minutes: 60, increment: 0 },
    { label: '90 | 30', minutes: 90, increment: 30 }
  ]
};

export default function GameSetup({ opponentType, onBack, onStart }: GameSetupProps) {
  const [color, setColor] = useState<PlayerColor>('random');
  const [timeCategory, setTimeCategory] = useState<string>('blitz');
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS['blitz'][1]); // Default 3|2

  const [whiteAI, setWhiteAI] = useState<{ provider: string, model: string, engineType: string }>({ provider: 'OpenAI', model: 'gpt-4o', engineType: 'cloud' });
  const [blackAI, setBlackAI] = useState<{ provider: string, model: string, engineType: string }>({ provider: 'Anthropic', model: 'claude-3.5-sonnet', engineType: 'cloud' });
  
  const [configuringSide, setConfiguringSide] = useState<'w' | 'b' | null>(null);

  const { apiKeys, provider: aiProvider } = useAISettingsStore();

  const isLocalProvider = (p: string) => ['Stockfish', 'Ollama', 'LM Studio', 'Custom'].includes(p);
  const hasValidKey = (p: string) => isLocalProvider(p) || (apiKeys[p]?.filter(k => k.enabled)?.length > 0);

  let isReadyToStart = true;
  let validationMessage = '';

  if (opponentType === 'aivsai') {
    if (!hasValidKey(whiteAI.provider)) {
      isReadyToStart = false;
      validationMessage = `API Key required for ${whiteAI.provider} (White)`;
    } else if (!hasValidKey(blackAI.provider)) {
      isReadyToStart = false;
      validationMessage = `API Key required for ${blackAI.provider} (Black)`;
    }
  } else if (opponentType === 'ai') {
    if (!hasValidKey(aiProvider)) {
      isReadyToStart = false;
      validationMessage = `API Key required for ${aiProvider}`;
    }
  }

  if (configuringSide) {
    const activeConfig = configuringSide === 'w' ? whiteAI : blackAI;
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm text-left">
         <AISettingsPanel 
           overrideProvider={activeConfig.provider}
           overrideModel={activeConfig.model}
           onCancel={() => setConfiguringSide(null)}
           onSaveOverride={(config) => {
             if (configuringSide === 'w') {
               setWhiteAI(config);
             } else {
               setBlackAI(config);
             }
             setConfiguringSide(null);
           }}
         />
      </div>
    );
  }

  return (
    <div className="w-full text-center max-w-[600px] mx-auto min-h-[500px] flex flex-col justify-between overflow-y-auto px-1 sm:px-0 pb-10 sm:pb-0">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[#86868B] hover:text-white transition-all duration-300 backdrop-blur-md"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <h1 className="text-[28px] font-[700] tracking-tight text-[#F5F5F7]">Game Setup</h1>
        <div className="w-10"></div>
      </div>

      <div className="mb-10">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-left pl-1">Play As</h2>
        
        {opponentType === 'aivsai' ? (
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="text-white/80 font-medium mb-1.5 text-xs uppercase tracking-wider pl-1">White AI</h3>
              <button 
                onClick={() => setConfiguringSide('w')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-left shadow-[0_4px_20px_rgba(0,0,0,0.2)] group"
              >
                 <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-105 transition-transform">
                     <img src={`/icons/${whiteAI.provider.toLowerCase().replace(' ', '-')}.svg`} alt={whiteAI.provider} className="w-full h-full opacity-90 object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display='none'; }} />
                 </div>
                 <div className="flex flex-col overflow-hidden">
                     <span className="text-white font-semibold text-[14px] tracking-tight truncate">{whiteAI.provider}</span>
                     <span className="text-[#86868B] text-[12px] truncate">{whiteAI.model}</span>
                 </div>
              </button>
            </div>
            
            <div>
              <h3 className="text-white/80 font-medium mb-1.5 text-xs uppercase tracking-wider pl-1">Black AI</h3>
              <button 
                onClick={() => setConfiguringSide('b')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#111111] to-black border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all text-left shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
              >
                 <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-105 transition-transform">
                     <img src={`/icons/${blackAI.provider.toLowerCase().replace(' ', '-')}.svg`} alt={blackAI.provider} className="w-full h-full opacity-90 object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display='none'; }} />
                 </div>
                 <div className="flex flex-col overflow-hidden">
                     <span className="text-white font-semibold text-[14px] tracking-tight truncate">{blackAI.provider}</span>
                     <span className="text-[#86868B] text-[12px] truncate">{blackAI.model}</span>
                 </div>
              </button>
            </div>
          </div>
        ) : (
          /* Lichess Style Color Picker Row (Fixed Dimensions) */
          <div className="flex w-full h-[90px] rounded-[16px] overflow-hidden border border-white/10 shadow-lg bg-[#2b2a29]">
            
            {/* Black Selection */}
            <button
              onClick={() => setColor('b')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 outline-none ${
                color === 'b' ? 'bg-[#18181b] border-b-4 border-[var(--color-accent)]' : 'hover:bg-[#323130] border-b-4 border-transparent'
              }`}
            >
              <div className="w-[45px] h-[45px] flex items-center justify-center">
                <img src="/bK.svg" alt="Black King" className="w-[40px] h-[40px] drop-shadow-md" draggable={false} />
              </div>
              <span className={`text-[13px] font-[500] ${color === 'b' ? 'text-white' : 'text-[#86868B]'}`}>Black</span>
            </button>
            
            {/* Random Selection */}
            <button
              onClick={() => setColor('random')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 outline-none border-x border-white/5 ${
                color === 'random' ? 'bg-[var(--color-accent)]/20 border-b-4 border-[var(--color-accent)]' : 'hover:bg-[#323130] border-b-4 border-transparent'
              }`}
            >
              <div className="w-[45px] h-[45px] relative flex items-center justify-center drop-shadow-md">
                {/* Split King Illusion using Clip-Path */}
                <img src="/bK.svg" alt="Half Black King" className="absolute inset-0 w-[40px] h-[40px] m-auto" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} draggable={false} />
                <img src="/wK.svg" alt="Half White King" className="absolute inset-0 w-[40px] h-[40px] m-auto" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} draggable={false} />
              </div>
              <span className={`text-[13px] font-[500] ${color === 'random' ? 'text-[var(--color-accent)] drop-shadow-sm' : 'text-[#86868B]'}`}>Random side</span>
            </button>
  
            {/* White Selection */}
            <button
              onClick={() => setColor('w')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 outline-none ${
                color === 'w' ? 'bg-[#f8f8f8] border-b-4 border-[var(--color-accent)]' : 'hover:bg-[#323130] border-b-4 border-transparent'
              }`}
            >
              <div className="w-[45px] h-[45px] flex items-center justify-center">
                <img src="/wK.svg" alt="White King" className="w-[40px] h-[40px] drop-shadow-md" draggable={false} />
              </div>
              <span className={`text-[13px] font-[500] ${color === 'w' ? 'text-[#111]' : 'text-[#86868B]'}`}>White</span>
            </button>
  
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-left pl-1">Time Control</h2>
        
        {/* Categories */}
        <div className="flex sm:gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 overflow-x-auto custom-scrollbar">
          {TIME_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setTimeCategory(cat.id);
                setTimeControl(TIME_CONTROLS[cat.id][0]); // Select first option of new category
              }}
              className={`flex-1 min-w-[80px] sm:min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-[12px] text-[12px] sm:text-[14px] font-[600] transition-all duration-300 ${
                timeCategory === cat.id ? 'bg-[var(--color-accent)] text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <cat.icon size={16} strokeWidth={2.5} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeCategory}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)', position: 'absolute' }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full"
          >
            {TIME_CONTROLS[timeCategory].map((tc, idx) => (
              <button
                key={idx}
                onClick={() => setTimeControl(tc)}
                className={`p-4 rounded-[12px] border transition-all duration-200 min-h-[85px] outline-none ${
                  timeControl?.label === tc.label ? 'bg-[var(--color-accent)]/[0.08] border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_4px_16px_rgba(184,164,142,0.15)]' : 'bg-[#2b2a29] border-transparent text-[#86868B] hover:bg-[#323130] hover:text-white'
                }`}
              >
                <div className="text-[18px] font-[700] tracking-tight mb-0.5">{tc.label}</div>
                <div className={`text-[12px] font-[600] ${timeControl?.label === tc.label ? 'text-[var(--color-accent)]/80' : 'text-slate-500'}`}>{tc.minutes}m {tc.increment > 0 ? `+ ${tc.increment}s` : ''}</div>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          if (!isReadyToStart) return;
          if (opponentType === 'aivsai') {
            onStart('w', timeControl, {
              white: { provider: whiteAI.provider, model: whiteAI.model, engineType: whiteAI.provider === 'Stockfish' ? 'local' : 'cloud' },
              black: { provider: blackAI.provider, model: blackAI.model, engineType: blackAI.provider === 'Stockfish' ? 'local' : 'cloud' }
            });
          } else {
            onStart(color, timeControl);
          }
        }}
        disabled={!isReadyToStart}
        title={validationMessage}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(184,164,142,0.3)] ${
          isReadyToStart 
            ? 'bg-[var(--color-accent)] text-black hover:brightness-110 cursor-pointer' 
            : 'bg-white/10 text-white/40 cursor-not-allowed shadow-none'
        }`}
      >
        {isReadyToStart ? 'Start Game' : validationMessage}
      </button>
    </div>
  );
}
