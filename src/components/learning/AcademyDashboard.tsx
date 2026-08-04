import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, CheckCircle2, PlayCircle, Star, BookOpen } from 'lucide-react';
import { ACADEMY_CATEGORIES } from '@/lib/academy/data';
import { useAcademyStore } from '@/store/useAcademyStore';
import { AcademyStage } from '@/lib/academy/types';

export const AcademyDashboard = () => {
  const { progress, unlockedStages, startStage } = useAcademyStore();

  const getStageScore = (stageId: string, totalLevels: number) => {
    const scores = progress[stageId] || [];
    const earned = scores.reduce((a, b) => a + b, 0);
    const max = totalLevels * 3;
    return { earned, max, completed: scores.length === totalLevels && scores.every(s => s > 0) };
  };

  return (
    <div className="p-4 sm:p-8 space-y-12 pb-24">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-black/60 to-black/20 border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
           <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
             Master Chess, <br/>
             <span className="text-[var(--color-accent)] drop-shadow-[0_0_15px_rgba(227,193,149,0.3)]">One Step at a Time.</span>
           </h1>
           <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed drop-shadow-sm">
             From basic piece movements to advanced tactical motifs. Complete interactive challenges to earn stars and unlock new mastery levels.
           </p>
           <div className="flex flex-wrap items-center gap-4">
             <button 
               onClick={() => startStage('rook', 1)}
               className="px-8 py-4 rounded-xl bg-[var(--color-accent)] text-black font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(227,193,149,0.3)] hover:scale-105 active:scale-95"
             >
               <PlayCircle size={20} />
               Start Learning
             </button>
             <button 
               onClick={() => useAcademyStore.getState().openDocs()}
               className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20 shadow-lg hover:scale-105 active:scale-95 backdrop-blur-md"
             >
               <BookOpen size={20} />
               Read The Docs
             </button>
           </div>
        </div>
      </div>

      {/* Categories */}
      {ACADEMY_CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-6">
          <div className="flex items-center gap-3">
             <h3 className="text-2xl font-bold text-white tracking-tight">{category.name}</h3>
             <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.stages.map((stage: AcademyStage) => {
               // Unlock all stages by default as requested
               const isUnlocked = true; // unlockedStages.includes(stage.id);
               const { earned, max, completed } = getStageScore(stage.id, stage.levels.length);

               return (
                 <button
                   key={stage.id}
                   disabled={!isUnlocked}
                   onClick={() => startStage(stage.id, 1)}
                   className={`relative group text-left rounded-2xl p-5 border transition-all overflow-hidden ${
                     isUnlocked 
                       ? 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20 shadow-lg' 
                       : 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'
                   }`}
                 >
                    {/* Background glow on hover */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${
                         completed 
                           ? 'bg-green-500/20 border-green-500/30 text-green-400'
                           : isUnlocked 
                             ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20 text-[var(--color-accent)]'
                             : 'bg-white/5 border-white/10 text-white/30'
                       }`}>
                          {completed ? <CheckCircle2 size={24} /> : !isUnlocked ? <Lock size={24} /> : <PlayCircle size={24} />}
                       </div>
                       
                       {isUnlocked && (
                         <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/5 shadow-inner">
                           <Star size={12} className={earned > 0 ? "fill-yellow-400 text-yellow-400" : "text-white/20"} />
                           <span className="text-xs font-bold text-white/70">{earned}/{max}</span>
                         </div>
                       )}
                    </div>

                    <div className="relative z-10">
                       <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-accent)] transition-colors">{stage.title}</h4>
                       <p className="text-sm text-white/40 line-clamp-2">{stage.subtitle}</p>
                    </div>

                    {isUnlocked && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/30 group-hover:text-white/70 transition-colors">
                        <span>{stage.levels.length} Levels</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                 </button>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
