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
