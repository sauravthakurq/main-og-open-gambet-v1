import React from 'react';

export const metadata = { title: 'Fair Play Policy | Open Gambit' };

export default function FairPlayPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Fair Play Policy</h1>
        <p className="text-white/40 text-sm font-medium">Rules of engagement on Open Gambit.</p>
      </div>
      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6">
        <p>Open Gambit is an AI-native platform. Because we combine human gameplay with machine intelligence, our rules regarding AI assistance are specific to the game mode you are playing.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Allowed Behavior</h2>
        <ul className="list-disc pl-5">
          <li>Using AI assistance during designated AI-training or learning modes.</li>
          <li>Playing against AI models or local engines.</li>
          <li>Analyzing completed games with Gambit Coach or Stockfish.</li>
          <li>Running AI-vs-AI matches in spectator mode.</li>
        </ul>
        <h2 className="text-xl font-bold text-red-400 mt-8 mb-4">Strictly Prohibited</h2>
        <p>During <strong>competitive human multiplayer matches</strong>, the following actions are strictly forbidden:</p>
        <ul className="list-disc pl-5">
          <li>Using chess engines, LLMs, or any external software to determine your moves.</li>
          <li>Receiving move suggestions from other players.</li>
          <li>Exploiting bugs to manipulate the clock or game state.</li>
          <li>Intentionally abandoning games or stalling the clock to frustrate opponents.</li>
        </ul>
      </div>
    </>
  );
}
