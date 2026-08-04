import React from 'react';
import { BrainCircuit, Target, Trophy, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const AICoach = () => {
  return (
    <div className="w-full h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="max-w-5xl mx-auto">
         
         <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#b58863] flex items-center justify-center shadow-[0_0_20px_rgba(227,193,149,0.3)]">
               <BrainCircuit className="text-black" size={24} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white tracking-tight">Post-Game Analysis</h2>
               <p className="text-white/50">vs chessmaster99 • 10 min Rapid • Won by Checkmate</p>
            </div>
         </div>

         {/* Performance Overview */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-accent)]/20 transition-all"></div>
               <Target className="text-[var(--color-accent)] mb-4" size={28} />
               <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-1">Accuracy</h3>
               <div className="text-4xl font-black text-white">87.4<span className="text-xl text-white/40">%</span></div>
               <p className="text-green-400 text-sm mt-2 font-medium flex items-center gap-1"><TrendingUp size={14}/> +2.1% from average</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-accent)]/20 transition-all"></div>
               <Trophy className="text-[var(--color-accent)] mb-4" size={28} />
               <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-1">Est. Strength</h3>
               <div className="text-4xl font-black text-white">1450 <span className="text-xl text-white/40">Elo</span></div>
               <p className="text-white/50 text-sm mt-2 font-medium">Played like a strong club player</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-accent)]/20 transition-all"></div>
               <BrainCircuit className="text-[var(--color-accent)] mb-4" size={28} />
               <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-1">Style Match</h3>
               <div className="text-4xl font-black text-white">Tactical</div>
               <p className="text-white/50 text-sm mt-2 font-medium">Aggressive center control</p>
            </div>
         </div>

         {/* Game Summary */}
         <div className="bg-black/40 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-4">Game Summary</h3>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-4xl">
               You played a very solid Italian Game. In the opening, you quickly controlled the center and castled to safety. 
               The middlegame got complicated after move 14 when your opponent launched a kingside attack, but you defended perfectly 
               and found a brilliant counter-attack exploiting their pinned knight. Your endgame conversion was flawless.
            </p>
         </div>

         {/* Mistakes Explained */}
         <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
           <AlertTriangle className="text-yellow-500" /> Mistakes Explained
         </h3>
         
         <div className="space-y-6">
            <div className="bg-white/5 border border-red-500/20 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row gap-8 items-center">
               <div className="w-full md:w-64 h-64 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-white/30 text-sm font-medium">Board Snapshot</span>
               </div>
               <div className="flex-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">Blunder</div>
                  <h4 className="text-xl font-bold text-white mb-2">Move 12: Bg5 was too slow.</h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                     You tried to pin the knight, but this allowed your opponent to play h6 and immediately kick your bishop away, losing a valuable tempo. The engine evaluation swung by -1.8.
                  </p>
                  
                  <div className="bg-black/40 rounded-2xl p-5 border border-white/5">
                     <h5 className="text-[var(--color-accent)] font-bold text-sm mb-2">Best Move: d4!</h5>
                     <p className="text-white/70 text-sm">
                        Striking in the center immediately was required. It challenges black's setup and forces a decision before they can organize an attack.
                     </p>
                  </div>
               </div>
            </div>
         </div>

       </div>
    </div>
  );
};
