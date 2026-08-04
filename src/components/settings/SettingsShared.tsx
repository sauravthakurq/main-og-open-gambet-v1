import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

export const SettingSection = ({ title, icon: Icon, children, description }: any) => (
  <div className="mb-10">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
        {Icon && <Icon size={20} className="text-[var(--color-accent)]" />}
        {title}
      </h2>
      {description && <p className="text-sm text-white/50 font-medium">{description}</p>}
    </div>
    <div className="bg-[#1c1c1e]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
      {children}
    </div>
  </div>
);

export const SettingRow = ({ title, description, children, isLast }: any) => (
  <div className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex-1 pr-4">
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
      {description && <p className="text-sm text-white/40 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">
      {children}
    </div>
  </div>
);

export const SettingToggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
      checked ? 'bg-[var(--color-accent)]' : 'bg-white/10'
    }`}
  >
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      className={`absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center`}
      initial={false}
      animate={{ x: checked ? 20 : 0 }}
    >
      {checked && <Check size={12} className="text-black" />}
    </motion.div>
  </button>
);

export const SettingSelect = ({ value, options, onChange }: { value: string; options: { label: string; value: string }[]; onChange: (val: string) => void }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-black/40 border border-white/10 text-white text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all min-w-[120px] font-medium"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#1c1c1e] text-white">
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
      <ChevronRight size={14} className="rotate-90" />
    </div>
  </div>
);

export const SettingAction = ({ label, onClick, destructive = false, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 sm:p-5 transition-colors border-b border-white/5 last:border-0 ${
      destructive ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-white/5 text-white/90'
    }`}
  >
    <div className="flex items-center gap-3 font-semibold">
      {Icon && <Icon size={18} />}
      {label}
    </div>
    <ChevronRight size={18} className="opacity-50" />
  </button>
);

export const SettingInput = ({ value, onChange, placeholder, type = 'text' }: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all w-full sm:w-64 font-medium placeholder:text-white/20"
  />
);
