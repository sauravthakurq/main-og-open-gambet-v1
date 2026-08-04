import React from 'react';

export default function CookiesPage() {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Cookies Policy</h1>
      <p className="text-white/50 mb-8">Last updated: August 4, 2026</p>

      <div className="prose prose-invert prose-white max-w-none text-white/80 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">How We Use Cookies</h2>
          <p>We use cookies and similar technologies for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Essential Cookies:</strong> Required to authenticate users and prevent fraudulent use of user accounts.</li>
            <li><strong>Functional Cookies:</strong> Used to remember your preferences, such as your selected theme, board style, or AI engine configuration.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with Open Gambit to improve our services and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Managing Cookies</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
            However, if you disable or refuse cookies, please note that some parts of Open Gambit (such as login and offline caching) may become inaccessible or not function properly.
          </p>
        </section>
      </div>
    </>
  );
}
