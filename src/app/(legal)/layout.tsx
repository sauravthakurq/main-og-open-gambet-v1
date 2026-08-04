import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full px-6 h-[72px] flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <Link 
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm hidden sm:block">Back to Game</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Open Gambit" className="w-6 h-6 object-contain" />
          <span className="font-bold tracking-widest uppercase text-sm">Open Gambit</span>
        </div>
        <div className="w-[100px]" /> {/* Spacer for centering */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
