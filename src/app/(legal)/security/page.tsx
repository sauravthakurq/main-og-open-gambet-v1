import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Security | Open Gambit',
  description: 'Security practices and architecture of Open Gambit.',
};

export default function SecurityPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Security</h1>
        <p className="text-white/40 text-sm font-medium">How we protect your data and API keys.</p>
      </div>

      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6 leading-relaxed font-medium">
        <section>
          <p>
            Open Gambit is engineered with a strict local-first security philosophy. We believe that intelligence systems should be transparent and secure by design.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">API Key Security & Architecture</h2>
          <p>
            Our architecture is built to minimize data egress and centralize control in the hands of the user.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Local Execution:</strong> By default, your API keys (OpenAI, Anthropic, Gemini, DeepSeek) are stored solely in your browser's encrypted local storage.</li>
            <li><strong>Direct Communication:</strong> Requests to AI providers are constructed locally and sent securely over HTTPS. They do not pass through our databases.</li>
            <li><strong>Sovereign AI (Local):</strong> If you utilize our Local AI integration (e.g., Ollama), the entire intelligence layer runs strictly on your machine. Zero data is transmitted to the internet.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Data Minimization</h2>
          <p>
            We do not collect unnecessary telemetry, tracking metrics, or invasive analytics. The platform requests only the information required to facilitate gameplay, multiplayer matchmaking, and account synchronization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Responsible Disclosure</h2>
          <p>
            We take the security of Open Gambit seriously. If you are a security researcher and have discovered a vulnerability in our platform, we encourage you to disclose it responsibly.
          </p>
          <p className="mt-2">
            Please report any security findings via our <a href="/contact" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">Contact page</a> or directly to the repository maintainer. We will validate and patch issues as quickly as possible.
          </p>
        </section>
      </div>
    </>
  );
}
