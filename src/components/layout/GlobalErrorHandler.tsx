'use client';

import React, { useEffect } from 'react';
import { useErrorStore } from '@/store/useErrorStore';
import { GlobalErrorModal } from '@/components/ui/GlobalErrorModal';

export function GlobalErrorHandler() {
  const { dispatchError } = useErrorStore();

  useEffect(() => {
    // 1. Catch unhandled promise rejections (often API timeouts/fetch failures)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault(); // Prevent default console error flooding
      
      const reason = event.reason;
      const message = reason?.message || String(reason);
      
      // Attempt to auto-categorize network/fetch errors
      if (message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network') || !navigator.onLine) {
        dispatchError({
          category: 'Network',
          title: 'Network Connection Lost',
          message: 'Please check your internet connection and try again.',
          developerDetails: {
            internalErrorType: 'UnhandledPromiseRejection',
            timestamp: new Date().toISOString(),
            stackTrace: reason?.stack
          },
          actions: [{ label: 'Dismiss', onClick: () => {} }]
        });
        return;
      }

      dispatchError({
        category: 'Critical',
        title: 'Unexpected Error',
        message: 'An unexpected application error occurred.',
        developerDetails: {
          internalErrorType: 'UnhandledPromiseRejection',
          timestamp: new Date().toISOString(),
          errorCode: message,
          stackTrace: reason?.stack
        },
        actions: [{ label: 'Dismiss', onClick: () => {} }]
      });
    };

    // 2. Catch generic uncaught exceptions (React runtime errors outside boundary)
    const handleWindowError = (event: ErrorEvent) => {
      // Don't intercept resize observer loop limits as they are benign
      if (event.message.includes('ResizeObserver')) return;

      dispatchError({
        category: 'System',
        title: 'Application Error',
        message: 'The application encountered an unexpected issue.',
        developerDetails: {
          internalErrorType: 'WindowError',
          timestamp: new Date().toISOString(),
          errorCode: event.message,
          stackTrace: event.error?.stack
        },
        actions: [{ label: 'Reload Page', primary: true, onClick: () => window.location.reload() }, { label: 'Dismiss', onClick: () => {} }]
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleWindowError);
    };
  }, [dispatchError]);

  return <GlobalErrorModal />;
}
