import React from 'react';

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-white/50 mb-8">Last updated: August 4, 2026</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. User Accounts</h2>
          <p>
            By creating an account on Open Gambit, you agree to provide accurate and complete information. 
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. AI Usage & Fair Play Policy</h2>
          <p>
            Open Gambit integrates powerful AI models (such as GPT-4o, Claude 3.5, Gemini 1.5) for analysis and computer matches. 
            However, cheating against human players using external engines or the built-in AI is strictly prohibited. 
            Violations of our Anti-Cheating Policy will result in immediate account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Community Rules</h2>
          <p>
            We expect all users to maintain a respectful and welcoming environment. 
            Abuse, harassment, spam, and illegal content are strictly forbidden. 
            We reserve the right to moderate, suspend, or terminate accounts that violate these guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            Open Gambit and its original content, features, and functionality are owned by the Open Gambit team. 
            You may not reproduce, distribute, or create derivative works without prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            Open Gambit is provided "as is" and "as available". We make no warranties, expressed or implied, 
            and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
        </section>
      </div>
    </>
  );
}
