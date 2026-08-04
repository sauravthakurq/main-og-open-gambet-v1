import { create } from 'zustand';

export interface ModalOptions {
  id?: string;
  title: string;
  message: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    destructive?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
}

interface ModalState {
  currentModal: ModalOptions | null;
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,

  showModal: (options) => {
    set({ currentModal: options });
  },

  closeModal: () => {
    set({ currentModal: null });
  },
}));
