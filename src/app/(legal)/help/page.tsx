import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Help Center | Open Gambit' };

export default function HelpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Help Center</h1>
        <p className="text-white/40 text-sm font-medium">How to use Open Gambit.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Playing Chess</h2>
          <ul className="space-y-3 text-sm text-white/60">
            <li>How do I start a game?</li>
            <li>How do I choose an AI?</li>
            <li>How do time controls work?</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">AI & API Keys</h2>
          <ul className="space-y-3 text-sm text-white/60">
            <li>What is BYOK (Bring Your Own Key)?</li>
            <li>How are my keys stored securely?</li>
            <li>How do I setup Local AI?</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/faq" className="inline-block py-3 px-6 rounded-xl bg-[var(--color-accent)] text-black font-bold hover:brightness-110 transition-all">
          View all Frequently Asked Questions
        </Link>
      </div>
    </>
  );
}
