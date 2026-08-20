import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Changelog | Open Gambit' };

export default function ChangelogPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Changelog</h1>
        <p className="text-white/40 text-sm font-medium">Recent updates to {siteConfig.name}.</p>
      </div>
      <div className="relative border-l border-white/10 pl-6 ml-3 mt-8">
        <div className="mb-10 relative">
          <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] ring-4 ring-black"></div>
          <span className="text-[var(--color-accent)] font-mono text-sm font-bold mb-2 block">{siteConfig.version} (Current)</span>
          <h2 className="text-xl font-bold text-white mb-3">The Premium Foundation Update</h2>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li>Complete visual overhaul with premium dark theme and glassmorphism.</li>
            <li>Introduced Gambit AI Coach integration.</li>
            <li>Added Support for GPT-4o, Claude 3.5, and Gemini 1.5 via BYOK.</li>
            <li>Integrated Local Ollama support for private inference.</li>
            <li>Added comprehensive Legal, Security, and Support pages.</li>
            <li>Fixed mobile scrolling and PWA installation prompt behavior.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
