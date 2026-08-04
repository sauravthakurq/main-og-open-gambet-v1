import React from 'react';
import { Shield, Crosshair, Target, Award, ChevronRight } from 'lucide-react';

export const LearningPaths = () => {
  const paths = [
    { id: 'beginner', title: 'New to Chess', desc: 'Rules & Basics', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    { id: 'intermediate', title: 'Beginner', desc: 'Opening Principles', icon: Crosshair, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    { id: 'advanced', title: 'Intermediate', desc: 'Tactics & Strategy', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
    { id: 'master', title: 'Advanced', desc: 'Masterful Endgames', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  ];

  return (
    <div className="mb-12">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">Structured Paths</h3>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path, idx) => (
             <button key={path.id} className="relative group text-left bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-hidden transition-all hover:bg-white/5 hover:border-white/20 hover:-translate-y-1">
                {/* Number Watermark */}
                <span className="absolute -right-4 -bottom-4 text-[100px] font-black text-white/[0.02] pointer-events-none select-none group-hover:text-white/[0.04] transition-colors">
                  {idx + 1}
                </span>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${path.bg} ${path.border} border`}>
                   <path.icon size={24} className={path.color} />
                </div>
                
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-accent)] transition-colors">{path.title}</h4>
                <p className="text-sm text-white/50 mb-6">{path.desc}</p>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                   Start Path <ChevronRight size={14} />
                </div>
             </button>
          ))}
       </div>
    </div>
  );
};
