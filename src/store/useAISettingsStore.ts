import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface APIKeyEntry {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
}

interface AISettingsState {
  engineType: 'cloud' | 'local';
  provider: string;
  model: string;
  apiKeys: Record<string, APIKeyEntry[]>;
  baseUrls: Record<string, string>;
  organizations: Record<string, string>;
  temperatures: Record<string, number>;
  maxTokens: Record<string, number>;
  isConnected: boolean;
  customModels: Record<string, string[]>;
  
  // Actions
  setEngineType: (type: 'cloud' | 'local') => void;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  addApiKey: (provider: string, key: string, name?: string) => void;
  updateApiKey: (provider: string, id: string, updates: Partial<APIKeyEntry>) => void;
  deleteApiKey: (provider: string, id: string) => void;
  setBaseUrl: (provider: string, url: string) => void;
  setOrganization: (provider: string, org: string) => void;
  setTemperature: (provider: string, temp: number) => void;
  setMaxTokens: (provider: string, tokens: number) => void;
  setIsConnected: (status: boolean) => void;
  addCustomModel: (provider: string, model: string) => void;
}

export const useAISettingsStore = create<AISettingsState>()(
  persist(
    (set) => ({
      engineType: 'cloud',
      provider: 'OpenAI',
      model: 'GPT-5',
      apiKeys: {},
      baseUrls: {},
      organizations: {},
      temperatures: {},
      maxTokens: {},
      isConnected: false,
      customModels: {},

      setEngineType: (type) => set({ engineType: type }),
      setProvider: (provider) => set({ provider }),
      setModel: (model) => set({ model }),
      
      addApiKey: (provider, key, name) => set((state) => {
        const keys = state.apiKeys[provider] || [];
        const newKey: APIKeyEntry = {
          id: Math.random().toString(36).substring(2, 9),
          key,
          name: name || `Key ${keys.length + 1}`,
          enabled: true
        };
        return { apiKeys: { ...state.apiKeys, [provider]: [...keys, newKey] } };
      }),
      
      updateApiKey: (provider, id, updates) => set((state) => {
        const keys = state.apiKeys[provider] || [];
        const updatedKeys = keys.map(k => k.id === id ? { ...k, ...updates } : k);
        return { apiKeys: { ...state.apiKeys, [provider]: updatedKeys } };
      }),
      
      deleteApiKey: (provider, id) => set((state) => {
        const keys = state.apiKeys[provider] || [];
        return { apiKeys: { ...state.apiKeys, [provider]: keys.filter(k => k.id !== id) } };
      }),

      setBaseUrl: (provider, url) => 
        set((state) => ({ baseUrls: { ...state.baseUrls, [provider]: url } })),
      setOrganization: (provider, org) => 
        set((state) => ({ organizations: { ...state.organizations, [provider]: org } })),
      setTemperature: (provider, temp) => 
        set((state) => ({ temperatures: { ...state.temperatures, [provider]: temp } })),
      setMaxTokens: (provider, tokens) => 
        set((state) => ({ maxTokens: { ...state.maxTokens, [provider]: tokens } })),
      setIsConnected: (status) => set({ isConnected: status }),
      addCustomModel: (provider, model) => set((state) => {
        const models = state.customModels[provider] || [];
        if (models.includes(model)) return state;
        return { customModels: { ...state.customModels, [provider]: [...models, model] } };
      }),
    }),
    {
      name: 'open-gambit-ai-settings', // unique name in localStorage
      partialize: (state) => ({ 
        provider: state.provider, 
        model: state.model, 
        apiKeys: state.apiKeys, 
        baseUrls: state.baseUrls,
        organizations: state.organizations,
        temperatures: state.temperatures,
        maxTokens: state.maxTokens,
        engineType: state.engineType,
        isConnected: state.isConnected
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate string apiKeys to array format
          const oldApiKeys = persistedState.apiKeys || {};
          const newApiKeys: Record<string, APIKeyEntry[]> = {};
          
          Object.entries(oldApiKeys).forEach(([provider, key]) => {
            if (typeof key === 'string' && key.trim() !== '') {
              newApiKeys[provider] = [{
                id: Math.random().toString(36).substring(2, 9),
                key,
                name: 'Primary Key',
                enabled: true
              }];
            }
          });
          persistedState.apiKeys = newApiKeys;
        }
        return persistedState;
      }
    }
  )
);
