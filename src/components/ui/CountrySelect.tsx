'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import countriesData from '../../../country-flags-main/countries.json';

export interface CountryOption {
  code: string;
  name: string;
}

export const ALL_COUNTRIES: CountryOption[] = Object.entries(countriesData).map(([code, name]) => ({
  code,
  name,
}));

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
}

export const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentCountry = ALL_COUNTRIES.find((c) => c.code.toLowerCase() === value.toLowerCase()) || {
    code: value || 'US',
    name: value || 'United States',
  };

  const filteredCountries = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] bg-[#141416] border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Select Country</h3>
                <p className="text-xs text-white/40">Choose your display flag and country</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Clean Pill Search Bar */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country by name or code..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-full pl-11 pr-4 py-3 outline-none focus:border-[var(--color-accent)] focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
                  autoFocus
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-bold"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* Countries List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar max-h-[500px]">
              {filteredCountries.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">No countries found</div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = country.code.toLowerCase() === currentCountry.code.toLowerCase();

                  return (
                    <button
                      key={country.code}
                      onClick={() => {
                        onChange(country.code);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-left group ${
                        isSelected
                          ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-white shadow-[0_0_20px_rgba(227,193,149,0.1)]'
                          : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`/flags/${country.code.toLowerCase()}.svg`}
                          alt={country.name}
                          className="w-7 h-5 object-cover rounded-[3px] shadow-sm shrink-0 border border-white/10"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="font-semibold text-sm truncate">{country.name}</span>
                        <span className="text-xs text-white/30 font-mono">({country.code})</span>
                      </div>

                      {isSelected && <Check size={18} className="text-[var(--color-accent)] shrink-0 ml-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all text-white text-sm font-medium shadow-md group"
      >
        <img
          src={`/flags/${currentCountry.code.toLowerCase()}.svg`}
          alt={currentCountry.name}
          className="w-6 h-4 object-cover rounded-[2px] shadow-sm shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <span className="truncate max-w-[140px]">{currentCountry.name}</span>
        <ChevronDown size={16} className="text-white/40 group-hover:text-white transition-colors ml-auto" />
      </button>

      {/* Render Modal via Portal */}
      {mounted && typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </div>
  );
};
