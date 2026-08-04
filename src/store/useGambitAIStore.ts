import { create } from 'zustand';

type OrbState = 'idle' | 'speaking' | 'thinking' | 'listening' | 'error';
type AIPersonality = 'Friendly' | 'Strict' | 'Grandmaster' | 'Beginner';

interface GambitAIState {
  isWorkspaceOpen: boolean;
  orbState: OrbState;
  personality: AIPersonality;
  voiceCoachEnabled: boolean;
  
  setWorkspaceOpen: (isOpen: boolean) => void;
  setOrbState: (state: OrbState) => void;
  setPersonality: (personality: AIPersonality) => void;
  setVoiceCoachEnabled: (enabled: boolean) => void;
}

export const useGambitAIStore = create<GambitAIState>((set) => ({
  isWorkspaceOpen: false,
  orbState: 'idle',
  personality: 'Friendly',
  voiceCoachEnabled: true,
  
  setWorkspaceOpen: (isOpen) => set({ isWorkspaceOpen: isOpen }),
  setOrbState: (state) => set({ orbState: state }),
  setPersonality: (personality) => set({ personality }),
  setVoiceCoachEnabled: (enabled) => set({ voiceCoachEnabled: enabled }),
}));
