import React from 'react';
import { BookOpen, Play, Target, Shield, Crosshair, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const AILearning = () => {
  return (
    <div className="w-full h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">
       <div className="max-w-5xl mx-auto">
         
         <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#b58863] flex items-center justify-center shadow-[0_0_20px_rgba(227,193,149,0.3)]">
               <BookOpen className="text-black" size={24} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white tracking-tight">Learning & Practice</h2>
               <p className="text-white/50">Custom exercises based on your games</p>
            </div>
         </div>

         {/* Habit Insights */}
         <h3 className="text-xl font-bold text-white mb-4">Habit Insights</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Shield size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-white mb-1">King Safety Needs Improvement</h4>
                  <p className="text-white/60 text-sm">You often push pawns in front of your castled king prematurely, weakening your defense.</p>
               </div>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <Crosshair size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-white mb-1">Excellent Tactics</h4>
                  <p className="text-white/60 text-sm">You found 85% of tactical opportunities in your last 10 games, excelling at discovered attacks.</p>
               </div>
            </div>
         </div>

         {/* Practice Puzzles */}
         <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-white">Custom Practice</h3>
             <span className="px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full text-xs font-bold uppercase tracking-wider">Generated Today</span>
         </div>
         <p className="text-white/50 text-sm mb-6 max-w-2xl">
            Gambit AI has generated 5 specific puzzles based on mistakes you made in the past week involving pins and skewers.
         </p>
         
         <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between backdrop-blur-xl relative overflow-hidden group mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-accent)]/5 group-hover:to-[var(--color-accent)]/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-[0_0_30px_rgba(227,193,149,0.4)] shrink-0">
                  <Target className="text-black" size={32} />
               </div>
               <div className="text-center md:text-left">
                  <h4 className="text-2xl font-bold text-white mb-1">Mastering Pins & Skewers</h4>
                  <p className="text-[var(--color-accent)] font-medium">5 tailored puzzles • 1200 - 1500 Elo difficulty</p>
               </div>
            </div>

            <button className="relative z-10 mt-6 md:mt-0 px-8 py-4 bg-[var(--color-accent)] hover:bg-[#b58863] text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(227,193,149,0.3)] hover:shadow-[0_0_30px_rgba(227,193,149,0.5)] flex items-center gap-2 hover:scale-105">
               <Play size={20} fill="currentColor" /> Practice Now
            </button>
         </div>

         {/* Recommended Lessons */}
         <h3 className="text-xl font-bold text-white mb-4">Recommended Lessons</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Defending the Italian', 'Endgame Basics: Rook & Pawn', 'Evaluating Piece Activity'].map((title, i) => (
              <button key={i} className="bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/10 group flex flex-col justify-between min-h-[140px]">
                 <BookOpen className="text-white/40 group-hover:text-[var(--color-accent)] transition-colors" size={24} />
                 <div>
                    <h4 className="text-white font-bold mb-1">{title}</h4>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-1 group-hover:text-white/80">Start Lesson <ChevronRight size={12}/></span>
                 </div>
              </button>
            ))}
         </div>

       </div>
    </div>
  );
};
