import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

interface ThemeCardProps {
  id: string;
  name: string;
  type: 'board' | 'piece';
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export const ThemeCard = ({
  id,
  name,
  type,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: ThemeCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-150 ${
        isSelected
          ? 'border-[var(--color-accent)] shadow-[0_0_30px_rgba(227,193,149,0.2)]'
          : 'border-white/5 hover:border-white/20 hover:shadow-xl bg-[#1c1c1e]'
      }`}
      onClick={onSelect}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorite 
            ? 'bg-yellow-500/20 text-yellow-400' 
            : 'bg-black/40 text-white/40 hover:bg-black/60 hover:text-white'
        }`}
      >
        <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {/* Preview Area */}
      <div className="relative w-full aspect-square overflow-hidden bg-black/20 flex items-center justify-center">
        {type === 'board' ? (
          id === 'default' ? (
            <div className="w-full h-full bg-[#b58863] flex flex-col">
              <div className="w-full h-1/2 flex">
                <div className="w-1/2 h-full bg-[#f0d9b5]"></div>
                <div className="w-1/2 h-full bg-[#b58863]"></div>
              </div>
              <div className="w-full h-1/2 flex">
                <div className="w-1/2 h-full bg-[#b58863]"></div>
                <div className="w-1/2 h-full bg-[#f0d9b5]"></div>
              </div>
            </div>
          ) : (
            <img
              src={`/assets/boards/${id}.png`}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          )
        ) : (
          id === 'default' ? (
            <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-[#2c2b29]">
               <span className="text-white/50 text-xs font-bold uppercase tracking-widest text-center">Standard<br/>Pieces</span>
            </div>
          ) : (
          <div className="w-full h-full p-4 grid grid-cols-3 gap-2 bg-[#2c2b29]">
            {['wk', 'wq', 'wr', 'wb', 'wn', 'wp'].map((p) => (
              <div key={p} className="flex items-center justify-center relative">
                <img
                  src={`/assets/pieces/${id}/${p}.png`}
                  alt={p}
                  className="w-full h-full max-w-[80%] max-h-[80%] object-contain drop-shadow-xl transition-transform duration-150 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          )
        )}

        {/* Selected Overlay Checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-10"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-black flex items-center justify-center shadow-2xl">
              <Check size={32} strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4 bg-gradient-to-t from-black/90 to-[#1c1c1e]/90 border-t border-white/5 relative z-10">
        <h3 className="text-white font-bold text-lg capitalize tracking-wide mb-1">
          {name.replace(/_/g, ' ')}
        </h3>
        <p className="text-white/40 text-xs font-medium">
          {isSelected ? (
            <span className="flex items-center gap-1 text-[var(--color-accent)]">
              <Check size={12} /> Currently Selected
            </span>
          ) : (
            `Tap to apply ${type}`
          )}
        </p>
      </div>
    </motion.div>
  );
};
