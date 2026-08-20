import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Privacy Policy | Open Gambit',
  description: 'How Open Gambit handles your data, API keys, and gameplay information.',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Privacy Policy</h1>
        <p className="text-white/40 text-sm font-medium">Last updated: {siteConfig.legal.lastUpdated} &middot; Version: {siteConfig.legal.version}</p>
      </div>

      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6 leading-relaxed font-medium">
        <section>
          <p>
            This Privacy Policy explains how {siteConfig.name} handles your information when you use our chess platform. We have engineered our application to prioritize local execution and data minimization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. API Keys & AI Providers</h2>
          <p>Open Gambit allows you to play against advanced AI models by providing your own API keys (Bring Your Own Key). We handle these keys securely:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Local Storage (Default):</strong> By default, your API keys remain on your device in your browser's local storage. They are sent directly from your browser to the respective AI provider (OpenAI, Anthropic, Google, etc.) or our secure edge proxy. We do not store them on our servers.</li>
            <li><strong>Cloud Synchronization (Optional):</strong> If you choose to sign in and explicitly enable cloud sync, your API keys and settings will be securely synchronized to your account via Firebase. This allows you to access your configurations across devices.</li>
            <li><strong>Local AI:</strong> If you use local models (e.g., via Ollama), all data remains strictly on your local machine and never leaves your network.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Authentication & Account Information</h2>
          <p>
            When you sign in using Google, we receive basic profile information (such as your name and email address) to create your account and provide cloud synchronization services. If you play as a Guest, a temporary session is created locally without capturing personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Gameplay Data</h2>
          <p>
            We process your chess moves to evaluate positions, run the chess engine, and facilitate online multiplayer matches. Completed games may be temporarily retained to provide post-game AI analysis and coaching.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Cookies and Local Storage</h2>
          <p>
            We use local storage and essential cookies to maintain your session, store your visual preferences (like 2D/3D board view), and persist your game state.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Data Deletion</h2>
          <p>
            You can clear your local cache at any time from the Settings menu, which will immediately remove all locally stored data, preferences, and API keys. If you have an authenticated account, you can request full account deletion by contacting support.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please reach out via our <a href="/contact" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">Contact page</a>.
          </p>
        </section>
      </div>
    </>
  );
}
