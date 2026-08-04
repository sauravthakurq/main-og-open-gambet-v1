import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Open Gambit" className="w-8 h-8 object-contain" />
            <span className="font-bold tracking-widest uppercase text-lg text-white">Open Gambit</span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            The ultimate premium AI-powered chess operating system. Play, analyze, and master the game of chess anywhere.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/80 text-sm uppercase tracking-wider mb-2">Company</h4>
            <Link href="/about" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">Contact</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/80 text-sm uppercase tracking-wider mb-2">Legal</h4>
            <Link href="/terms" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">Cookies Policy</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white/80 text-sm uppercase tracking-wider mb-2">Community</h4>
            <Link href="/community-guidelines" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">Guidelines</Link>
            <a href="https://github.com/sauravthakurq/main-og-open-gambet-v1.git" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-[var(--color-accent)] transition-colors">GitHub</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Open Gambit. All rights reserved.
        </p>
        <div className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded">
          v0.1.0-alpha
        </div>
      </div>
    </footer>
  );
}
