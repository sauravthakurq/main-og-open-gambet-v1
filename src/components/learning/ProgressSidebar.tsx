import React from 'react';
import { Flame, Star, Award, Shield, Target, BookOpen, Clock, ChevronRight } from 'lucide-react';

export const ProgressSidebar = () => {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
       
       <div className="text-center pt-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[#E3C195] p-1 shadow-[0_0_20px_rgba(227,193,149,0.2)] mb-4 relative">
             <div className="w-full h-full bg-[#1c1c1e] rounded-full flex items-center justify-center border-2 border-black overflow-hidden">
                <img src="/wK.svg" alt="Avatar" className="w-10 h-10 invert opacity-80" />
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-[#1c1c1e] flex items-center justify-center">
                <Shield size={14} className="text-white" />
             </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Grandmaster Path</h3>
          <p className="text-[var(--color-accent)] text-sm font-semibold">Level 14</p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
             <Flame size={24} className="text-orange-400" />
             <span className="text-xl font-black text-white">12</span>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Day Streak</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
             <Star size={24} className="text-[var(--color-accent)]" />
             <span className="text-xl font-black text-white">4.2k</span>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total XP</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
             <Target size={24} className="text-green-400" />
             <span className="text-xl font-black text-white">84%</span>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Accuracy</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
             <BookOpen size={24} className="text-purple-400" />
             <span className="text-xl font-black text-white">28</span>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Lessons</span>
          </div>
       </div>

       {/* Next Milestone */}
       <div>
          <div className="flex items-center justify-between mb-2">
             <h4 className="font-bold text-white">Next Milestone</h4>
             <span className="text-xs text-white/50">250 XP left</span>
          </div>
          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                <Award size={24} className="text-purple-400" />
             </div>
             <div className="flex-1">
                <h5 className="text-sm font-bold text-white mb-2">Tactics Expert</h5>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-purple-500 h-full w-[75%] rounded-full"></div>
                </div>
             </div>
          </div>
       </div>

       {/* Recently Viewed */}
       <div>
          <h4 className="font-bold text-white mb-4">Jump Back In</h4>
          <div className="space-y-3">
             {[
               { title: 'Queen\'s Gambit Declined', type: 'Opening', time: '5m' },
               { title: 'Smothered Mate', type: 'Tactics', time: '2m' }
             ].map((item, i) => (
                <button key={i} className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center gap-3 transition-colors text-left group">
                   <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-white/40 group-hover:text-white transition-colors" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <h5 className="text-sm font-bold text-white truncate">{item.title}</h5>
                      <span className="text-xs text-white/50">{item.type}</span>
                   </div>
                   <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
                </button>
             ))}
          </div>
       </div>

    </div>
  );
};
