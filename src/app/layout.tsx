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
import { GlobalWorkspaces } from "@/components/layout/GlobalWorkspaces";

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050505",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full sm:overflow-hidden antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png?v=3" />
        <link rel="preload" href="/battle.png" as="image" />
        <link rel="preload" href="/think-like-ai.png" as="image" />
      </head>
      <body className="min-h-full h-full sm:overflow-hidden flex flex-col">
        <ThemeInjector />
        <ServiceWorkerRegister />
        <OfflineBanner />
        <AppLoader>{children}</AppLoader>
        <ToastProvider />
        <ConfirmationModal />
        <ConnectionBadge />
        <PWAInstallPrompt />
        {/* Global workspace overlays — always mounted so they can open from any screen
            including during active gameplay. z-index 9999 ensures they appear above everything. */}
        <GlobalWorkspaces />
      </body>
    </html>
  );
}
