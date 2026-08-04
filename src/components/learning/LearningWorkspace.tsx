import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap } from 'lucide-react';
import { useLearningStore } from '@/store/useLearningStore';
import { useAcademyStore } from '@/store/useAcademyStore';
import { AcademyDashboard } from './AcademyDashboard';
import { AcademyLessonView } from './AcademyLessonView';
import { LearningDocsView } from '../learning-docs/LearningDocsView';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export const LearningWorkspace = () => {
  const { isWorkspaceOpen, setWorkspaceOpen } = useLearningStore();
  const { activeStageId, isDocsOpen } = useAcademyStore();
  
  // Close workspace on hardware back button
  useAndroidBack('learning-workspace', () => setWorkspaceOpen(false), isWorkspaceOpen);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <AnimatePresence>
      {isWorkspaceOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-6 bg-black/90"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="w-full h-full lg:max-w-[1400px] lg:rounded-3xl bg-[#0c0c0c]/95 border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[var(--color-accent)] opacity-[0.03] blur-[100px] pointer-events-none"></div>

            {/* Render Lesson View, Docs View, or Dashboard */}
            {activeStageId ? (
               <AcademyLessonView />
            ) : isDocsOpen ? (
               <LearningDocsView />
            ) : (
               <>
                 {/* Header */}
                 <div className="h-[72px] shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <img 
                          src="/logo.png" 
                          alt="Open Gambit" 
                          className="h-10 w-auto object-contain transition-transform hover:scale-105" 
                          draggable={false} 
                        />
                       <h2 className="text-xl font-black text-white tracking-tight hidden sm:block">Gambit Academy</h2>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => setWorkspaceOpen(false)}
                         className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                       >
                         <X size={20} />
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <AcademyDashboard />
                 </div>
               </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted && typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};
