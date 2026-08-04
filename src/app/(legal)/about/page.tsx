import React from 'react';

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">About Open Gambit</h1>
      <p className="text-white/50 mb-8">The ultimate premium AI-powered chess OS.</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Our Mission</h2>
          <p>
            Open Gambit was built to push the boundaries of how we learn, analyze, and play chess. 
            By integrating state-of-the-art AI models seamlessly into a premium interface, we aim to provide the most advanced chess experience available on the web and mobile.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Features</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>AI Analysis:</strong> Deep conversational analysis with GPT-4o, Claude 3.5, and Gemini 1.5.</li>
            <li><strong>Local Engine:</strong> Powerful browser-based Stockfish evaluation.</li>
            <li><strong>AI vs AI:</strong> Watch state-of-the-art language models battle it out on the chessboard.</li>
            <li><strong>Watch Live:</strong> Follow top GM games and official Lichess broadcasts in real-time.</li>
            <li><strong>Premium Design:</strong> A beautiful, distraction-free environment inspired by modern application design.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Version & Tech Stack</h2>
          <p>
            <strong>Version:</strong> 0.1.0-alpha<br />
            Built with Next.js, React, Zustand, Framer Motion, and Tailwind CSS.
          </p>
        </section>
      </div>
    </>
  );
}
