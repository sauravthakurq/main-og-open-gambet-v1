import { create } from 'zustand';

interface LearningState {
  isWorkspaceOpen: boolean;
  setWorkspaceOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  isWorkspaceOpen: false,
  setWorkspaceOpen: (open) => set({ isWorkspaceOpen: open }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: 'All',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
