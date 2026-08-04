import React from 'react';
import { LineChart, Activity, TrendingUp, TrendingDown, Target, Clock, Zap } from 'lucide-react';

export const AIProgress = () => {
  return (
    <div className="w-full h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-150 overflow-y-auto custom-scrollbar">
       <div className="max-w-5xl mx-auto">
         
         <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#b58863] flex items-center justify-center shadow-[0_0_20px_rgba(227,193,149,0.3)]">
               <LineChart className="text-black" size={24} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white tracking-tight">Weekly Progress</h2>
               <p className="text-white/50">Tracking your last 50 games</p>
            </div>
         </div>

         {/* Big Chart Placeholder */}
         <div className="w-full h-72 bg-black/40 border border-white/10 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,193,149,0.05),transparent_70%)]"></div>
             <p className="text-white/30 text-sm font-medium z-10">Rating Trend Chart (1400 → 1450)</p>
             {/* Mock chart lines */}
             <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <path d="M0,200 Q100,180 200,150 T400,120 T600,80 T800,100 T1000,50" fill="none" stroke="var(--color-accent)" strokeWidth="3" className="opacity-50" />
                 <path d="M0,200 Q100,180 200,150 T400,120 T600,80 T800,100 T1000,50 L1000,300 L0,300 Z" fill="url(#gradient)" className="opacity-20" />
                 <defs>
                   <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.5" />
                     <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                   </linearGradient>
                 </defs>
             </svg>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
               <div className="flex items-center gap-2 text-white/50 mb-3">
                  <Target size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Avg Accuracy</span>
               </div>
               <div className="text-3xl font-black text-white">82.5%</div>
               <p className="text-green-400 text-xs mt-2 font-medium flex items-center gap-1"><TrendingUp size={12}/> +4.2%</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
               <div className="flex items-center gap-2 text-white/50 mb-3">
                  <Activity size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Blunders / Game</span>
               </div>
               <div className="text-3xl font-black text-white">1.2</div>
               <p className="text-green-400 text-xs mt-2 font-medium flex items-center gap-1"><TrendingDown size={12}/> -0.5</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
               <div className="flex items-center gap-2 text-white/50 mb-3">
                  <Clock size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Time / Move</span>
               </div>
               <div className="text-3xl font-black text-white">4.5s</div>
               <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1"><TrendingDown size={12}/> -1.2s</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
               <div className="flex items-center gap-2 text-white/50 mb-3">
                  <Zap size={16} /> <span className="text-sm font-medium uppercase tracking-wider">Tactics Found</span>
               </div>
               <div className="text-3xl font-black text-white">68%</div>
               <p className="text-green-400 text-xs mt-2 font-medium flex items-center gap-1"><TrendingUp size={12}/> +12%</p>
            </div>
         </div>

         {/* Phase insights */}
         <h3 className="text-xl font-bold text-white mb-4">Phase Performance</h3>
         <div className="space-y-4">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
               <div className="font-semibold text-white/90">Openings</div>
               <div className="w-1/2 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-accent)] h-full w-[85%] rounded-full"></div>
               </div>
               <div className="text-white/50 text-sm font-mono">85%</div>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
               <div className="font-semibold text-white/90">Middlegame</div>
               <div className="w-1/2 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-accent)] h-full w-[70%] rounded-full"></div>
               </div>
               <div className="text-white/50 text-sm font-mono">70%</div>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
               <div className="font-semibold text-white/90">Endgame</div>
               <div className="w-1/2 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-accent)] h-full w-[45%] rounded-full"></div>
               </div>
               <div className="text-white/50 text-sm font-mono">45%</div>
            </div>
         </div>

       </div>
    </div>
  );
};
