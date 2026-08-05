'use client';

/**
 * GlobalWorkspaces — client-only wrapper that mounts GambitAIWorkspace and
 * LearningWorkspace at the root of the app so they are always present in the
 * DOM regardless of which screen (onboarding, game, game_over) is active.
 *
 * This is the canonical fix for the Bug 3: "Learn / Gambit AI popups invisible
 * during a game" — previously these were rendered inside HomeNavbar which returns
 * null when appState === 'playing'.
 */

import { GambitAIWorkspace } from '@/components/ai/GambitAIWorkspace';
import { LearningWorkspace } from '@/components/learning/LearningWorkspace';
import { GlobalErrorHandler } from '@/components/layout/GlobalErrorHandler';

export function GlobalWorkspaces() {
  return (
    <>
      <GlobalErrorHandler />
      <GambitAIWorkspace />
      <LearningWorkspace />
    </>
  );
}
