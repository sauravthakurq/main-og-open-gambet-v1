import React from 'react';

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Contact Us</h1>
      <p className="text-white/50 mb-8">Get in touch with the Open Gambit team.</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Support & Feedback</h2>
          <p>
            We are constantly looking to improve Open Gambit. If you have any feedback, feature requests, or run into any bugs, we would love to hear from you.
          </p>
          <p className="mt-4">
            <strong>Email:</strong> support@opengambit.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">GitHub Repository</h2>
          <p>
            Open Gambit is an open-source project. You can report bugs, submit pull requests, and view our roadmap directly on GitHub.
          </p>
          <p className="mt-4">
            <a href="https://github.com/open-gambit" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-semibold">
              View on GitHub
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Frequently Asked Questions</h2>
          <ul className="list-disc pl-5 mt-2 space-y-4">
            <li>
              <strong>How do I configure my own AI API keys?</strong>
              <br />You can enter your own OpenAI, Anthropic, or Google Gemini keys in the Settings modal under the "API Keys" tab. Your keys are stored securely in your browser's local storage.
            </li>
            <li>
              <strong>Can I play offline?</strong>
              <br />Yes! The core application, local Stockfish engine, and your recent games are available completely offline once the PWA is installed.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
