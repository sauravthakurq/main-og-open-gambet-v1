import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const LearningHero = () => {
  return (
    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-r from-black/80 to-transparent border border-white/10 group cursor-pointer">
       {/* Background Image/Video Placeholder */}
       <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent"></div>
       </div>

       <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 h-full min-h-[340px]">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full text-xs font-bold uppercase tracking-wider">Daily Lesson</span>
                <span className="flex items-center gap-1 text-white/60 text-xs font-semibold"><Clock size={12}/> 15 mins</span>
             </div>
             
             <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Mastering the Sicilian Defense
             </h3>
             
             <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Dive deep into one of the most aggressive and complex responses to 1.e4. Learn key ideas, tactical motifs, and common traps.
             </p>
             
             <button className="px-8 py-4 bg-[var(--color-accent)] hover:bg-[#b58863] text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(227,193,149,0.3)] hover:shadow-[0_0_30px_rgba(227,193,149,0.5)] flex items-center gap-2 group-hover:scale-105">
                <PlayCircle size={20} fill="currentColor" /> Start Lesson
             </button>
          </div>
       </div>
    </div>
  );
};
