import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
  id?: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms, 0 means infinite
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
  clearAll: () => void;
}

const MAX_TOASTS = 5;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (options) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    
    // Default duration: Loading/Error = infinite by default, others = 5s
    const defaultDuration = options.type === 'loading' || options.type === 'error' ? 0 : 5000;
    const duration = options.duration !== undefined ? options.duration : defaultDuration;
    
    const newToast: Toast = {
      ...options,
      type: options.type || 'info',
      duration,
      id,
      createdAt: Date.now(),
    };

    set((state) => {
      // Remove if it already exists
      const existingFilter = state.toasts.filter(t => t.id !== id);
      // Prepend newest at top
      const newToasts = [newToast, ...existingFilter];
      
      // Enforce max limit
      if (newToasts.length > MAX_TOASTS) {
        return { toasts: newToasts.slice(0, MAX_TOASTS) };
      }
      return { toasts: newToasts };
    });

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  updateToast: (id, options) => {
    set((state) => ({
      toasts: state.toasts.map(t => t.id === id ? { ...t, ...options } : t)
    }));
  },

  clearAll: () => set({ toasts: [] }),
}));
