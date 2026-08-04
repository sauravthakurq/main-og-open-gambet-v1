'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { Toast } from './Toast';

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
