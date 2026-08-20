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
