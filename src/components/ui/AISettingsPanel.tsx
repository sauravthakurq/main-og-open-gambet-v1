'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Eye, 
  EyeOff,
  ChevronDown, 
  Check, 
  Plus, 
  Command,
  Triangle,
  Sparkles,
  Search,
  Cloud,
  Moon,
  Wind,
  Infinity,
  Cpu,
  Brain,
  Maximize,
  Gamepad2,
  Music,
  PawPrint,
  Box,
  Loader2,
  AlertCircle,
  Zap,
  Settings2,
  Trash2,
  Power,
  Shield
} from 'lucide-react';
import { useAISettingsStore, APIKeyEntry } from '@/store/useAISettingsStore';

const PROVIDERS_DATA = [
  {
    id: 'OpenAI', name: 'OpenAI', icon: Command, iconColor: '#FFF', imageIcon: '/icons/openai.svg',
    defaultBaseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', type: 'Best Overall' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', type: 'Fast' },
      { id: 'gpt-4.1', name: 'GPT-4.1', type: 'Premium' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', type: 'Fast' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', type: 'Balanced' },
      { id: 'o3-mini', name: 'o3 Mini', type: 'Reasoning' },
      { id: 'o3', name: 'o3', type: 'Reasoning Premium' },
      { id: 'o4-mini', name: 'o4 Mini', type: 'Reasoning' },
      { id: 'gpt-4', name: 'GPT-4', type: 'Standard' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', type: 'Fast' },
    ]
  },
  {
    id: 'Anthropic', name: 'Anthropic', icon: Triangle, iconColor: '#FFF', imageIcon: '/icons/anthropic.svg',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', type: 'Fast' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', type: 'Best Overall' },
      { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', type: 'Premium' },
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', type: 'Balanced' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', type: 'Fast' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', type: 'Premium' },
    ]
  },
  {
    id: 'Google', name: 'Google', icon: Sparkles, iconColor: '#4285F4', imageIcon: '/icons/google.svg',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', type: 'Ultra Fast' },
      { id: 'gemini-2.5-flash-lite-preview-06-17', name: 'Gemini 2.5 Flash Lite', type: 'Fast' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'Balanced' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', type: 'Premium' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'Fast' },
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', type: 'Ultra Fast' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: 'Premium' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', type: 'Fast' },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', type: 'Ultra Fast' },
    ]
  },
  {
    id: 'xAI', name: 'xAI', icon: null, iconColor: '#FFF', customIcon: 'xI', imageIcon: '/icons/xai.svg',
    defaultBaseUrl: 'https://api.x.ai/v1',
    models: [
      { id: 'grok-beta', name: 'Grok Beta', type: 'Best Overall' },
      { id: 'grok-2-1212', name: 'Grok 2', type: 'Balanced' },
      { id: 'grok-2-mini-1212', name: 'Grok 2 Mini', type: 'Fast' },
      { id: 'grok-3', name: 'Grok 3', type: 'Premium' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', type: 'Fast' },
    ]
  },
  {
    id: 'DeepSeek', name: 'DeepSeek', icon: Search, iconColor: '#4D94FF', imageIcon: '/icons/deepseek.svg',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-v4-flash', name: 'DeepSeek v4 Flash', type: 'Ultra Fast' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat (V3)', type: 'Fast' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)', type: 'Reasoning' },
    ]
  },
  {
    id: 'Groq', name: 'Groq', icon: Zap, iconColor: '#F55036', imageIcon: '/icons/groq.svg',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    models: [
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', type: 'Ultra Fast' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', type: 'Balanced' },
      { id: 'llama3-70b-8192', name: 'Llama 3 70B', type: 'Premium' },
      { id: 'llama3-8b-8192', name: 'Llama 3 8B', type: 'Fast' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', type: 'Fast' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', type: 'Balanced' },
      { id: 'moonshotai/kimi-k2-instruct', name: 'Kimi K2', type: 'Premium' },
      { id: 'qwen/qwen3-32b', name: 'Qwen 3 32B', type: 'Balanced' },
    ]
  },
  {
    id: 'Mistral', name: 'Mistral AI', icon: Wind, iconColor: '#F97316', imageIcon: '/icons/mistral.svg',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', type: 'Best Overall' },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo', type: 'Fast' },
      { id: 'open-mixtral-8x22b', name: 'Mistral 8x22B', type: 'Premium' },
    ]
  },
  {
    id: 'Cohere', name: 'Cohere', icon: Cpu, iconColor: '#39594D', imageIcon: '/icons/cohere.svg',
    defaultBaseUrl: 'https://api.cohere.ai/v1',
    models: [
      { id: 'command-r-plus', name: 'Command R+', type: 'Best Overall' },
      { id: 'command-r', name: 'Command R', type: 'Balanced' },
      { id: 'custom_model_input', name: 'Custom...', type: 'Any Custom Model' }
    ]
  },
  {
    id: 'Custom', name: 'Custom Provider', icon: Box, iconColor: '#FFF', imageIcon: null,
    defaultBaseUrl: '',
    models: [
      { id: 'custom_model_input', name: 'Custom Model...', type: 'Any Custom Model' }
    ]
  },
];

interface AISettingsPanelProps {
  onClose?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  overrideProvider?: string;
  overrideModel?: string;
  onSaveOverride?: (config: { provider: string, model: string, engineType: string }) => void;
}

export default function AISettingsPanel({ onClose, onSave, onCancel, overrideProvider, overrideModel, onSaveOverride }: AISettingsPanelProps) {
  const settingsStore = useAISettingsStore();
  const [activeProviderId, setActiveProviderId] = useState(overrideProvider || settingsStore.provider || PROVIDERS_DATA[0].id);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyMap(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  // Initialize independent state for EACH provider with their real Base URLs
  const [configs, setConfigs] = useState(() => {
    const initialState: any = {};
    PROVIDERS_DATA.forEach(provider => {
      let defaultModelId = provider.models[0]?.id;
      if (provider.id === 'Groq') defaultModelId = 'llama-3.1-8b-instant';
      if (provider.id === 'Google') defaultModelId = 'gemini-3.5-flash-lite';
      if (provider.id === 'DeepSeek') defaultModelId = 'deepseek-v4-flash';

      // Ensure the model actually exists in the current list, else fallback to the first one
      if (!provider.models.find(m => m.id === defaultModelId) && provider.id !== 'Custom') {
          defaultModelId = provider.models[0]?.id || '';
      }

      initialState[provider.id] = {
        modelId: (overrideProvider === provider.id && overrideModel) ? overrideModel : (settingsStore.providerModels?.[provider.id] || (settingsStore.provider === provider.id ? settingsStore.model : defaultModelId)),
        customModelId: (overrideProvider === provider.id && overrideModel && !provider.models.find(m => m.id === overrideModel)) ? overrideModel : (settingsStore.provider === provider.id && !provider.models.find(m => m.id === settingsStore.model) ? settingsStore.model : ''),
        isCustomModel: provider.id === 'Custom' || (overrideProvider === provider.id && overrideModel && !provider.models.find(m => m.id === overrideModel)) || (settingsStore.provider === provider.id && !provider.models.find(m => m.id === settingsStore.model)),
        apiKeys: settingsStore.apiKeys[provider.id] && settingsStore.apiKeys[provider.id].length > 0 
          ? settingsStore.apiKeys[provider.id].map(k => ({ ...k })) 
          : [{ id: Math.random().toString(36).substring(2, 9), key: '', name: 'Key 1', enabled: true }],
        baseUrl: settingsStore.baseUrls[provider.id] || provider.defaultBaseUrl,
        orgId: settingsStore.organizations[provider.id] || '',
        temperature: settingsStore.temperatures[provider.id] ?? 0.7,
        maxTokens: settingsStore.maxTokens[provider.id]?.toString() || '4096',
        status: (settingsStore.isConnected && settingsStore.provider === provider.id && (provider.id === 'Stockfish' || (settingsStore.apiKeys[provider.id] && settingsStore.apiKeys[provider.id].some(k => k.enabled && k.key.trim() !== '')))) ? 'connected' : 'untested',
        lastTested: null
      };
    });
    return initialState;
  });

  const activeConfig = configs[activeProviderId];
  const activeProvider = PROVIDERS_DATA.find(p => p.id === activeProviderId) || PROVIDERS_DATA[0];

  const updateConfig = (key: string, value: any) => {
    setConfigs((prev: any) => ({
      ...prev,
      [activeProviderId]: {
        ...prev[activeProviderId],
        [key]: value,
        ...(key === 'apiKey' && prev[activeProviderId].status === 'connected' ? { status: 'untested' } : {})
      }
    }));
  };

  const handleTestConnection = async () => {
    const primaryKey = activeConfig.apiKeys.find((k: any) => k.enabled)?.key;
    if (!primaryKey || !primaryKey.trim()) {
      updateConfig('status', 'error');
      return;
    }

    updateConfig('status', 'testing');
    
    try {
      const actualModel = activeConfig.isCustomModel ? activeConfig.customModelId : activeConfig.modelId;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProviderId,
          model: actualModel, 
          apiKey: primaryKey, 
          baseUrl: activeConfig.baseUrl,
          organization: activeConfig.orgId,
          prompt: "FEN: startpos\nPGN History: \nReturn 'e2e4'",
          maxTokens: 5
        })
      });
      if (res.ok) {
        updateConfig('status', 'connected');
        updateConfig('lastTested', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        updateConfig('status', 'error');
      }
    } catch (e) {
      updateConfig('status', 'error');
    }
  };

  const handleSaveConfig = () => {
    const actualModel = activeConfig.isCustomModel ? activeConfig.customModelId : activeConfig.modelId;
    const engineType = activeProviderId === 'Stockfish' ? 'local' : 'cloud';

    if (activeConfig.isCustomModel && actualModel) {
      settingsStore.addCustomModel(activeProviderId, actualModel);
    }

    if (onSaveOverride) {
      activeConfig.apiKeys.forEach((k: any) => {
        const existing = settingsStore.apiKeys[activeProviderId]?.find(ek => ek.id === k.id);
        if (existing) {
          settingsStore.updateApiKey(activeProviderId, k.id, k);
        } else {
          settingsStore.addApiKey(activeProviderId, k.key, k.name);
        }
      });
      // Handle deletions by removing keys not in activeConfig
      const currentKeys = settingsStore.apiKeys[activeProviderId] || [];
      currentKeys.forEach(k => {
        if (!activeConfig.apiKeys.find((ak: any) => ak.id === k.id)) {
          settingsStore.deleteApiKey(activeProviderId, k.id);
        }
      });
      
      // Delete completely empty keys that were auto-added but unused
      const savedKeys = settingsStore.apiKeys[activeProviderId] || [];
      savedKeys.forEach(k => {
        if (k.key.trim() === '') {
           settingsStore.deleteApiKey(activeProviderId, k.id);
        }
      });

      settingsStore.setBaseUrl(activeProviderId, activeConfig.baseUrl);
      settingsStore.setOrganization(activeProviderId, activeConfig.orgId);
      settingsStore.setTemperature(activeProviderId, activeConfig.temperature);
      settingsStore.setMaxTokens(activeProviderId, parseInt(activeConfig.maxTokens));
      settingsStore.setIsConnected(true);
      settingsStore.setProviderModel(activeProviderId, actualModel);
      
      onSaveOverride({ provider: activeProviderId, model: actualModel, engineType });
      return;
    }
    
    settingsStore.setProvider(activeProviderId);
    settingsStore.setModel(actualModel);
    settingsStore.setProviderModel(activeProviderId, actualModel);
    
    activeConfig.apiKeys.forEach((k: any) => {
      const existing = settingsStore.apiKeys[activeProviderId]?.find(ek => ek.id === k.id);
      if (existing) {
        settingsStore.updateApiKey(activeProviderId, k.id, k);
      } else {
        settingsStore.addApiKey(activeProviderId, k.key, k.name);
      }
    });
    const currentKeys = settingsStore.apiKeys[activeProviderId] || [];
    currentKeys.forEach(k => {
      if (!activeConfig.apiKeys.find((ak: any) => ak.id === k.id)) {
        settingsStore.deleteApiKey(activeProviderId, k.id);
      }
    });

    const savedKeys = settingsStore.apiKeys[activeProviderId] || [];
    savedKeys.forEach(k => {
      if (k.key.trim() === '') {
         settingsStore.deleteApiKey(activeProviderId, k.id);
      }
    });

    settingsStore.setBaseUrl(activeProviderId, activeConfig.baseUrl);
    settingsStore.setOrganization(activeProviderId, activeConfig.orgId);
    settingsStore.setTemperature(activeProviderId, activeConfig.temperature);
    settingsStore.setMaxTokens(activeProviderId, parseInt(activeConfig.maxTokens));
    
    // Always assume connected on save so the game loop can immediately fire off a move!
    settingsStore.setIsConnected(true);
    settingsStore.setEngineType(engineType as any);

    if (onSave) {
      onSave();
    } else if (onClose) {
      onClose();
    }
  };

  // Modern Apple-like dark theme
  const theme = {
    bg: '#141415',
    panelBg: '#1C1C1E',
    borderColor: '#2C2C2E',
    inputBg: '#09090B',
    accent: '#E3C195',
    accentHover: '#F0D4AF',
    textMain: '#F5F5F7',
    textMuted: '#86868B',
    success: '#32D74B',
    danger: '#FF453A'
  };

  return (
    <div className="w-full flex items-center justify-center bg-black/0 selection:bg-[#E3C195]/30 h-full">

      {/* Main Modal Container with smooth Apple-like curves & EXPANDED HEIGHT */}
      <div 
        className="relative w-full max-w-[100vw] sm:max-w-[1000px] h-[90vh] max-h-[850px] min-h-[580px] rounded-[24px] flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden font-sans transition-all duration-150"
        style={{ backgroundColor: theme.bg }}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between px-4 md:px-7 pt-4 md:pt-7 pb-3 md:pb-5 relative z-10">
          <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
            <div className="p-2 md:p-2.5 rounded-xl md:rounded-2xl bg-white/5 shadow-inner border border-white/5 shrink-0">
              <Settings className="w-4 h-4 md:w-6 md:h-6" style={{ color: theme.textMain }} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center pt-0.5 flex-1 min-w-0">
              <h2 className="text-[17px] md:text-[22px] font-semibold tracking-tight leading-none mb-1 md:mb-2 truncate" style={{ color: theme.textMain }}>
                Configure AI Model
              </h2>
              <p className="text-[11px] md:text-[13px] tracking-wide truncate" style={{ color: theme.textMuted }}>
                Choose a provider and model.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onCancel ? onCancel() : onClose?.()}
            onMouseEnter={() => setIsHoveringClose(true)}
            onMouseLeave={() => setIsHoveringClose(false)}
            className="p-2 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 shrink-0"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-200" style={{ color: isHoveringClose ? '#fff' : theme.textMuted }} />
          </button>
        </div>

        {/* Subtle separator */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0"></div>

        {/* Body Layout - Fixed flex bounds */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 min-w-0 w-full overflow-y-auto md:overflow-hidden">
          
          {/* Sidebar - Full list on desktop, compact chips on mobile */}
          <div 
            className="w-full min-w-0 md:w-[280px] flex flex-col border-b md:border-b-0 md:border-r shrink-0 relative z-10 transition-all duration-150" 
            style={{ borderColor: theme.borderColor, backgroundColor: theme.panelBg }}
          >
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto py-2 md:py-3 px-3 gap-2 md:space-y-1 custom-scrollbar w-full" style={{ scrollbarWidth: 'none' }}>
              {PROVIDERS_DATA.map((provider) => {
                const isActive = activeProviderId === provider.id;
                const IconComponent = provider.icon;
                const status = configs[provider.id].status;
                const isConnected = status === 'connected';
                
                return (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProviderId(provider.id)}
                    className={`
                      shrink-0 md:w-full flex items-center md:gap-3.5 gap-2 md:p-3 px-3 py-2 rounded-[12px] md:rounded-[14px] transition-all duration-200 border text-left group
                      ${isActive ? 'shadow-sm' : 'hover:bg-white/[0.04] border-transparent'}
                      active:scale-[0.98]
                    `}
                    style={{
                      backgroundColor: isActive ? 'rgba(227, 193, 149, 0.08)' : 'transparent',
                      borderColor: isActive ? 'rgba(227, 193, 149, 0.2)' : 'transparent',
                    }}
                  >
                    {/* Icon */}
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm border shrink-0"
                         style={{ 
                           backgroundColor: isActive ? '#1A1A1A' : '#141414',
                           borderColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent'
                         }}>
                      {provider.imageIcon ? (
                        <img src={provider.imageIcon} className="w-4 h-4 md:w-[22px] md:h-[22px] object-contain drop-shadow-sm" alt={provider.name} />
                      ) : IconComponent ? (
                        <IconComponent className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" style={{ color: isActive ? provider.iconColor : '#A1A1AA' }} strokeWidth={2} />
                      ) : (
                        <span className="font-bold text-xs md:text-sm tracking-tighter" style={{ color: isActive ? provider.iconColor : '#A1A1AA' }}>
                          {provider.customIcon}
                        </span>
                      )}
                    </div>

                    {/* Name + Model — visible on desktop, name only on mobile */}
                    <div className="flex-1 min-w-0 pr-2 hidden md:block">
                      <div className="text-[14px] font-medium truncate transition-colors duration-200" 
                           style={{ color: isActive ? theme.textMain : '#D4D4D8' }}>
                        {provider.name}
                      </div>
                      <div className="text-[12px] truncate mt-0.5 opacity-80" 
                           style={{ color: isActive ? theme.accent : theme.textMuted }}>
                        {configs[provider.id].isCustomModel ? 'Custom Model' : configs[provider.id].modelId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </div>
                    </div>
                    {/* Mobile: show name inline next to icon */}
                    <span className="md:hidden text-[12px] font-medium whitespace-nowrap" style={{ color: isActive ? theme.textMain : '#D4D4D8' }}>
                      {provider.name}
                    </span>

                    {/* Status Dot */}
                    <div className="flex items-center justify-center w-4 h-4 shrink-0">
                      {configs[provider.id]?.status === 'connected' && (
                        <div 
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shadow-[0_0_10px_rgba(50,215,75,0.6)] animate-in fade-in zoom-in duration-150"
                          style={{ backgroundColor: theme.success }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Add Custom Provider */}
            <div className="px-3 pb-2 md:p-4 border-t shrink-0" style={{ borderColor: theme.borderColor, backgroundColor: theme.panelBg }}>
              <button 
                onClick={() => setActiveProviderId('Custom')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 md:p-2.5 rounded-xl text-[12px] md:text-[13px] font-medium transition-all duration-200 hover:bg-white/5 active:scale-95 border border-transparent hover:border-white/10"
                style={{ color: theme.accent }}
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="md:inline">Custom</span>
              </button>
            </div>
          </div>

          {/* Main Settings Panel - Scrollable bounds */}
          <div className="flex-1 overflow-y-auto relative bg-[#141415] rounded-br-[24px] custom-scrollbar">
            
            {/* --- MOBILE ONLY LAYOUT --- */}
            <div className="w-full flex flex-col animate-in fade-in duration-150 fill-mode-both md:hidden" key={`mobile-${activeProviderId}`}>

              {/* Provider Header */}
              <div className="flex items-center gap-3 px-4 py-4 border-b shrink-0" style={{ borderColor: theme.borderColor }}>
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center border shrink-0"
                     style={{ backgroundColor: '#181818', borderColor: 'rgba(255,255,255,0.1)' }}>
                  {activeProvider.imageIcon ? (
                    <img src={activeProvider.imageIcon} className="w-6 h-6 object-contain" alt={activeProvider.name} />
                  ) : activeProvider.icon ? (
                    <activeProvider.icon className="w-5 h-5" style={{ color: activeProvider.iconColor }} strokeWidth={2} />
                  ) : (
                    <span className="font-bold text-sm" style={{ color: activeProvider.iconColor }}>{activeProvider.customIcon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-semibold truncate" style={{ color: theme.textMain }}>{activeProvider.name}</h3>
                  <p className="text-[12px] opacity-60 truncate" style={{ color: theme.textMuted }}>
                    {activeProviderId === 'Custom' ? 'Custom HTTP API' : `${activeProvider.name} Protocol`}
                  </p>
                </div>
              </div>

              {/* Body sections */}
              <div className="px-4 py-4 space-y-5">

                {/* Model Selector */}
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold" style={{ color: theme.textMain }}>Model</label>
                  {activeConfig.isCustomModel ? (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={activeConfig.customModelId}
                        onChange={(e) => updateConfig('customModelId', e.target.value)}
                        placeholder="e.g. gpt-4o"
                        className="w-full rounded-[12px] border px-4 py-3 text-[14px] outline-none bg-black/20"
                        style={{ borderColor: theme.borderColor, color: theme.textMain }}
                        autoFocus
                      />
                      <button
                        onClick={() => { updateConfig('isCustomModel', false); updateConfig('modelId', activeProvider.models[0].id); }}
                        className="absolute right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4 opacity-60" style={{ color: theme.textMain }} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={activeConfig.modelId}
                        onChange={(e) => {
                          if (e.target.value === 'custom_model_input') {
                            updateConfig('isCustomModel', true);
                          } else {
                            updateConfig('modelId', e.target.value);
                          }
                        }}
                        className="w-full appearance-none rounded-[12px] border px-4 py-3 text-[14px] font-medium outline-none cursor-pointer pr-10"
                        style={{ borderColor: theme.borderColor, color: theme.textMain, backgroundColor: '#1a1a1a' }}
                      >
                        {activeProvider.models.map(model => (
                          <option key={model.id} value={model.id} style={{ backgroundColor: '#1a1a1a' }}>{model.name}</option>
                        ))}
                        {(settingsStore.customModels?.[activeProviderId] || []).map((customId: string) => (
                          <option key={customId} value={customId} style={{ backgroundColor: '#1a1a1a' }}>{customId} — Custom</option>
                        ))}
                        {activeProviderId !== 'Stockfish' && (
                          <option value="custom_model_input" style={{ backgroundColor: '#1a1a1a' }}>+ Add Custom Model...</option>
                        )}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" style={{ color: theme.textMain }} />
                    </div>
                  )}
                </div>

                {/* API Keys */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold" style={{ color: theme.textMain }}>
                      API Keys <span className="text-red-400">*</span>
                    </label>
                    <button
                      onClick={() => {
                        const newKey: APIKeyEntry = { id: Math.random().toString(36).substring(2, 9), key: '', name: `Key ${(activeConfig.apiKeys?.length || 0) + 1}`, enabled: true };
                        updateConfig('apiKeys', [...(activeConfig.apiKeys || []), newKey]);
                      }}
                      className="flex items-center gap-1 text-[12px] font-medium hover:opacity-80 transition-opacity"
                      style={{ color: theme.accent }}
                    >
                      <Plus size={13} /> Add Key
                    </button>
                  </div>

                  <div className="space-y-2">
                    {activeConfig.apiKeys?.map((k: APIKeyEntry, index: number) => (
                      <div key={k.id} className="rounded-[12px] border flex items-center gap-2 px-3 py-2.5" style={{ borderColor: theme.borderColor, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <input
                          type={showKeyMap[k.id] ? 'text' : 'password'}
                          value={k.key}
                          onChange={(e) => {
                            const newKeys = [...activeConfig.apiKeys];
                            newKeys[index].key = e.target.value;
                            updateConfig('apiKeys', newKeys);
                          }}
                          placeholder={`${activeProvider.name} API Key`}
                          className="flex-1 min-w-0 bg-transparent text-[13px] outline-none placeholder:opacity-30"
                          style={{ color: theme.textMain }}
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => toggleKeyVisibility(k.id)} className="p-1.5 rounded-md opacity-50 hover:opacity-100 hover:bg-white/10 transition-all">
                            {showKeyMap[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => updateConfig('apiKeys', activeConfig.apiKeys.filter((_: any, i: number) => i !== index))}
                            className="p-1.5 rounded-md text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!activeConfig.apiKeys || activeConfig.apiKeys.length === 0) && (
                      <p className="text-[12px] opacity-40 text-center py-3" style={{ color: theme.textMuted }}>No API keys. Tap + Add Key to start.</p>
                    )}
                  </div>
                </div>

                {/* Base URL — Custom only */}
                {activeProviderId === 'Custom' && (
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold" style={{ color: theme.textMain }}>Base URL</label>
                    <input
                      type="text"
                      value={activeConfig.baseUrl}
                      onChange={(e) => updateConfig('baseUrl', e.target.value)}
                      placeholder="https://api.your-provider.com/v1"
                      className="w-full rounded-[12px] border px-4 py-3 text-[13px] outline-none"
                      style={{ borderColor: theme.borderColor, color: theme.textMain, backgroundColor: '#1a1a1a' }}
                    />
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="px-4 pb-5 pt-2 space-y-2.5 border-t mt-2" style={{ borderColor: theme.borderColor }}>
                <button
                  onClick={handleTestConnection}
                  disabled={activeConfig.status === 'testing'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] border text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ borderColor: theme.borderColor, color: theme.textMain, backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  {activeConfig.status === 'testing' ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                  {activeConfig.status === 'testing' ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="w-full flex items-center justify-center py-3.5 rounded-[14px] text-[14px] font-semibold transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(227,193,149,0.25)]"
                  style={{ backgroundColor: theme.accent, color: '#000' }}
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => onCancel ? onCancel() : onClose?.()}
                  className="w-full flex items-center justify-center py-3 rounded-[14px] text-[14px] font-medium transition-all active:scale-[0.98]"
                  style={{ color: theme.textMuted }}
                >
                  Cancel
                </button>
              </div>

            </div>

            {/* --- DESKTOP ONLY ORIGINAL LAYOUT --- */}
            <div className="max-w-2xl mx-auto space-y-4 p-5 sm:p-6 animate-in fade-in duration-150 fill-mode-both hidden md:block" key={`desktop-${activeProviderId}`}>
              {/* Aesthetic Slim Status Card */}
              <div 
                className={`
                  rounded-[16px] border px-5 py-3.5 flex items-center justify-between gap-4 transition-all duration-150 shadow-sm
                  ${activeConfig.status === 'connected' ? 'bg-[#32D74B]/[0.06] border-[#32D74B]/20 shadow-[0_0_15px_rgba(50,215,75,0.05)]' : 
                    activeConfig.status === 'error' ? 'bg-[#FF453A]/[0.06] border-[#FF453A]/20 shadow-[0_0_15px_rgba(255,69,58,0.05)]' : 
                    activeConfig.status === 'testing' ? 'bg-[#E3C195]/[0.06] border-[#E3C195]/20' :
                    'bg-white/[0.02] border-white/5'}
                `}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-widest uppercase opacity-60 flex items-center gap-1.5" style={{ color: theme.textMuted }}>
                    <span>Status</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    {activeConfig.status === 'connected' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#32D74B] shadow-[0_0_10px_rgba(50,215,75,0.8)] animate-pulse shrink-0"></div>
                        <span className="text-[14px] font-semibold text-[#32D74B] tracking-wide">Connected & Verified</span>
                      </>
                    ) : activeConfig.status === 'error' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#FF453A] shadow-[0_0_10px_rgba(255,69,58,0.8)] shrink-0"></div>
                        <span className="text-[14px] font-semibold text-[#FF453A] tracking-wide">Not Connected</span>
                      </>
                    ) : activeConfig.status === 'testing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-[#E3C195] animate-spin shrink-0" />
                        <span className="text-[14px] font-semibold text-[#E3C195] tracking-wide">Verifying Connection...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-white/30 shrink-0"></div>
                        <span className="text-[14px] font-semibold tracking-wide" style={{ color: theme.textMain }}>Not Connected</span>
                      </>
                    )}
                  </div>

                  <div className="text-[12px] opacity-60 truncate" style={{ color: theme.textMain }}>
                    {activeConfig.status === 'connected' 
                      ? (activeConfig.lastTested ? `Successfully tested at ${activeConfig.lastTested}` : 'Successfully tested and ready to use.') 
                      : activeConfig.status === 'error'
                      ? 'Please enter a valid API key to continue.'
                      : activeConfig.status === 'testing'
                      ? 'Testing connection to provider endpoint...'
                      : 'Run a test connection to verify your credentials.'}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <div 
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150
                      ${activeConfig.status === 'connected' ? 'bg-[#32D74B]/15 text-[#32D74B]' : 
                        activeConfig.status === 'error' ? 'bg-[#FF453A]/15 text-[#FF453A]' : 
                        activeConfig.status === 'testing' ? 'bg-[#E3C195]/15 text-[#E3C195]' :
                        'bg-white/5 text-white/30'}
                    `}
                  >
                    {activeConfig.status === 'connected' ? (
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    ) : activeConfig.status === 'error' ? (
                      <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                    ) : activeConfig.status === 'testing' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Top Grid: Provider & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: theme.textMuted }}>
                    Provider
                  </label>
                  <div className="relative group">
                    <select 
                      disabled
                      className="w-full appearance-none rounded-[12px] border px-4 py-2.5 text-[14px] font-medium outline-none opacity-80 cursor-not-allowed transition-all duration-200"
                      style={{ 
                        backgroundColor: theme.inputBg, 
                        borderColor: theme.borderColor, 
                        color: theme.textMain 
                      }}
                    >
                      <option>{activeProvider.name}</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2 min-w-0">
                  <label className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: theme.textMuted }}>
                    Model
                  </label>
                  <div className="relative group min-w-0">
                    {activeConfig.isCustomModel ? (
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={activeConfig.customModelId}
                          onChange={(e) => updateConfig('customModelId', e.target.value)}
                          placeholder="e.g. gpt-4.5-turbo"
                          className="w-full appearance-none rounded-[12px] border px-4 py-2.5 text-[14px] font-medium outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 focus:ring-4 focus:ring-[#E3C195]/10 shadow-inner"
                          style={{ 
                            backgroundColor: theme.inputBg, 
                            borderColor: theme.borderColor, 
                            color: theme.textMain 
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            updateConfig('isCustomModel', false);
                            updateConfig('modelId', activeProvider.models[0].id);
                          }}
                          className="absolute right-2 p-1.5 rounded-md hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4 opacity-70 hover:opacity-100" style={{ color: theme.textMain }} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <select 
                          value={activeConfig.modelId}
                          onChange={(e) => {
                            if (e.target.value === 'custom_model_input') {
                              updateConfig('isCustomModel', true);
                            } else {
                              updateConfig('modelId', e.target.value);
                            }
                          }}
                          className="w-full appearance-none rounded-[12px] border px-4 py-2.5 text-[14px] font-medium outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 focus:ring-4 focus:ring-[#E3C195]/10 cursor-pointer shadow-inner text-ellipsis overflow-hidden whitespace-nowrap"
                          style={{  
                            backgroundColor: theme.inputBg, 
                            borderColor: theme.borderColor, 
                            color: theme.textMain 
                          }}
                        >
                          {activeProvider.models.map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                          {(settingsStore.customModels?.[activeProviderId] || []).map(customId => (
                            <option key={customId} value={customId}>
                              {customId} — Custom
                            </option>
                          ))}
                          {activeProviderId !== 'Stockfish' && (
                            <option value="custom_model_input">+ Add Custom Model...</option>
                          )}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: theme.textMain }} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-bold tracking-widest uppercase opacity-70 border-b pb-2" style={{ color: theme.textMuted, borderColor: theme.borderColor }}>
                  Connection Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-5">
                    <div className="space-y-3 col-span-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: theme.textMuted }}>
                          API Keys <span className="text-red-400">*</span>
                        </label>
                        <button
                          onClick={() => {
                            const newKey: APIKeyEntry = {
                              id: Math.random().toString(36).substring(2, 9),
                              key: '',
                              name: `Key ${(activeConfig.apiKeys?.length || 0) + 1}`,
                              enabled: true
                            };
                            updateConfig('apiKeys', [...(activeConfig.apiKeys || []), newKey]);
                          }}
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest hover:opacity-80 transition-opacity"
                          style={{ color: theme.accent }}
                        >
                          <Plus size={12} /> Add Key
                        </button>
                      </div>

                      <div className="space-y-2">
                        {activeConfig.apiKeys?.map((k: APIKeyEntry, index: number) => (
                          <div key={k.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={k.name}
                              onChange={(e) => {
                                const newKeys = [...activeConfig.apiKeys];
                                newKeys[index].name = e.target.value;
                                updateConfig('apiKeys', newKeys);
                              }}
                              placeholder="Label"
                              className="w-[100px] sm:w-[120px] shrink-0 rounded-[12px] border px-3 py-2.5 text-[12px] outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 shadow-inner placeholder:text-white/20 bg-transparent"
                              style={{ borderColor: theme.borderColor, color: theme.textMain }}
                            />
                            <div className="relative flex-1 group flex items-center">
                              <input 
                                type={showApiKey ? 'text' : 'password'}
                                value={k.key}
                                onChange={(e) => {
                                  const newKeys = [...activeConfig.apiKeys];
                                  newKeys[index].key = e.target.value;
                                  updateConfig('apiKeys', newKeys);
                                }}
                                placeholder="sk-..."
                                className="w-full rounded-[12px] border px-4 py-2.5 text-[14px] outline-none font-mono tracking-wider transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 focus:ring-4 focus:ring-[#E3C195]/10 shadow-inner placeholder:text-white/20"
                                style={{ 
                                  backgroundColor: theme.inputBg, 
                                  borderColor: activeConfig.status === 'error' ? theme.danger : theme.borderColor, 
                                  color: theme.textMain 
                                }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newKeys = [...activeConfig.apiKeys];
                                newKeys[index].enabled = !newKeys[index].enabled;
                                updateConfig('apiKeys', newKeys);
                              }}
                              className={`shrink-0 p-2.5 rounded-xl border transition-all ${k.enabled ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
                              title={k.enabled ? "Disable Key" : "Enable Key"}
                            >
                              <Power size={14} />
                            </button>
                            <button
                              onClick={() => {
                                updateConfig('apiKeys', activeConfig.apiKeys.filter((_: any, i: number) => i !== index));
                              }}
                              className="shrink-0 p-2.5 rounded-xl border border-white/5 bg-white/5 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
                              title="Delete Key"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!activeConfig.apiKeys || activeConfig.apiKeys.length === 0) && (
                          <div className="text-center py-4 text-xs font-medium italic opacity-50" style={{ color: theme.textMuted }}>
                            No API keys added. Add a key to connect.
                          </div>
                        )}
                      </div>
                      
                      {activeProviderId === 'Custom' && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-white/[0.05]">
                          <label className="text-[11px] font-bold tracking-widest uppercase opacity-70 flex justify-between" style={{ color: theme.textMuted }}>
                            <span>Base URL</span>
                            <span className="opacity-50 font-normal">Required</span>
                          </label>
                          <input 
                            type="text"
                            value={activeConfig.baseUrl}
                            onChange={(e) => updateConfig('baseUrl', e.target.value)}
                            placeholder="https://api.your-provider.com/v1"
                            className="w-full rounded-[12px] border px-4 py-2.5 text-[14px] outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 shadow-inner placeholder:text-white/20 bg-black/20"
                            style={{ borderColor: theme.borderColor, color: theme.textMain }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between py-2 border-b border-transparent hover:border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: theme.textMain }} />
                    <span className="text-[13px] font-semibold tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: theme.textMain }}>
                      Advanced Settings
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 opacity-50 group-hover:opacity-100 transition-transform duration-150 ${showAdvanced ? 'rotate-180' : ''}`} 
                    style={{ color: theme.textMain }} 
                  />
                </button>

                {/* Animated Dropdown for Advanced Settings */}
                {showAdvanced && (
                  <div className="flex flex-col gap-6 bg-[#1C1C1E]/50 p-6 rounded-[16px] border border-white/[0.05] animate-in fade-in slide-in-from-top-4 duration-150">
                    
                    {activeProviderId !== 'Custom' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold tracking-widest uppercase opacity-70 flex justify-between" style={{ color: theme.textMuted }}>
                            <span>Base URL</span>
                            <span className="opacity-50 font-normal">Optional</span>
                          </label>
                          <input 
                            type="text"
                            value={activeConfig.baseUrl}
                            onChange={(e) => updateConfig('baseUrl', e.target.value)}
                            placeholder={activeProvider.defaultBaseUrl}
                            className="w-full rounded-[12px] border px-4 py-2.5 text-[14px] outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 shadow-inner placeholder:text-white/20 bg-black/20"
                            style={{ borderColor: theme.borderColor, color: theme.textMain }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold tracking-widest uppercase opacity-70 flex justify-between" style={{ color: theme.textMuted }}>
                            <span>Organization ID</span>
                            <span className="opacity-50 font-normal">Optional</span>
                          </label>
                          <input 
                            type="text"
                            value={activeConfig.orgId}
                            onChange={(e) => updateConfig('orgId', e.target.value)}
                            placeholder="org_..."
                            className="w-full rounded-[12px] border px-4 py-2.5 text-[14px] outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 shadow-inner placeholder:text-white/20 bg-black/20"
                            style={{ borderColor: theme.borderColor, color: theme.textMain }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: theme.textMuted }}>
                        Max Tokens
                      </label>
                      <div className="relative group">
                        <select 
                          value={activeConfig.maxTokens}
                          onChange={(e) => updateConfig('maxTokens', e.target.value)}
                          className="w-full appearance-none rounded-[12px] border px-4 py-3 text-[14px] font-medium outline-none transition-all duration-200 hover:border-white/20 focus:border-[#E3C195]/50 focus:ring-4 focus:ring-[#E3C195]/10 cursor-pointer shadow-inner bg-black/20"
                          style={{ 
                            borderColor: theme.borderColor, 
                            color: theme.textMain 
                          }}
                        >
                          <option value="1024">1024</option>
                          <option value="2048">2048</option>
                          <option value="4096">4096 (Recommended)</option>
                          <option value="8192">8192</option>
                          <option value="16384">16384</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: theme.textMain }} />
                      </div>
                    </div>

                    <div className="space-y-5 pt-4 border-t border-white/[0.05]">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: theme.textMuted }}>
                          Temperature
                        </label>
                        <div className="text-[12px] font-mono font-medium px-2 py-0.5 rounded bg-black/40" style={{ color: theme.accent }}>
                          {activeConfig.temperature.toFixed(2)}
                        </div>
                      </div>
                      <div className="relative flex items-center pt-1">
                        <input 
                          type="range" 
                          min="0" 
                          max="2" 
                          step="0.01"
                          value={activeConfig.temperature}
                          onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-[#2C2C2E] rounded-full appearance-none cursor-pointer outline-none transition-all duration-200 hover:h-2"
                          style={{ 
                            background: `linear-gradient(to right, ${theme.accent} ${(activeConfig.temperature/2)*100}%, #2C2C2E ${(activeConfig.temperature/2)*100}%)`
                          }}
                        />
                        <style>{`
                          input[type='range']::-webkit-slider-thumb {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            background: #fff;
                            border: 2px solid ${theme.accent};
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 12px rgba(227,193,149,0.4);
                            transition: transform 0.1s;
                          }
                          input[type='range']::-webkit-slider-thumb:hover {
                            transform: scale(1.15);
                          }
                          input[type='range']::-webkit-slider-thumb:active {
                            transform: scale(0.95);
                            background: ${theme.accent};
                          }
                        `}</style>
                      </div>
                      <div className="flex justify-between text-[10px] opacity-40 font-medium uppercase tracking-wider mt-1" style={{ color: theme.textMain }}>
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>



            </div>
          </div>
        </div>

        <div 
          className="flex flex-col-reverse sm:flex-row items-center justify-between px-7 py-5 relative z-20 backdrop-blur-md gap-4"
          style={{ 
            backgroundColor: 'rgba(20, 20, 21, 0.85)', 
            borderTop: `1px solid ${theme.borderColor}`
          }}
        >
          <button 
            onClick={() => onCancel ? onCancel() : onClose?.()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-200 hover:bg-white/10 active:scale-95 border border-white/[0.08]"
            style={{ color: theme.textMain }}
          >
            Cancel
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={handleTestConnection}
              disabled={activeConfig.status === 'testing'}
              className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-200 hover:bg-white/10 active:scale-95 border border-white/[0.08] disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              style={{ color: theme.textMain }}
            >
              {activeConfig.status === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
              Test Connection
            </button>
            
            <button 
              onClick={handleSaveConfig}
              className="w-full sm:w-auto justify-center px-7 py-2.5 rounded-[12px] text-[14px] font-semibold transition-all duration-200 hover:brightness-110 active:scale-95 shadow-[0_4px_14px_rgba(227,193,149,0.25)] hover:shadow-[0_6px_20px_rgba(227,193,149,0.35)]"
              style={{ 
                backgroundColor: theme.accent, 
                color: '#000000' 
              }}
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
