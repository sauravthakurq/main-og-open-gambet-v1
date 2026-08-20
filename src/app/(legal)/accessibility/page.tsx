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
