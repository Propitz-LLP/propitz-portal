/* ------------------------------------------------------------------ */
/*  Global site data: contact, navigation, stats and homepage content. */
/*                                                                     */
/*  Every figure and claim here was confirmed by PropITZ before launch */
/*  (see docs/prelaunch-checklist.md). Do not add numbers, ratings or  */
/*  testimonials without the same confirmation.                        */
/* ------------------------------------------------------------------ */

/** Site media, hosted in the Supabase Storage `assets` bucket (`images/` folder). */
export const IMG =
  "https://vkrlvjnsunciemrxtlfs.supabase.co/storage/v1/object/public/assets/images";

export const site = {
  name: "PropITZ",
  logo: `${IMG}/logo.png`,
  tagline: "One-Point Property Facilitation Platform",
  /**
   * WhatsApp only. This number is not published as a voice line; calls are
   * arranged as callbacks from a Start a Request or Sell enquiry.
   */
  whatsapp: "918925876765",
  whatsappDisplay: "+91 89258 76765",
  email: "enquire@propitz.com",
  /** The operating company behind PropITZ. */
  legalEntity: "Peri Gold Developers Pvt Ltd",
  /** Registered office, and today the only office open to visitors. */
  address:
    "Villa No 4, Sri Harsha, 30, Church Main Rd, Perungudi, Chennai, Tamil Nadu 600096",
  description:
    "PropITZ helps you register, verify and document property in Tamil Nadu, explaining each step and coordinating the independent professionals who carry it out.",
};

/** A WhatsApp chat link, optionally with the first message pre-filled. */
export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type NavItem = {
  label: string;
  href: string;
};

/** Footer quick links. The header keeps its own navigation. */
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Property Marketplace", href: "/property-marketplace" },
  { label: "Sell a Property", href: "/sell" },
  { label: "Insights", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

export const heroImage = `${IMG}/hero-bg-image.jpg`;
export const heroVideo = `${IMG}/V1.mp4`;

/**
 * Verified figures only. A customer count, team size and network size are
 * deliberately absent until each is separately verified.
 */
export const stats = [
  { value: "15+", label: "Years of real-estate expertise" },
  { value: "1,000+", label: "Advisory transactions handled" },
];

/* Free tools cards on the homepage (dark section) */
export const resourceCards = [
  { title: "Stamp Duty & Registration Fee Calculator", href: "/resources/stamp-duty-registration-fee-calculator", image: `${IMG}/EC-Patta-Chitta-Guideline-Value-GV.jpeg` },
  { title: "Land Area Converter", href: "/resources/land-measurement-conversion", image: `${IMG}/Land-Measurement-Conversion-1.jpeg` },
  { title: "Sub-Registrar Office (SRO) Information – Tamil Nadu", href: "/resources/sub-registrar-office-sro-information-tamil-nadu", image: `${IMG}/Sub-Registrar-Office-SRO-Information.jpeg` },
  { title: "EC & Patta Chitta & GV", href: "/resources/ec-patta-chitta-gv", image: `${IMG}/EC-Patta-Chitta-Guideline-Value-GV-1.jpeg` },
];

/** Homepage FAQs, drawn from the launch FAQ set PropITZ approved. */
export const faqs = [
  {
    q: "Does PropITZ register the property on my behalf?",
    a: "PropITZ coordinates preparation and the registration process; statutory execution remains with the parties, authorised professionals and the relevant authority.",
  },
  {
    q: "Is property verification the same as a legal opinion?",
    a: "No. A legal opinion is issued by an independent advocate. PropITZ coordinates the verification workflow and records.",
  },
  {
    // "Empanelled" definition confirmed by PropITZ, 18 September 2026.
    q: "Are the professionals employees of PropITZ?",
    a: "No. Professionals may be independent empanelled specialists unless specifically stated otherwise. Empanelled means the professional is on the PropITZ panel of independent professionals we introduce customers to. It is not employment, and PropITZ does not supervise or guarantee their professional work. The professional issuing an opinion or deliverable is responsible for that work.",
  },
  {
    q: "How much does it cost?",
    a: "Each case is quoted after a scope review, because the work depends on the property, the documents and the transaction. Initial scope and document review normally begins within one business day.",
  },
];
