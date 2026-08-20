import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'About Open Gambit | AI Chess Platform',
  description: 'Open Gambit explores the conversation between human strategy and machine intelligence on one board.',
};

export default function AboutPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">About {siteConfig.name}</h1>
        <p className="text-white/50 text-sm font-medium">Where every move matters.</p>
      </div>

      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-8 mt-4 leading-relaxed font-medium">
        <section>
          <p>
            Chess has always been a conversation between human intelligence and the board.
          </p>
          <p className="mt-4">
            Open Gambit explores what happens when that conversation expands to modern artificial intelligence. We built this platform not just as a game, but as an environment to explore the boundaries between human strategy and machine reasoning.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">What We Build</h2>
          <p>
            Open Gambit is an AI-native chess platform where users can:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Challenge frontier AI models (GPT, Claude, Gemini, DeepSeek).</li>
            <li>Play against local and traditional chess engines like Stockfish.</li>
            <li>Compete against other humans in real-time online matches.</li>
            <li>Analyze completed games to understand critical mistakes and missed opportunities.</li>
            <li>Interact with Gambit AI, a coach that understands strategic patterns.</li>
            <li>Watch state-of-the-art language models battle in AI-vs-AI spectator mode.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Our Philosophy</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="block text-[var(--color-accent)] font-bold tracking-widest uppercase text-sm mb-2">Human Strategy.</span>
            <span className="block text-[var(--color-accent)] font-bold tracking-widest uppercase text-sm mb-2">Machine Intelligence.</span>
            <span className="block text-[var(--color-accent)] font-bold tracking-widest uppercase text-sm">One Board.</span>
          </div>
        </section>

        <hr className="border-white/10 my-10" />

        <section className="bg-black/40 border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] mb-4">Engineering & Architecture</h2>
          <h3 className="text-xl font-bold text-white mb-2">Built by {siteConfig.creator}</h3>
          <p className="mb-6 text-sm text-white/60">
            Saurav Thakur is an AI Engineer, Agentic AI & RAG Specialist, and Full-Stack Developer specializing in production-grade AI systems, multi-agent orchestration, and interface engineering.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href={siteConfig.links.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">Portfolio</a>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">LinkedIn</a>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">GitHub</a>
            <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">X (Twitter)</a>
            <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">YouTube</a>
          </div>
        </section>
      </div>
    </>
  );
}
