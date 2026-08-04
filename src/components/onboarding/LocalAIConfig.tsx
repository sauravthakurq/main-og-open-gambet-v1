import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LocalAIConfigProps {
  onBack: () => void;
  onNext: (model: string) => void;
}

export default function LocalAIConfig({ onBack, onNext }: LocalAIConfigProps) {
  const [models, setModels] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/local/ollama');
      if (!res.ok) throw new Error('Ollama not running');
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        const modelNames = data.models.map((m: any) => m.name);
        setModels(modelNames);
        setSelected(modelNames[0]);
      } else {
        setError('No models found. Please pull a model using Ollama.');
      }
    } catch (err) {
      setError('Could not connect to Ollama. Make sure it is installed and running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="w-full text-center max-w-[600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
        >
          <span>←</span> Back
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white">Local AI Connection</h1>
        <div className="w-[84px]"></div>
      </div>

      <div className="flex flex-col items-center bg-white/[0.02] border border-white/10 p-8 rounded-2xl mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${error ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'}`}>
          {error ? '❌' : (loading ? '⏳' : '✅')}
        </div>
        
        {loading && <p className="text-slate-400">Detecting local Ollama instance...</p>}
        
        {error && (
          <div className="text-center">
            <h3 className="text-red-400 font-bold mb-2">Connection Failed</h3>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <button 
              onClick={fetchModels}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="w-full text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Available Models</label>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {models.map(m => (
                <button
                  key={m}
                  onClick={() => setSelected(m)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selected === m ? 'bg-white/10 border-white/20 shadow-md' : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className={`font-semibold ${selected === m ? 'text-white' : 'text-slate-300'}`}>{m}</span>
                  {selected === m && <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div>}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => onNext(selected)}
              className="w-full py-4 rounded-xl bg-orange-500 text-black font-bold text-lg hover:bg-orange-400 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] mt-8"
            >
              Select & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
