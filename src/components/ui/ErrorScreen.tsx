import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, ServerCrash, RefreshCcw } from 'lucide-react';

interface ErrorScreenProps {
  type?: 'offline' | '404' | 'server' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

const ERROR_CONFIG = {
  offline: {
    icon: WifiOff,
    defaultTitle: 'No Internet Connection',
    defaultMessage: 'Please check your network settings and try again.',
  },
  '404': {
    icon: AlertTriangle,
    defaultTitle: 'Page Not Found',
    defaultMessage: 'The room or page you are looking for does not exist or has expired.',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Server Error',
    defaultMessage: 'We are experiencing some technical difficulties. Please try again later.',
  },
  generic: {
    icon: AlertTriangle,
    defaultTitle: 'Unexpected Error',
    defaultMessage: 'Something went wrong on our end. We have logged the issue.',
  },
};

export function ErrorScreen({ type = 'generic', title, message, onRetry, onHome }: ErrorScreenProps) {
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141415] text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)]">
          <Icon className="w-10 h-10 text-white/30" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">
          {title || config.defaultTitle}
        </h1>
        
        <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-[320px]">
          {message || config.defaultMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-accent)] text-black font-semibold hover:bg-[#c9a77e] transition-transform active:scale-95"
            >
              <RefreshCcw size={16} />
              Try Again
            </button>
          )}
          {onHome && (
            <button
              onClick={onHome}
              className="px-8 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-transform active:scale-95"
            >
              Return Home
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
