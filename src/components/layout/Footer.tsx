import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-16 px-6 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-12">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-6 max-w-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Open Gambit" className="w-8 h-8 object-contain" />
            <span className="font-bold tracking-widest uppercase text-lg text-white">{siteConfig.name}</span>
          </div>
          <p className="text-[13px] text-white/50 leading-relaxed font-medium">
            {siteConfig.description}
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 w-full lg:w-auto">
          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white/80 text-[11px] uppercase tracking-[0.15em]">Product</h4>
            <Link href="/" className="text-[13px] text-white/40 hover:text-white transition-colors">Play</Link>
            <Link href="/watch-live" className="text-[13px] text-white/40 hover:text-white transition-colors">Watch Live</Link>
            <Link href="/" className="text-[13px] text-white/40 hover:text-white transition-colors">Learn</Link>
            <Link href="/" className="text-[13px] text-white/40 hover:text-white transition-colors">Gambit AI</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white/80 text-[11px] uppercase tracking-[0.15em]">Company</h4>
            <Link href="/about" className="text-[13px] text-white/40 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-[13px] text-white/40 hover:text-white transition-colors">Contact</Link>
            <Link href="/security" className="text-[13px] text-white/40 hover:text-white transition-colors">Security</Link>
            <Link href="/accessibility" className="text-[13px] text-white/40 hover:text-white transition-colors">Accessibility</Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white/80 text-[11px] uppercase tracking-[0.15em]">Resources</h4>
            <Link href="/help" className="text-[13px] text-white/40 hover:text-white transition-colors">Help Center</Link>
            <Link href="/faq" className="text-[13px] text-white/40 hover:text-white transition-colors">FAQ</Link>
            <Link href="/community-guidelines" className="text-[13px] text-white/40 hover:text-white transition-colors">Community</Link>
            <Link href="/fair-play" className="text-[13px] text-white/40 hover:text-white transition-colors">Fair Play</Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white/80 text-[11px] uppercase tracking-[0.15em]">Connect</h4>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> LinkedIn
            </a>
            <a href={siteConfig.links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> Portfolio
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> GitHub
            </a>
            <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> X (Twitter)
            </a>
            <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-[12px] font-medium text-white/30">
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-[12px] font-medium">
          <Link href="/privacy" className="text-white/30 hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="text-white/30 hover:text-white transition-colors">Terms</Link>
          <Link href="/security" className="text-white/30 hover:text-white transition-colors">Security</Link>
          <Link href="/fair-play" className="text-white/30 hover:text-white transition-colors">Fair Play</Link>
          <Link href="/licenses" className="text-white/30 hover:text-white transition-colors">Licenses</Link>
        </div>
      </div>
    </footer>
  );
}
