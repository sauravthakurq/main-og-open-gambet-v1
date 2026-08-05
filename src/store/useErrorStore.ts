import { create } from 'zustand';

export type ErrorCategory = 
  | 'Authentication' 
  | 'Network' 
  | 'AI' 
  | 'Warning' 
  | 'Critical' 
  | 'Server' 
  | 'Chess' 
  | 'Storage'
  | 'System';

export interface AppErrorAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface AppError {
  id: string;
  category: ErrorCategory;
  title: string;
  message: string;
  developerDetails?: {
    provider?: string;
    model?: string;
    endpoint?: string;
    httpStatus?: number;
    errorCode?: string;
    requestId?: string;
    timestamp: string;
    stackTrace?: string;
    internalErrorType?: string;
  };
  actions?: AppErrorAction[];
}

interface ErrorState {
  currentError: AppError | null;
  dispatchError: (error: Omit<AppError, 'id'>) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  currentError: null,
  dispatchError: (error) => {
    // Log to console centrally as requested
    console.error(`[GlobalError] ${error.category}: ${error.title} - ${error.message}`, error.developerDetails || '');
    
    set({
      currentError: {
        ...error,
        id: Math.random().toString(36).substring(2, 9),
      }
    });
  },
  clearError: () => set({ currentError: null })
}));
