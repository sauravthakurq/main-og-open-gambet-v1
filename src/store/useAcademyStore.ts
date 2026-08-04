import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AcademyCategory, AcademyStage, AcademyLevel } from '@/lib/academy/types';

interface AcademyState {
  progress: Record<string, number[]>; // stageId -> array of scores (0-3) for each level
  unlockedStages: string[];
  
  activeStageId: string | null;
  activeLevelId: number | null; // 1-indexed
  isDocsOpen: boolean;

  // Actions
  startStage: (stageId: string, levelId?: number) => void;
  quitStage: () => void;
  openDocs: () => void;
  closeDocs: () => void;
  saveScore: (stageId: string, levelId: number, score: number) => void;
  unlockStage: (stageId: string) => void;
  resetProgress: () => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      progress: {},
      unlockedStages: ['rook'], // First stage is always unlocked
      activeStageId: null,
      activeLevelId: null,
      isDocsOpen: false,

      startStage: (stageId, levelId = 1) => set({ activeStageId: stageId, activeLevelId: levelId, isDocsOpen: false }),
      
      quitStage: () => set({ activeStageId: null, activeLevelId: null }),

      openDocs: () => set({ isDocsOpen: true, activeStageId: null }),
      closeDocs: () => set({ isDocsOpen: false }),

      saveScore: (stageId, levelId, score) => set((state) => {
        const stageProgress = state.progress[stageId] || [];
        const newProgress = [...stageProgress];
        
        // Ensure array is large enough (levels are 1-indexed, array is 0-indexed)
        while (newProgress.length < levelId) {
          newProgress.push(0);
        }
        
        // Update score if it's better
        if (score > (newProgress[levelId - 1] || 0)) {
          newProgress[levelId - 1] = score;
        }

        return {
          progress: {
            ...state.progress,
            [stageId]: newProgress
          }
        };
      }),

      unlockStage: (stageId) => set((state) => ({
        unlockedStages: Array.from(new Set([...state.unlockedStages, stageId]))
      })),

      resetProgress: () => set({ progress: {}, unlockedStages: ['rook'] })
    }),
    {
      name: 'gambit-academy-progress',
    }
  )
);
