import { create } from 'zustand';

export interface AIAnalysisResult {
  gameSummary: string;
  openingDetection: string;
  openingAccuracy: number;
  whiteAccuracy: number;
  blackAccuracy: number;
  moveClassifications: {
    best: number;
    brilliant: number;
    great: number;
    missedWin: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
  criticalTurningPoint: string;
  tacticalOpportunities: string;
  strategicSuggestions: string;
  endgameEvaluation: string;
  aiCoachSummary: string;
  overallGameRating: string;
  estimatedEloPerformance: {
    white: number;
    black: number;
  };
  personalizedImprovementTips: string[];
}

interface AnalysisState {
  cache: Record<string, AIAnalysisResult>;
  fetchingPromises: Record<string, Promise<AIAnalysisResult>>;
  setAnalysisCache: (pgn: string, result: AIAnalysisResult) => void;
  getAnalysis: (pgn: string) => AIAnalysisResult | undefined;
  fetchAnalysis: (params: {
    pgn: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string;
    organization: string;
  }) => Promise<AIAnalysisResult>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  cache: {},
  fetchingPromises: {},
  setAnalysisCache: (pgn, result) => set((state) => ({
    cache: { ...state.cache, [pgn]: result }
  })),
  getAnalysis: (pgn) => get().cache[pgn],
  fetchAnalysis: async (params) => {
    const { pgn, provider, model, apiKey, baseUrl, organization } = params;
    const { cache, fetchingPromises, setAnalysisCache } = get();

    if (cache[pgn]) {
      return cache[pgn];
    }

    if (pgn in fetchingPromises) {
      return fetchingPromises[pgn];
    }

    const promise = (async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pgn, provider, model, apiKey, baseUrl, organization })
        });

        if (!res.ok) {
          throw new Error(`Failed to analyze: ${res.status}`);
        }

        const data = await res.json();
        
        let parsedResult: AIAnalysisResult;
        if (typeof data.result === 'string') {
          const cleanedText = data.result
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
          parsedResult = JSON.parse(cleanedText);
        } else {
          parsedResult = data.result;
        }

        setAnalysisCache(pgn, parsedResult);
        
        // Remove promise from cache once it's done
        set((state) => {
          const newPromises = { ...state.fetchingPromises };
          delete newPromises[pgn];
          return { fetchingPromises: newPromises };
        });

        return parsedResult;
      } catch (err) {
        // Clear promise on error so it can be retried
        set((state) => {
          const newPromises = { ...state.fetchingPromises };
          delete newPromises[pgn];
          return { fetchingPromises: newPromises };
        });
        throw err;
      }
    })();

    set((state) => ({
      fetchingPromises: { ...state.fetchingPromises, [pgn]: promise }
    }));

    return promise;
  }
}));
