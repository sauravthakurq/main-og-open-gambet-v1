import React from 'react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Terms of Service | Open Gambit',
  description: 'Terms of Service and acceptable use policy for Open Gambit.',
};

export default function TermsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Terms of Service</h1>
        <p className="text-white/40 text-sm font-medium">Last updated: {siteConfig.legal.lastUpdated} &middot; Version: {siteConfig.legal.version}</p>
      </div>

      <div className="prose prose-invert prose-white max-w-none text-white/70 space-y-6 leading-relaxed font-medium">
        <section>
          <p>
            By accessing or using {siteConfig.name}, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptable Use</h2>
          <p>
            You agree to use Open Gambit only for lawful purposes and in accordance with our <a href="/fair-play" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">Fair Play Policy</a>. You must not:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Attempt to disrupt, degrade, or exploit the service infrastructure.</li>
            <li>Use the platform to distribute spam or malicious content.</li>
            <li>Harass, abuse, or harm other users during online multiplayer matches.</li>
            <li>Engage in cheating or unauthorized engine assistance during competitive human matches.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. AI Provider Usage</h2>
          <p>
            When utilizing the Bring Your Own Key (BYOK) functionality, you are responsible for complying with the Terms of Service of the respective AI provider (e.g., OpenAI, Anthropic, Google). You are solely responsible for any costs, rate limits, or usage violations incurred on your API keys.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            The Open Gambit application, interface, branding, and original content are the intellectual property of Open Gambit and its creator. The platform integrates open-source components (such as Stockfish and chess.js) which remain under their respective licenses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Limitations of Liability</h2>
          <p>
            Open Gambit is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. In no event shall Open Gambit or its creators be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the service immediately, without prior notice, for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users or the service.
          </p>
        </section>
      </div>
    </>
  );
}
