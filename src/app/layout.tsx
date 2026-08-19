import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://propitz.com"),
  title: {
    default: "Propitz — One-Point Property Facilitation Platform",
    template: "%s — Propitz",
  },
  description:
    "Propitz is India's one-point facilitation platform that simplifies property processes by connecting users with structured guidance, verified support, and relevant professional services.",
  keywords: [
    "property facilitation",
    "property registration",
    "SRO Tamil Nadu",
    "property verification",
    "Chennai real estate",
    "Propitz",
  ],
  openGraph: {
    title: "Propitz — One-Point Property Facilitation Platform",
    description:
      "Simplify your property journey with verified guidance, structured support, and a trusted professional network.",
    type: "website",
    url: "https://propitz.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* General Sans — the exact typeface used on propitz.com (Fontshare). */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] antialiased">
        <SiteChrome
          header={<Header />}
          footer={<Footer />}
          floating={
            <FloatingButtons phone={site.phoneDigits} whatsapp={site.whatsapp} />
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
