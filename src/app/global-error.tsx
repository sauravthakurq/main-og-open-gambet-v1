'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0a0a0c] text-white antialiased min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#e1aa53] selection:text-black relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-500/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#e1aa53]/10 blur-[100px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-md bg-[#141414] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Fatal Error</h2>
            <p className="text-sm text-white/50 mb-8 max-w-sm">
              The application encountered an unrecoverable error. Please reload the page.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 px-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
