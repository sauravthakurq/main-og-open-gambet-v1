import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLoader from "@/components/layout/AppLoader";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { ThemeInjector } from "@/components/board/ThemeInjector";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Gambit — AI Chess OS",
  description: "The ultimate premium AI-powered chess operating system.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/battle.png" as="image" />
        <link rel="preload" href="/think-like-ai.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeInjector />
        <ServiceWorkerRegister />
        <OfflineBanner />
        <AppLoader>{children}</AppLoader>
        <ToastProvider />
        <ConfirmationModal />
        <ConnectionBadge />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
