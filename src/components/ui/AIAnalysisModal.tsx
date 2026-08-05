'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAISettingsStore } from '@/store/useAISettingsStore';
import { useAnalysisStore, AIAnalysisResult } from '@/store/useAnalysisStore';
import { X, Sparkles, BrainCircuit, Target, TrendingUp, AlertTriangle, ShieldAlert, CheckCircle, Zap, Shield, Crown } from 'lucide-react';
import { useErrorStore } from '@/store/useErrorStore';

interface AIAnalysisModalProps {
  pgn: string;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ pgn, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  
  const { provider, model, apiKeys, baseUrls, organizations } = useAISettingsStore();
  const { fetchAnalysis } = useAnalysisStore();
  const { dispatchError } = useErrorStore();

  useEffect(() => {
    let isMounted = true;

    const performAnalysis = async () => {
      try {
        const apiKey = apiKeys[provider]?.[0]?.key || '';
        const baseUrl = baseUrls[provider] || '';
        const organization = organizations[provider] || '';

        const data = await fetchAnalysis({
          pgn,
          provider,
          model,
          apiKey,
          baseUrl,
          organization
        });

        if (isMounted) {
          setAnalysis(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Analysis Error:', err);
          setLoading(false);
          dispatchError({
            category: 'AI',
            title: 'Analysis Failed',
            message: 'Unable to complete game analysis. Please check your API key and connection.',
            developerDetails: { stackTrace: err.message, provider, model, timestamp: new Date().toISOString() },
            actions: [{ label: 'Close', primary: true, onClick: onClose }]
          });
          onClose();
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
    };
  }, [pgn, provider, model, apiKeys, baseUrls, organizations, dispatchError, onClose, fetchAnalysis]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center border border-[var(--color-accent)]/30 shadow-[0_0_15px_rgba(225,170,83,0.2)]">
                <BrainCircuit className="text-[var(--color-accent)]" size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Post-Game Analysis</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">
                    {loading ? 'Analyzing...' : `Powered by ${provider} (${model})`}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative">
            {loading ? (
              <AnalysisSkeleton />
            ) : analysis ? (
              <AnalysisReport analysis={analysis} />
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==========================================
// Loading Skeleton
// ==========================================
function AnalysisSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="h-32 bg-white/5 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-48 bg-white/5 rounded-2xl border border-white/5" />
      </div>
      <div className="h-40 bg-white/5 rounded-2xl border border-white/5" />
      <div className="h-64 bg-white/5 rounded-2xl border border-white/5" />
    </div>
  );
}

// ==========================================
// Rich Report Components
// ==========================================
function AnalysisReport({ analysis }: { analysis: AIAnalysisResult }) {
  const {
    gameSummary, openingDetection, whiteAccuracy, blackAccuracy,
    moveClassifications, criticalTurningPoint, tacticalOpportunities,
    strategicSuggestions, endgameEvaluation, aiCoachSummary, overallGameRating,
    estimatedEloPerformance, personalizedImprovementTips
  } = analysis;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Game Summary Hero */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent border border-[var(--color-accent)]/20 overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
          <Crown size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-[var(--color-accent)]" size={18} />
            <h3 className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-widest">Game Summary</h3>
          </div>
          <p className="text-lg text-white/90 leading-relaxed font-medium">{gameSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accuracies */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Accuracy</h3>
          <AccuracyBar label="White" value={whiteAccuracy} color="bg-white" />
          <AccuracyBar label="Black" value={blackAccuracy} color="bg-[#333]" textColor="text-white" />
          <div className="mt-2 text-xs text-white/40 flex justify-between">
            <span>Opening: {openingDetection}</span>
            <span>Performance: W {estimatedEloPerformance.white} | B {estimatedEloPerformance.black}</span>
          </div>
        </div>

        {/* Move Classifications */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Moves Breakdown</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <MoveBadge label="Brilliant" count={moveClassifications.brilliant} color="bg-cyan-500" />
            <MoveBadge label="Great" count={moveClassifications.great} color="bg-blue-500" />
            <MoveBadge label="Best" count={moveClassifications.best} color="bg-emerald-500" />
            <MoveBadge label="Inaccuracy" count={moveClassifications.inaccuracy} color="bg-yellow-500" />
            <MoveBadge label="Mistake" count={moveClassifications.mistake} color="bg-orange-500" />
            <MoveBadge label="Blunder" count={moveClassifications.blunder} color="bg-red-500" />
            <MoveBadge label="Missed Win" count={moveClassifications.missedWin} color="bg-pink-500" />
          </div>
        </div>
      </div>

      {/* Critical Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard icon={<Target size={18} />} title="Critical Turning Point" content={criticalTurningPoint} color="text-orange-400" />
        <InsightCard icon={<Zap size={18} />} title="Tactical Opportunities" content={tacticalOpportunities} color="text-yellow-400" />
        <InsightCard icon={<Shield size={18} />} title="Strategic Suggestions" content={strategicSuggestions} color="text-emerald-400" />
        <InsightCard icon={<ShieldAlert size={18} />} title="Endgame Evaluation" content={endgameEvaluation} color="text-blue-400" />
      </div>

      {/* Coach & Tips */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Coach Summary</h3>
            <p className="text-sm text-white/50">Overall Rating: {overallGameRating}</p>
          </div>
        </div>
        
        <p className="text-white/80 leading-relaxed text-sm md:text-base italic">"{aiCoachSummary}"</p>
        
        <div className="flex flex-col gap-3 mt-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Improvement Tips</h4>
          <ul className="flex flex-col gap-2">
            {personalizedImprovementTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// Helper Components
// ==========================================
function AccuracyBar({ label, value, color, textColor = 'text-black' }: { label: string, value: number, color: string, textColor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm font-bold text-white/80">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${value}%` }} 
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function MoveBadge({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/5">
      <span className="text-xl font-black text-white">{count}</span>
      <div className="flex items-center gap-1.5 mt-1">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 truncate max-w-full">{label}</span>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, content, color }: { icon: React.ReactNode, title: string, content: string, color: string }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <h4 className="text-sm font-bold uppercase tracking-widest text-white/70">{title}</h4>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{content}</p>
    </div>
  );
}
