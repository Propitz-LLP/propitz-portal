/* ------------------------------------------------------------------ */
/*  Design showcase registry                                          */
/*  Each entry is a standalone re-design of the Propitz landing page,  */
/*  living at /designs/<slug>. Used by the header menu, the gallery    */
/*  and the floating design switcher.                                  */
/* ------------------------------------------------------------------ */

export type Design = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  /** Two/three hex colors used for the preview swatch gradient. */
  swatch: string[];
  /** Whether the design is dark-themed (affects switcher preview). */
  dark?: boolean;
};

export const designs: Design[] = [
  {
    slug: "aurora",
    name: "Aurora",
    tagline: "Airy glassmorphism",
    blurb:
      "A luminous, modern SaaS feel — frosted glass cards, soft aurora gradients and indigo-violet accents.",
    swatch: ["#4f46e5", "#8b5cf6", "#38bdf8"],
  },
  {
    slug: "meridian",
    name: "Meridian",
    tagline: "Corporate & structured",
    blurb:
      "Disciplined, high-trust and gridded — deep navy, crisp rules and a confident amber accent.",
    swatch: ["#0f2742", "#1e3a5f", "#f59e0b"],
  },
  {
    slug: "verdant",
    name: "Verdant",
    tagline: "Calm & trustworthy",
    blurb:
      "Fresh and human — warm cream canvas, generous curves and a reassuring emerald palette.",
    swatch: ["#f8f7f2", "#059669", "#047857"],
  },
  {
    slug: "onyx",
    name: "Onyx",
    tagline: "Premium dark mode",
    blurb:
      "Tech-luxury in the dark — near-black canvas, electric cyan glow and glassy panels.",
    swatch: ["#0b0f14", "#22d3ee", "#3b82f6"],
    dark: true,
  },
  {
    slug: "terra",
    name: "Terra",
    tagline: "Warm editorial",
    blurb:
      "Boutique and magazine-like — sand tones, terracotta accents and oversized serif headlines.",
    swatch: ["#f3ead9", "#c2603f", "#2b211c"],
  },
];

export const getDesign = (slug: string) =>
  designs.find((d) => d.slug === slug);
