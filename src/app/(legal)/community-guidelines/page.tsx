import React from 'react';

export default function CommunityGuidelinesPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Community Guidelines</h1>
      <p className="text-white/50 mb-8">Last updated: August 4, 2026</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Welcome to Open Gambit</h2>
          <p>
            Our community is built on mutual respect and a shared passion for chess. 
            To maintain a positive environment for everyone, we ask that you follow these guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Fair Play</h2>
          <p>
            Chess is a game of skill and intellect. When playing online against other human players:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Do not use external chess engines, AI models, or tablebases to assist your moves.</li>
            <li>Do not purposely stall or abort games to avoid losing.</li>
            <li>Do not artificially manipulate your rating (sandbagging).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Respectful Behavior</h2>
          <p>
            Treat your opponents and fellow community members with respect. 
            Harassment, hate speech, threats, and toxic behavior will not be tolerated and will lead to an immediate ban.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Reporting Violations</h2>
          <p>
            If you encounter a user who is cheating or behaving inappropriately, please report them using the in-game reporting tool or contact our support team. 
            We review all reports and take appropriate action to maintain the integrity of our community.
          </p>
        </section>
      </div>
    </>
  );
}
