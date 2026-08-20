import React from 'react';

export const metadata = { title: 'Community Guidelines | Open Gambit' };

export default function CommunityPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Community Guidelines</h1>
      </div>
      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6">
        <p>We are building a community centered around the love of chess and the exploration of artificial intelligence. To maintain a welcoming environment, we require all players to adhere to these standards.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Respect and Sportsmanship</h2>
        <p>Treat your opponents with respect. Harassment, hate speech, threats, and abusive language in chat or usernames will result in immediate account suspension.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">No Spam</h2>
        <p>Do not use the platform to distribute spam, malicious links, or unauthorized advertisements.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Reporting</h2>
        <p>If you encounter a player violating these guidelines, please report them using the in-game reporting tool or by contacting support.</p>
      </div>
    </>
  );
}
