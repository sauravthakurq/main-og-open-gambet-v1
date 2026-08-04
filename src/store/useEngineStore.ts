import { create } from 'zustand';
import { StockfishEngine, EngineInfo } from '@/lib/StockfishEngine';

export type AIConnectionState = 
  | 'Connected' | 'Connecting' | 'Invalid API Key' 
  | 'Timeout' | 'Rate Limited' | 'API Error' 
  | 'Network Offline' | 'Invalid Response' | 'Cancelled';

interface EngineState {
  engine: StockfishEngine | null;
  engineInfo: EngineInfo | null;
  isThinking: boolean;
  bestMoveListeners: ((move: string) => void)[];
  
  // AI LLM specific states
  connectionState: AIConnectionState;
  currentResponseTime: number;
  averageResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  totalRequests: number;
  abortController: AbortController | null;
  retryCount: number;
  
  initEngine: () => void;
  startThinking: (fen: string, depth?: number) => void;
  playComputerMove: (fen: string, difficulty: 'easy' | 'intermediate' | 'hard' | 'master' | 'max') => void;
  stopThinking: () => void;
  destroyEngine: () => void;
  setIsThinking: (isThinking: boolean) => void;
  addBestMoveListener: (listener: (move: string) => void) => void;
  removeBestMoveListener: (listener: (move: string) => void) => void;
  
  // Actions for LLM AI
  setConnectionState: (state: AIConnectionState) => void;
  recordResponseTime: (timeMs: number) => void;
  setAbortController: (controller: AbortController | null) => void;
  cancelAIRequest: () => void;
  triggerRetry: () => void;
}

export const useEngineStore = create<EngineState>((set, get) => ({
  engine: null,
  engineInfo: null,
  isThinking: false,
  bestMoveListeners: [],

  connectionState: 'Connected',
  currentResponseTime: 0,
  averageResponseTime: 0,
  fastestResponse: 0,
  slowestResponse: 0,
  totalRequests: 0,
  abortController: null,
  retryCount: 0,

  initEngine: () => {
    const currentEngine = get().engine;
    if (!currentEngine) {
      const newEngine = new StockfishEngine();
      newEngine.onInfo = (info) => {
        set({ engineInfo: info });
      };
      newEngine.onBestMove = (move) => {
        set({ isThinking: false });
        get().bestMoveListeners.forEach(listener => listener(move));
      };
      set({ engine: newEngine });
    }
  },

  startThinking: (fen: string, depth = 15) => {
    const { engine } = get();
    if (engine) {
      engine.evaluatePosition(fen, depth);
    }
  },

  playComputerMove: (fen: string, difficulty: 'easy' | 'intermediate' | 'hard' | 'master' | 'max') => {
    const { engine } = get();
    if (engine) {
      set({ isThinking: true });
      engine.playMove(fen, difficulty);
    }
  },

  stopThinking: () => {
    const { engine } = get();
    if (engine) {
      engine.stop();
      set({ isThinking: false });
    }
  },

  destroyEngine: () => {
    const { engine } = get();
    if (engine) {
      engine.destroy();
      set({ engine: null, engineInfo: null, isThinking: false });
    }
  },

  setIsThinking: (isThinking: boolean) => {
    set({ isThinking });
  },

  addBestMoveListener: (listener) => {
    set(state => ({ bestMoveListeners: [...state.bestMoveListeners, listener] }));
  },

  removeBestMoveListener: (listener) => {
    set(state => ({ bestMoveListeners: state.bestMoveListeners.filter(l => l !== listener) }));
  },

  setConnectionState: (state) => set({ connectionState: state }),

  recordResponseTime: (timeMs) => {
    set(state => {
      const newTotal = state.totalRequests + 1;
      const newAverage = state.totalRequests === 0 
        ? timeMs 
        : ((state.averageResponseTime * state.totalRequests) + timeMs) / newTotal;
      
      const newFastest = state.fastestResponse === 0 ? timeMs : Math.min(state.fastestResponse, timeMs);
      const newSlowest = Math.max(state.slowestResponse, timeMs);

      return {
        currentResponseTime: timeMs,
        averageResponseTime: newAverage,
        fastestResponse: newFastest,
        slowestResponse: newSlowest,
        totalRequests: newTotal,
      };
    });
  },

  setAbortController: (controller) => set({ abortController: controller }),

  cancelAIRequest: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ 
        abortController: null, 
        isThinking: false,
        connectionState: 'Cancelled' 
      });
    }
  },

  triggerRetry: () => {
    set(state => ({ retryCount: state.retryCount + 1 }));
  }
}));
