import React from 'react';

export const metadata = { title: 'FAQ | Open Gambit' };

export default function FAQPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-6 mt-8">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-bold text-white mb-2">What is BYOK?</h3>
          <p className="text-sm text-white/60 leading-relaxed">BYOK stands for Bring Your Own Key. Instead of paying a subscription, you provide your own API keys for OpenAI, Anthropic, or Google. This allows you to play against the world's best models at cost price.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-bold text-white mb-2">Are my API keys secure?</h3>
          <p className="text-sm text-white/60 leading-relaxed">Yes. By default, your keys are stored exclusively in your browser's local storage and are never sent to our database. Read our Security page for more details.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-bold text-white mb-2">Can I play completely offline?</h3>
          <p className="text-sm text-white/60 leading-relaxed">Yes. If you install Open Gambit as a PWA, you can use the built-in Stockfish engine or Local Ollama integration to play completely offline without an internet connection.</p>
        </div>
      </div>
    </>
  );
}
