'use client';

import { useEffect } from 'react';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useToastStore } from '@/store/useToastStore';
import { usePathname } from 'next/navigation';

let lastBackPressTime = 0;

export const useAndroidBack = (
  modalId?: string, 
  onClose?: () => void,
  isOpen?: boolean
) => {
  const { pushModal, removeModal, openModals } = useNavigationStore();
  const pathname = usePathname();

  // If this hook is used in a specific modal component
  useEffect(() => {
    if (!modalId) return;

    if (isOpen) {
      pushModal(modalId);
      // Push state to browser history to trap the back button
      window.history.pushState({ modalId }, '');
    } else {
      removeModal(modalId);
    }

    return () => {
      removeModal(modalId);
    };
  }, [isOpen, modalId, pushModal, removeModal]);

  // Global listener for popstate
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are managing a specific modal and it's not open, ignore
      if (modalId && !isOpen) return;

      const currentOpenModals = useNavigationStore.getState().openModals;

      // If this component is managing a modal and it's the topmost one
      if (modalId && isOpen && currentOpenModals[currentOpenModals.length - 1] === modalId) {
        // Prevent default back navigation
        if (onClose) {
          onClose();
        }
        removeModal(modalId);
        return;
      }

      // If it's the global hook (no modalId provided) and we're on the home screen
      if (!modalId && pathname === '/' && currentOpenModals.length === 0) {
        const currentTime = new Date().getTime();
        
        if (currentTime - lastBackPressTime < 2000) {
          // Exit the app if it's a PWA or TWA
          // window.close() usually doesn't work, but we can try to go back to origin or close
          if ((navigator as any).app) {
             (navigator as any).app.exitApp();
          } else {
             window.location.href = 'https://ogopengambit.vercel.app';
          }
        } else {
          lastBackPressTime = currentTime;
          useToastStore.getState().addToast({ title: "Press back again to exit", type: 'info' });
          
          // Push state again so we don't actually leave the page
          window.history.pushState(null, '');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // If global hook on home, push a state so we can catch the very first back press
    if (!modalId && pathname === '/') {
      window.history.pushState(null, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [modalId, isOpen, onClose, pathname, removeModal]);
};
