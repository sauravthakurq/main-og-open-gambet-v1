import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Difficulty } from '@/store/useAppStore';

interface ComputerConfigProps {
  onBack: () => void;
  onNext: (difficulty: Difficulty) => void;
}

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', elo: '~800', desc: 'Makes frequent mistakes. Best for beginners.' },
  { id: 'intermediate', label: 'Intermediate', elo: '~1500', desc: 'Solid play with occasional blunders.' },
  { id: 'hard', label: 'Hard', elo: '~2200', desc: 'Very strong play. Rarely makes mistakes.' },
  { id: 'master', label: 'Master', elo: '~2800', desc: 'Grandmaster level precision.' },
  { id: 'max', label: 'Maximum Strength', elo: '3600+', desc: 'Stockfish at full depth. Unbeatable.' }
] as const;

export default function ComputerConfig({ onBack, onNext }: ComputerConfigProps) {
  const [selected, setSelected] = React.useState<Difficulty>('intermediate');

  return (
    <div className="w-full text-center max-w-[600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[#86868B] hover:text-white transition-all duration-150 backdrop-blur-md"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <h1 className="text-[28px] font-[700] tracking-tight text-[#F5F5F7]">Select Difficulty</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {DIFFICULTIES.map((diff) => {
          const isSelected = selected === diff.id;
          return (
            <motion.button
              key={diff.id}
              onClick={() => setSelected(diff.id as Difficulty)}
              className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all duration-150 text-left group ${
                isSelected 
                  ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.05] shadow-[0_4px_24px_rgba(184,164,142,0.15)]' 
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent opacity-50 pointer-events-none"></div>
              )}
              
              <div className="flex flex-col relative z-10">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[17px] font-[600] tracking-tight ${isSelected ? 'text-[var(--color-accent)]' : 'text-[#F5F5F7] group-hover:text-white'}`}>
                    {diff.label}
                  </span>
                  <span className="text-[12px] font-mono font-[600] px-2.5 py-1 rounded-md bg-[#1d1d1f]/80 text-white border border-white/10 shadow-sm backdrop-blur-md">
                    {diff.elo}
                  </span>
                </div>
                <span className={`text-[14px] font-[500] ${isSelected ? 'text-white/80' : 'text-[#86868B] group-hover:text-[#A1A1AA]'} transition-colors leading-[1.4]`}>
                  {diff.desc}
                </span>
              </div>

              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors relative z-10 ${
                isSelected ? 'border-[var(--color-accent)]' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(184,164,142,0.6)]"></div>}
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => onNext(selected)}
        className="w-full py-4 rounded-xl bg-[var(--color-accent)] text-black font-semibold text-[17px] hover:brightness-110 transition-all shadow-[0_0_24px_rgba(184,164,142,0.2)]"
      >
        Continue
      </button>
    </div>
  );
}
