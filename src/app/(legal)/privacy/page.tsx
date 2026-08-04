import React from 'react';

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-white/50 mb-8">Last updated: August 4, 2026</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h2>
          <p>
            We collect minimal personal data necessary to provide you with the Open Gambit experience. 
            When you sign in via Google Authentication, we store your basic profile information (email, name, profile picture).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Chess Data & AI Conversations</h2>
          <p>
            Your game history, analysis requests, and interactions with AI models are stored securely in our database. 
            When querying third-party AI APIs (e.g., OpenAI, Anthropic, Google), we transmit the board state (FEN/PGN) and your messages. 
            We do not share personally identifiable information with these AI providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Local Storage & Device Information</h2>
          <p>
            Open Gambit utilizes local storage, IndexedDB, and cache API to power offline experiences, Progressive Web App features, and to store your AI API keys securely on your device. 
            Your API keys are never transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Data Retention & User Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data at any time. 
            To delete your account and all associated data, please use the Delete Account option in the Settings menu or contact support.
          </p>
        </section>
      </div>
    </>
  );
}
