import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { useAcademyStore } from '@/store/useAcademyStore';
import { ACADEMY_CATEGORIES } from '@/lib/academy/data';
import { AcademyBoard } from './AcademyBoard';

export const AcademyLessonView = () => {
  const { activeStageId, activeLevelId, startStage, quitStage, progress } = useAcademyStore();

  // Find current stage and level
  const stage = useMemo(() => {
    for (const cat of ACADEMY_CATEGORIES) {
      const found = cat.stages.find(s => s.id === activeStageId);
      if (found) return found;
    }
    return null;
  }, [activeStageId]);

  if (!stage || !activeLevelId) return null;

  const level = stage.levels[activeLevelId - 1];
  const isLastLevel = activeLevelId === stage.levels.length;

  const currentScores = progress[stage.id] || [];
  const currentScore = currentScores[activeLevelId - 1] || 0;
  const isCompleted = currentScore > 0;

  const handleNext = () => {
    if (isLastLevel) {
      quitStage();
    } else {
      startStage(stage.id, activeLevelId + 1);
    }
  };

  const handlePrev = () => {
    if (activeLevelId > 1) {
      startStage(stage.id, activeLevelId - 1);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0a0c] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-20">
         <div className="flex items-center gap-4">
            <button 
              onClick={quitStage}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
               <h2 className="text-white font-bold text-lg leading-tight">{stage.title}</h2>
               <p className="text-white/40 text-xs">{stage.subtitle}</p>
            </div>
         </div>

         {/* Level Dots Navigation */}
         <div className="hidden sm:flex items-center gap-2">
            {stage.levels.map((lvl, idx) => {
              const num = idx + 1;
              const isActive = num === activeLevelId;
              const score = currentScores[idx] || 0;
              const completed = score > 0;

              return (
                <button 
                  key={num}
                  onClick={() => startStage(stage.id, num)}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[var(--color-accent)] text-black shadow-[0_0_15px_rgba(227,193,149,0.3)] scale-110' 
                      : completed 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/30 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              );
            })}
         </div>

         <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                // We'll trigger a reload of the board by slightly modifying key or using a store ref
                // For now, re-triggering startStage works if we reset a state inside board
                startStage(stage.id, activeLevelId);
              }}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              title="Restart Level"
            >
              <RefreshCw size={18} />
            </button>
         </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
         
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)] opacity-[0.02] blur-[150px] pointer-events-none rounded-full"></div>

         {/* Left/Top: Chess Board */}
         <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-[650px] aspect-square relative shadow-2xl rounded-xl">
               <AcademyBoard level={level} stageId={stage.id} />
            </div>
         </div>

         {/* Right/Bottom: Context Panel */}
         <div className="w-full lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20 backdrop-blur-xl flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
               
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">Level {activeLevelId}</h3>
               
               <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner mb-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)]"></div>
                  <p className="text-white/90 text-lg font-medium leading-relaxed">
                    {level.goal}
                  </p>
               </div>

               <div className="flex-1"></div>

               {/* Success Panel Overlay (renders when level is completed successfully in current session) */}
               <AnimatePresence>
                 {isCompleted && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(34,197,94,0.1)] relative overflow-hidden"
                   >
                     <div className="absolute -top-10 -right-10 text-green-500/10 rotate-12 pointer-events-none">
                       <Star size={120} className="fill-current" />
                     </div>
                     <h4 className="text-xl font-bold text-green-400 mb-2 relative z-10">Excellent!</h4>
                     <p className="text-green-400/60 text-sm mb-6 relative z-10">You completed the task perfectly.</p>
                     
                     <div className="flex justify-center gap-2 mb-6 relative z-10">
                        {[1, 2, 3].map((starIdx) => (
                           <motion.div 
                             key={starIdx}
                             initial={{ scale: 0, rotate: -180 }}
                             animate={{ scale: 1, rotate: 0 }}
                             transition={{ type: "spring", delay: starIdx * 0.1 }}
                           >
                              <Star size={32} className={starIdx <= currentScore ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-white/10"} />
                           </motion.div>
                        ))}
                     </div>

                     <button 
                       onClick={handleNext}
                       className="w-full py-4 rounded-xl bg-green-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-colors shadow-lg relative z-10"
                     >
                       {isLastLevel ? 'Finish Stage' : 'Next Level'} <ArrowRight size={18} />
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>

            </div>
         </div>
      </div>
    </div>
  );
};
