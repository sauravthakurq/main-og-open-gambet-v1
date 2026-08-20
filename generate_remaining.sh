#!/bin/bash

# Cookies
cat << 'INNER_EOF' > src/app/\(legal\)/cookies/page.tsx
import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = { title: 'Cookie Policy | Open Gambit' };

export default function CookiesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Cookie Policy</h1>
      </div>
      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6">
        <p>Open Gambit uses minimal cookies and local storage exclusively for essential platform functionality.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Essential Storage</h2>
        <p>We use browser Local Storage to securely save your API keys, visual preferences (2D/3D board), sound settings, and recent game states. We use secure cookies to maintain your authentication session if you choose to sign in.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">No Advertising</h2>
        <p>We do not use tracking cookies, cross-site trackers, or advertising cookies. Your data is not sold to third parties.</p>
      </div>
    </>
  );
}
INNER_EOF

# Contact
cat << 'INNER_EOF' > src/app/\(legal\)/contact/page.tsx
import React from 'react';
import { siteConfig } from '@/config/site';
import { MessageSquare, Bug, Shield, Briefcase } from 'lucide-react';

export const metadata = { title: 'Contact | Open Gambit' };

export default function ContactPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Contact Us</h1>
        <p className="text-white/40 text-sm font-medium">How can we help you?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href={siteConfig.links.githubRepo + "/issues"} target="_blank" className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Bug className="text-white mb-4" size={24} />
          <h3 className="font-bold text-white mb-2">Report a Bug</h3>
          <p className="text-sm text-white/50">Submit an issue on our GitHub repository.</p>
        </a>
        <a href={siteConfig.links.linkedin} target="_blank" className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Briefcase className="text-white mb-4" size={24} />
          <h3 className="font-bold text-white mb-2">Business Inquiries</h3>
          <p className="text-sm text-white/50">Reach out to the creator via LinkedIn.</p>
        </a>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Shield className="text-white mb-4" size={24} />
          <h3 className="font-bold text-white mb-2">Security Disclosure</h3>
          <p className="text-sm text-white/50">Please report vulnerabilities directly via GitHub or LinkedIn DMs for responsible disclosure.</p>
        </div>
      </div>
    </>
  );
}
INNER_EOF

# Fair Play
cat << 'INNER_EOF' > src/app/\(legal\)/fair-play/page.tsx
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
INNER_EOF

# Community Guidelines
cat << 'INNER_EOF' > src/app/\(legal\)/community-guidelines/page.tsx
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
INNER_EOF

# Licenses
cat << 'INNER_EOF' > src/app/\(legal\)/licenses/page.tsx
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
INNER_EOF

# Accessibility
cat << 'INNER_EOF' > src/app/\(legal\)/accessibility/page.tsx
import React from 'react';

export const metadata = { title: 'Accessibility | Open Gambit' };

export default function AccessibilityPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Accessibility</h1>
      </div>
      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6">
        <p>Open Gambit is committed to providing a chess experience that is accessible to everyone.</p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Our Commitment</h2>
        <ul className="list-disc pl-5">
          <li><strong>Keyboard Navigation:</strong> We strive to ensure critical UI components can be navigated via keyboard.</li>
          <li><strong>Contrast & Clarity:</strong> Our interface utilizes high-contrast dark themes to reduce eye strain and improve readability.</li>
          <li><strong>Reduced Motion:</strong> We are continually working to support reduced motion preferences across the application.</li>
        </ul>
        <p>If you encounter any accessibility barriers while using Open Gambit, please contact us.</p>
      </div>
    </>
  );
}
INNER_EOF

# Changelog
cat << 'INNER_EOF' > src/app/\(legal\)/changelog/page.tsx
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
INNER_EOF

# Help
cat << 'INNER_EOF' > src/app/\(legal\)/help/page.tsx
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
INNER_EOF

# FAQ
cat << 'INNER_EOF' > src/app/\(legal\)/faq/page.tsx
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
INNER_EOF

