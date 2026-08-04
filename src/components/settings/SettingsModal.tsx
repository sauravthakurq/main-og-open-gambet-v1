'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Swords, Clock, Bot, Globe, Shield, Database, Info, Monitor, Key } from 'lucide-react';
import BoardAndPiecesSettings from './BoardAndPiecesSettings';
import { AccountSettingsTab, GameplaySettingsTab, ClockSettingsTab, AISettingsTab, LanguageSettingsTab, PrivacySettingsTab, StorageSettingsTab, AboutSettingsTab, ApiSettingsTab } from './SettingsTabs';
import { useGameStore } from '@/store/useGameStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export type SettingsTabId = 'account' | 'appearance' | 'gameplay' | 'clock' | 'ai' | 'language' | 'privacy' | 'storage' | 'about' | 'view-mode' | 'api';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('account');
  const { viewMode, setViewMode } = useGameStore();

  useAndroidBack('settings-modal', onClose, isOpen);

  const TABS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'view-mode', label: 'View Mode', icon: Monitor },
    { id: 'gameplay', label: 'Gameplay', icon: Swords },
    { id: 'clock', label: 'Clock & Time', icon: Clock },
    { id: 'ai', label: 'AI & Analysis', icon: Bot },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'about', label: 'About', icon: Info },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
            className="relative w-full max-w-[1200px] h-[85vh] max-h-[850px] m-auto bg-[#0c0c0c]/95 border border-white/10 rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row backdrop-blur-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Sidebar */}
            <div className="w-full md:w-64 bg-black/40 border-r border-white/5 flex flex-col shrink-0 p-4 pt-16 md:pt-8 overflow-y-auto custom-scrollbar">
              <h2 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-4">Settings</h2>
              
              <div className="flex flex-col gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTabId)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,rgba(227,193,149,0.05),transparent_50%)]">
              {activeTab === 'account' && <AccountSettingsTab />}
              {activeTab === 'appearance' && <BoardAndPiecesSettings />}
              {activeTab === 'gameplay' && <GameplaySettingsTab />}
              {activeTab === 'clock' && <ClockSettingsTab />}
              {activeTab === 'ai' && <AISettingsTab />}
              {activeTab === 'language' && <LanguageSettingsTab />}
              {activeTab === 'privacy' && <PrivacySettingsTab />}
              {activeTab === 'storage' && <StorageSettingsTab />}
              {activeTab === 'api' && <ApiSettingsTab />}
              {activeTab === 'about' && <AboutSettingsTab />}

              {activeTab === 'view-mode' && (
                <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                   <Monitor size={48} className="text-[var(--color-accent)] mb-4" />
                   <h2 className="text-2xl font-bold text-white mb-2">View Mode</h2>
                   <div className="flex gap-4 mt-6">
                      <button onClick={() => setViewMode('2D')} className={`px-8 py-3 rounded-xl font-medium transition-colors ${viewMode === '2D' ? 'bg-[var(--color-accent)] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}>2D View</button>
                      <button onClick={() => setViewMode('3D')} className={`px-8 py-3 rounded-xl font-medium transition-colors ${viewMode === '3D' ? 'bg-[var(--color-accent)] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}>3D View</button>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
