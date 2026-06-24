import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import ScrollProgress from "@/components/ScrollProgress";
import StickySearchBar from "@/components/StickySearchBar";
import Chatbot from "@/components/Chatbot";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wicket Travel — Compare Cheap Flights, Hotels & Car Rentals",
  description:
    "Wicket Travel searches 500+ partners to find the lowest prices on flights, hotels and car rentals — then sends you straight to the best deal. No hidden fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          <ScrollProgress />
          <StickySearchBar />
          {children}
          <LanguageSwitcher />
          <Chatbot />
          <BackToTop />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}
