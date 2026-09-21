import type { Metadata } from "next";
import { CANONICAL_URL } from "@/lib/siteUrl";
import { Newsreader, Plus_Jakarta_Sans, Anek_Tamil, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { RegionProvider } from "@/components/RegionProvider";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { site } from "@/data/site";

/* Self-hosted by next/font — no external font requests, no layout shift. */
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-pj",
  display: "swap",
});

/* Tamil pairs with the sans across the bilingual labels. */
const tamil = Anek_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "500"],
  variable: "--font-tamil-anek",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: "PropITZ — Property Registration, Verification & Documents in Tamil Nadu",
    template: "%s — PropITZ",
  },
  description:
    "Register, verify and document property in Tamil Nadu with PropITZ: the right Sub-Registrar Office, documents checked first, and independent professionals coordinated for you.",
  keywords: [
    "property facilitation",
    "property registration",
    "SRO Tamil Nadu",
    "property verification",
    "Chennai real estate",
    "PropITZ",
  ],
  openGraph: {
    title: "PropITZ — Property in Tamil Nadu, without the guesswork",
    description:
      "Online where it is faster, in person where it matters. Registration, verification, documents and verified listings across Tamil Nadu.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${serif.variable} ${sans.variable} ${tamil.variable} ${mono.variable}`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] antialiased">
        <RegionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingButtons whatsapp={site.whatsapp} />
        </RegionProvider>
      </body>
    </html>
  );
}
