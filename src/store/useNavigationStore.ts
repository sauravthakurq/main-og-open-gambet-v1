import { create } from 'zustand';

interface NavigationState {
  openModals: string[];
  pushModal: (modalId: string) => void;
  popModal: () => string | undefined;
  removeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  openModals: [],
  pushModal: (modalId: string) => {
    set((state) => {
      if (state.openModals.includes(modalId)) return state;
      return { openModals: [...state.openModals, modalId] };
    });
  },
  popModal: () => {
    let popped: string | undefined;
    set((state) => {
      const newModals = [...state.openModals];
      popped = newModals.pop();
      return { openModals: newModals };
    });
    return popped;
  },
  removeModal: (modalId: string) => {
    set((state) => ({
      openModals: state.openModals.filter(id => id !== modalId)
    }));
  },
  isModalOpen: (modalId: string) => {
    return get().openModals.includes(modalId);
  }
}));
