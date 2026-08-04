'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, BrainCircuit, LineChart, LayoutDashboard, Settings, Plus, Mic, Send } from 'lucide-react';
import { useGambitAIStore } from '@/store/useGambitAIStore';
import { Orb } from '../../../orb'; // Import Orb from the root orb folder
import { AIChat } from './AIChat';
import { AICoach } from './AICoach';
import { AIProgress } from './AIProgress';
import { AILearning } from './AILearning';

type AITabId = 'home' | 'coach' | 'chat' | 'learning' | 'progress';

export const GambitAIWorkspace = () => {
  const { isWorkspaceOpen, setWorkspaceOpen, orbState, setOrbState, personality, setPersonality, voiceCoachEnabled, setVoiceCoachEnabled } = useGambitAIStore();
  const [activeTab, setActiveTab] = useState<AITabId>('home');
  const [showSettings, setShowSettings] = useState(false);

  const TABS = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'coach', label: 'AI Coach', icon: BrainCircuit },
    { id: 'chat', label: 'Ask Gambit', icon: MessageSquare },
    { id: 'learning', label: 'Learning & Practice', icon: Sparkles },
    { id: 'progress', label: 'Progress', icon: LineChart },
  ] as const;

  return (
    <AnimatePresence>
      {isWorkspaceOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setWorkspaceOpen(false)}
          />

          {/* Workspace Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            className="relative w-full max-w-[1400px] h-[90vh] max-h-[900px] m-auto bg-[#0a0a0c]/95 border border-[var(--color-accent)]/20 rounded-[2rem] shadow-[0_0_100px_-20px_var(--color-accent)] overflow-hidden flex flex-col md:flex-row backdrop-blur-3xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setWorkspaceOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Sidebar */}
            <div className="w-full md:w-72 bg-black/40 border-r border-white/5 flex flex-col shrink-0 p-4 pt-16 md:pt-8 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-8 px-2">
                 <div className="w-10 h-10 flex items-center justify-center relative overflow-hidden shrink-0">
                    <Orb 
                      theme="cloud" 
                      size={44} 
                      state={orbState === 'idle' ? 'thinking' : orbState} 
                      className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                 </div>
                 <div>
                   <h2 className="text-white font-black text-lg tracking-tight leading-tight">Gambit AI</h2>
                   <p className="text-[var(--color-accent)]/80 text-[10px] font-bold tracking-[0.2em] uppercase">Intelligence</p>
                 </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AITabId)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-semibold ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent border-l-2 border-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/5'
                        : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--color-accent)]' : ''} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Personality Settings quick access */}
              <div className="mt-auto pt-8">
                 <button onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5">
                    <Settings size={18} className={showSettings ? 'text-[var(--color-accent)] animate-spin-slow' : ''} />
                    AI Settings
                 </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,rgba(227,193,149,0.08),transparent_50%)]">
               
               {/* Settings Overlay */}
               <AnimatePresence>
                 {showSettings && (
                   <motion.div 
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="absolute top-4 right-4 z-50 bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl w-80"
                   >
                      <h3 className="text-lg font-bold text-white mb-4">AI Preferences</h3>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-white/60 mb-2">Coach Personality</label>
                        <select 
                          value={personality}
                          onChange={(e) => setPersonality(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-accent)]"
                        >
                          <option value="Friendly">Friendly Coach</option>
                          <option value="Strict">Strict Coach</option>
                          <option value="Grandmaster">Grandmaster Coach</option>
                          <option value="Beginner">Beginner Coach</option>
                        </select>
                      </div>

                      <div>
                         <label className="flex items-center gap-3 cursor-pointer">
                           <div className="relative">
                             <input type="checkbox" className="sr-only" checked={voiceCoachEnabled} onChange={(e) => setVoiceCoachEnabled(e.target.checked)} />
                             <div className={`w-10 h-6 rounded-full transition-colors ${voiceCoachEnabled ? 'bg-[var(--color-accent)]' : 'bg-white/10'}`}></div>
                             <div className={`absolute w-4 h-4 rounded-full bg-black top-1 transition-transform ${voiceCoachEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                           </div>
                           <span className="text-sm font-medium text-white">Enable Voice Coach</span>
                         </label>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Home Tab */}
               {activeTab === 'home' && (
                 <div className="w-full h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                    
                    {/* Centered Orb and Greeting */}
                    <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                       <div className="w-[300px] h-[300px] mb-8 relative">
                          <Orb 
                            theme="cloud" 
                            size={300} 
                            state={orbState === 'idle' ? 'thinking' : orbState} 
                            className="absolute inset-0"
                          />
                       </div>
                       
                       <h1 className="text-3xl font-black text-white tracking-tight mb-3 text-center">
                         Good evening. I'm <span className="text-[var(--color-accent)]">Gambit</span>.
                       </h1>
                       
                       <p className="text-white/50 text-[15px] mb-10 text-center max-w-lg leading-relaxed">
                         {personality === 'Friendly' && "I've been analyzing your recent games. You're developing a strong sense for tactical combinations, but we should look at your endgame conversions."}
                         {personality === 'Strict' && "Your endgame technique is severely lacking. We need to focus immediately on basic pawn structures."}
                         {personality === 'Grandmaster' && "I see you play the Italian. Very solid, but you missed a crucial intermediate move on move 14 yesterday."}
                         {personality === 'Beginner' && "Chess is hard! Let's practice some basics today. You did great finding that fork!"}
                       </p>

                       {/* Compact Action Chips */}
                       <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl">
                          <button onClick={() => setActiveTab('coach')} className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-white/10 transition-all flex items-center gap-2 group">
                             <BrainCircuit size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                             <span className="text-white/80 text-sm font-semibold group-hover:text-white">Analyze Last Game</span>
                          </button>
                          <button onClick={() => setActiveTab('chat')} className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-white/10 transition-all flex items-center gap-2 group">
                             <MessageSquare size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                             <span className="text-white/80 text-sm font-semibold group-hover:text-white">Ask Gambit</span>
                          </button>
                          <button onClick={() => setActiveTab('learning')} className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-white/10 transition-all flex items-center gap-2 group">
                             <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                             <span className="text-white/80 text-sm font-semibold group-hover:text-white">Practice Mode</span>
                          </button>
                          <button onClick={() => setActiveTab('progress')} className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-white/10 transition-all flex items-center gap-2 group">
                             <LineChart size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                             <span className="text-white/80 text-sm font-semibold group-hover:text-white">Weekly Progress</span>
                          </button>
                       </div>
                    </div>

                    {/* Bottom Premium Chat Bar */}
                    <div className="w-full max-w-3xl mx-auto mt-auto">
                       <div className="relative group">
                          {/* Glow behind input */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)]/20 via-white/10 to-[var(--color-accent)]/20 rounded-[28px] blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                          
                          <div className="relative bg-[#1a1a1c] border border-white/10 rounded-[24px] flex items-center p-2 shadow-2xl backdrop-blur-2xl">
                             <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                                <Plus size={20} />
                             </button>
                             
                             <input 
                               type="text" 
                               placeholder="Message Gambit..."
                               className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-white/30 text-[15px]"
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                   setActiveTab('chat');
                                 }
                               }}
                             />
                             
                             <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => {
                                    setOrbState(orbState === 'listening' ? 'idle' : 'listening');
                                  }}
                                  className={`p-3 rounded-full transition-all flex items-center justify-center relative ${orbState === 'listening' ? 'bg-[var(--color-accent)] text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                >
                                   {orbState === 'listening' && (
                                     <span className="absolute inset-0 rounded-full border border-[var(--color-accent)] animate-ping"></span>
                                   )}
                                   <Mic size={20} />
                                </button>
                                <button className="p-3 bg-[var(--color-accent)] hover:bg-[#b58863] text-black rounded-full transition-colors ml-1 flex items-center justify-center shadow-[0_0_15px_rgba(227,193,149,0.3)]">
                                   <Send size={18} className="-ml-0.5" />
                                </button>
                             </div>
                          </div>
                       </div>
                       <p className="text-center text-[11px] text-white/30 mt-4">Gambit AI can make mistakes. Verify critical lines with the engine.</p>
                    </div>
                 </div>
               )}

               {activeTab === 'coach' && <AICoach />}
               {activeTab === 'chat' && <AIChat />}
               {activeTab === 'progress' && <AIProgress />}
               {activeTab === 'learning' && <AILearning />}
               
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
