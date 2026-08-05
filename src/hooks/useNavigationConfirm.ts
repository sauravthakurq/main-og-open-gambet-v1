import { useAppStore } from '@/store/useAppStore';
import { useModalStore } from '@/store/useModalStore';
import { useGameStore } from '@/store/useGameStore';

export function useNavigationConfirm() {
  const { appState, setAppState } = useAppStore();
  const { showModal } = useModalStore();
  const { resetGame } = useGameStore();

  const handleNavigation = (onConfirm: () => void) => {
    // If we are currently in an active game, we must prompt the user
    if (appState === 'playing') {
      showModal({
        title: 'Leave Current Game?',
        message: 'You currently have an active game. What would you like to do?',
        primaryAction: {
          label: 'Leave Game',
          destructive: true,
          onClick: () => {
            // Clean up game session
            // Stop timers, cancel AI requests, close multiplayer etc.
            import('@/store/useEngineStore').then(({ useEngineStore }) => {
              useEngineStore.getState().cancelAIRequest();
            });
            import('@/store/useOnlineStore').then(({ useOnlineStore }) => {
              useOnlineStore.getState().clearOnlineSession();
            });
            resetGame();
            setAppState('onboarding');
            // Execute the intended navigation
            onConfirm();
          },
        },
        secondaryAction: {
          label: 'Continue Playing',
        }
      });
    } else {
      // Not in a game, navigate immediately
      onConfirm();
    }
  };

  return handleNavigation;
}
