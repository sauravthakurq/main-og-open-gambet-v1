import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] w-full"
    >
      <div className="w-16 h-16 mb-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner">
        <Icon className="w-8 h-8 text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-[280px] leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-transform active:scale-95"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
