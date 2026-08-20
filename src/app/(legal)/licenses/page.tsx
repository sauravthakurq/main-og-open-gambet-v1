import React from 'react';

export const metadata = { title: 'Open Source Licenses | Open Gambit' };

export default function LicensesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Open Source & Licenses</h1>
      </div>
      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6">
        <p>Open Gambit is made possible by the incredible open-source community. We gratefully acknowledge the following core technologies:</p>
        <ul className="list-disc pl-5 mt-4">
          <li><strong>Stockfish:</strong> The powerful open-source chess engine (GPL).</li>
          <li><strong>chess.js:</strong> Chess logic and PGN parsing (MIT).</li>
          <li><strong>Next.js & React:</strong> Frontend architecture and UI framework (MIT).</li>
          <li><strong>Tailwind CSS:</strong> Utility-first styling (MIT).</li>
          <li><strong>Framer Motion:</strong> Animation library (MIT).</li>
          <li><strong>Zustand:</strong> State management (MIT).</li>
          <li><strong>Lucide React:</strong> Iconography (ISC).</li>
        </ul>
        <p className="mt-8 text-sm text-white/40">Full dependency lists can be found in our repository's package.json.</p>
      </div>
    </>
  );
}
