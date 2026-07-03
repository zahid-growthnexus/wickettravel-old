import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, BUSINESS } from "@/lib/seo";
import { I18nProvider } from "@/lib/i18n";
import ScrollProgress from "@/components/ScrollProgress";
import StickySearchBar from "@/components/StickySearchBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  // Self-hosted by next/font (no render-blocking Google request). `swap` paints
  // text immediately in the fallback, and the matched fallback metrics below
  // keep the swap from shifting layout (near-zero CLS).
  display: "swap",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Arial",
    "Helvetica",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    template: "%s | Wicket Travel",
  },
  description:
    "Book cheap flights from the UK with Wicket Travel. Compare the best airline ticket deals to Pakistan, India, Dubai & worldwide from Heathrow, Manchester & more. No hidden fees.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.legalName }],
  creator: BUSINESS.legalName,
  publisher: BUSINESS.legalName,
  keywords: [
    "cheap flights UK",
    "best airline ticket deals UK",
    "flights to Pakistan from UK",
    "flights to India from UK",
    "flights to Dubai from UK",
    "cheap flights from Heathrow",
    "cheap flights from Manchester",
    "book airline tickets UK",
    "trusted airline tickets",
    "Wicket Travel",
  ],
  category: "travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    description:
      "Book cheap flights from the UK with Wicket Travel. Best airline ticket deals to Pakistan, India, Dubai & worldwide from Heathrow, Manchester, Birmingham & more — no hidden fees.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@WicketTravel",
    creator: "@WicketTravel",
    title: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    description:
      "Book cheap flights from the UK — best airline ticket deals to Pakistan, India, Dubai & worldwide. Trusted airlines, no hidden booking fees.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        {/* Warm up the origins the browser fetches directly (next/image proxies
            Unsplash through /_next/image, so only these raw logo CDNs need it):
            avs.io airline logos appear just below the hero, Simple Icons in the
            footer. */}
        <link
          rel="preconnect"
          href="https://pics.avs.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://pics.avs.io" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          <ScrollProgress />
          <StickySearchBar />
          {children}
          <LanguageSwitcher />
          <WhatsAppButton />
          <BackToTop />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}
