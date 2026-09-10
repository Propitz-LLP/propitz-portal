/* ------------------------------------------------------------------ */
/*  Global site data: nav, contact, stats, testimonials, FAQs, etc.   */
/*  Content matched to the live Propitz site (propitz.com).           */
/* ------------------------------------------------------------------ */

export const IMG = "https://propitz.com/wp-content/uploads";
export const THEME_IMG = "https://propitz.com/wp-content/themes/shadez/images";

export const site = {
  name: "Propitz",
  logo: `${IMG}/2026/02/logo2.png`,
  tagline: "One-Point Property Facilitation Platform",
  phone: "+91 8925876765",
  phoneDigits: "8925876765",
  whatsapp: "918925876765",
  email: "enquire@propitz.com",
  address:
    "Villa No 4, Sri Harsha, 30, Church Main Rd, Perungudi, Chennai, Tamil Nadu 600096",
  queryForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSfF8HT1tWgo5Gqjm5PIZ85bimrTBv6cMwj55XA_q2lC4_vPyA/viewform",
  description:
    "Propitz is a one-point facilitation platform that simplifies property processes in India by connecting users with structured guidance, verified support, and relevant professional services.",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Property Registration Assistance", href: "/services/property-registration-assistance" },
      { label: "Document & Checklist Guidance", href: "/services/document-checklist-guidance" },
      { label: "Property Verification Coordination", href: "/services/property-verification-coordination" },
      { label: "SRO Process Assistance", href: "/services/sro-process-assistance" },
      { label: "Property Advisory Support", href: "/services/property-advisory-support" },
      { label: "Professional Network Access", href: "/services/professional-network-access" },
      { label: "Transactional Structuring Support", href: "/services/transactional-structuring-support" },
      { label: "Negotiation & Deal Support", href: "/services/negotiation-deal-support" },
    ],
  },
  { label: "Property Marketplace", href: "/property-marketplace" },
  { label: "Contact Us", href: "/contact-us" },
];

/* Hero */
export const heroHeading =
  "Propitz is a one-point facilitation platform that helps people navigate property-related services in India.";
export const heroTagline =
  "Property Buyers, Sellers, Owners, Investors And NRIs Looking For Hassle-Free Coordination.";
export const heroImage = `${THEME_IMG}/hero-bg-image.jpg`;
export const heroVideo = `${IMG}/2026/03/V1.mp4`;
export const reviewRating = "4.8";
export const reviewLabel = "Our World Wide Customer Review";

/* Hero stat counters */
export const stats = [
  { value: "10+", label: "Year of Experience" },
  { value: "50+", label: "Expert Team Member" },
  { value: "500+", label: "Happy Customers" },
];

/* Stats shown in the "About Propitz" block */
export const aboutStats = [
  { value: "17+", label: "Real Estate Expertise" },
  { value: "3+", label: "Expert Team Members" },
  { value: "178+", label: "Handed-Over Project" },
];

/* About Propitz intro */
export const aboutIntro =
  "Propitz is India's premier one-point facilitation platform, designed to simplify the complexities of property ownership. We don't just provide information; we bridge the gap between your property needs and the professional services required to fulfill them.";

export const mission =
  "To build a structured and transparent property facilitation ecosystem that simplifies buying, selling, and documentation processes across India.";
export const vision =
  "To establish Propitz as India's leading structured property ecosystem — integrating verified marketplace access, guided facilitation, and a nationwide network of support centres.";
export const values =
  "We operate with honesty and clarity, ensuring every property process is handled with integrity.";

/* Homepage "Our Services" cards */
export const homeServices = [
  {
    title: "Property registration assistance",
    href: "/services/property-registration-assistance",
    icon: `${IMG}/2026/02/icon-service-item-1.svg`,
    image: `${IMG}/2026/03/6-1.jpg`,
  },
  {
    title: "Document guidance & checklist support",
    href: "/services/document-checklist-guidance",
    icon: `${IMG}/2026/02/icon-service-item-2.svg`,
  },
  {
    title: "Property verification coordination",
    href: "/services/property-verification-coordination",
    icon: `${IMG}/2026/02/icon-service-item-3-1.svg`,
  },
  {
    title: "Sub-Registrar Office (SRO) related assistance",
    href: "/services/sro-process-assistance",
    icon: `${IMG}/2026/02/icon-service-item-4.svg`,
  },
  {
    title: "Property advisory & requirement facilitation",
    href: "/services/property-advisory-support",
    icon: `${IMG}/2026/02/icon-service-item-1.svg`,
  },
  {
    title: "Professional service coordination",
    href: "/services/professional-network-access",
    icon: `${IMG}/2026/02/icon-service-item-2.svg`,
  },
  {
    title: "Transactional Structuring Support",
    href: "/services/transactional-structuring-support",
    icon: `${IMG}/2026/02/icon-service-item-3-1.svg`,
  },
  {
    title: "Negotiation & Deal Support",
    href: "/services/negotiation-deal-support",
    icon: `${IMG}/2026/02/icon-service-item-4.svg`,
  },
];

/* Home "Who We Are" three-tab block */
export const whoWeAre = [
  {
    key: "process",
    tab: "Process Guidance",
    icon: `${IMG}/2026/02/icon-who-we-tab-1.svg`,
    heading: "Process Guidance:",
    text: "Property procedures can often feel confusing. Propitz helps you understand the steps, documentation, and processes involved so you can move forward with clarity.",
    items: [
      { icon: `${IMG}/2026/02/icon-who-we-item-1.svg`, label: "Clear Process Understanding" },
      { icon: `${IMG}/2026/02/icon-who-we-item-2.svg`, label: "Structured Documentation Guidance" },
      { icon: `${IMG}/2026/02/icon-who-we-item-3.svg`, label: "Professional Network Access" },
      { icon: `${IMG}/2026/02/icon-who-we-item-4.svg`, label: "Human Assistance & Coordination" },
    ],
  },
  {
    key: "network",
    tab: "Professional Network",
    icon: `${IMG}/2026/02/icon-who-we-tab-2.svg`,
    heading: "Professional Network:",
    text: "When professional expertise is required, Propitz helps coordinate with independent professionals such as lawyers, surveyors, architects, and consultants to assist with your property needs.",
    items: [
      { icon: `${IMG}/2026/02/icon-who-we-item-1.svg`, label: "Vetted Independent Professionals" },
      { icon: `${IMG}/2026/02/icon-who-we-item-2.svg`, label: "Category-Based Matching" },
      { icon: `${IMG}/2026/02/icon-who-we-item-3.svg`, label: "Legal, Survey & Advisory Access" },
      { icon: `${IMG}/2026/02/icon-who-we-item-4.svg`, label: "Transparent Facilitation" },
    ],
  },
  {
    key: "ground",
    tab: "On-Ground Support",
    icon: `${IMG}/2026/02/icon-who-we-tab-3.svg`,
    heading: "On-Ground Support:",
    text: "From document checklists to Sub-Registrar Office procedures, Propitz provides practical coordination that keeps your property process moving with the right people at the right time.",
    items: [
      { icon: `${IMG}/2026/02/icon-who-we-item-1.svg`, label: "Local Coordination Assistance" },
      { icon: `${IMG}/2026/02/icon-who-we-item-2.svg`, label: "Appointment & Visit Preparation" },
      { icon: `${IMG}/2026/02/icon-who-we-item-3.svg`, label: "Document Readiness Support" },
      { icon: `${IMG}/2026/02/icon-who-we-item-4.svg`, label: "Nationwide Support Centres" },
    ],
  },
];

/* "Our Commitment" cards */
export const commitments = [
  {
    icon: `${IMG}/2026/02/icon-service-item-2.svg`,
    title: "Process Clarity - Simplifying complex property procedures",
    text: "Property documentation and registration processes can often be confusing. Propitz helps you understand the steps involved and guides you through the process with clear and structured support.",
  },
  {
    icon: `${IMG}/2026/02/icon-service-item-3-1.svg`,
    title: "Professional Coordination - Connecting you with the right experts",
    text: "When professional expertise is required, Propitz helps coordinate with independent professionals such as lawyers, surveyors, architects, and consultants to assist with your property needs.",
  },
  {
    icon: `${IMG}/2026/02/icon-service-item-1.svg`,
    title: "Structured Guidance - Helping you move forward with confidence",
    text: "From document checklists to Sub-Registrar Office procedures, Propitz provides practical guidance so you can prepare the right information and approach the process with clarity.",
  },
];

/* "Property Processes Made Simpler" resource cards (dark section) */
export const resourceCards = [
  { title: "Land Measurement & Conversion", href: "/resources/land-measurement-conversion", image: `${IMG}/2026/04/Land-Measurement-Conversion-1.jpeg` },
  { title: "Sub-Registrar Office (SRO) Information – Tamil Nadu", href: "/resources/sub-registrar-office-sro-information-tamil-nadu", image: `${IMG}/2026/04/Sub-Registrar-Office-SRO-Information.jpeg` },
  { title: "EC & Patta Chitta & GV", href: "/resources/ec-patta-chitta-gv", image: `${IMG}/2026/04/EC-Patta-Chitta-Guideline-Value-GV-1.jpeg` },
  { title: "Propitz Professional Network", href: "/resources/propitz-professional-network", image: `${IMG}/2026/04/Profesional-service-co.jpeg` },
];

export const testimonials = [
  {
    name: "Lakshmi Narayanan",
    role: "Residential Client & Owner",
    quote:
      "I recently had to handle property paperwork for my family and the process felt overwhelming at first. Propitz helped simplify the steps and pointed me in the right direction, which made things much easier for us.",
  },
  {
    name: "Karthik Subramanian",
    role: "Residential Client & Owner",
    quote:
      "When I was planning to buy a small plot near Chengalpattu, I had many doubts about ownership verification and documentation. Through Propitz, I was able to understand the process clearly and get the right guidance before moving forward with the purchase.",
  },
  {
    name: "Meenakshi Raghavan",
    role: "Residential Client",
    quote:
      "Finding the right people for property documentation was difficult earlier. Propitz helped connect me with the right guidance at the right time.",
  },
  {
    name: "R. Srinivasan",
    role: "Property Buyer, Chennai",
    quote:
      "I was confused about the property registration process and documents. Propitz guided me step by step and made the whole process much clearer.",
  },
];

export const faqs = [
  {
    q: "What is the Propitz Property Marketplace?",
    a: "It is an assisted, verification-led property listing platform for registered and enrolled clients who want structured support for buying or selling properties. Propitz facilitates the process; it does not act as a broker.",
  },
  {
    q: "How is a property verified?",
    a: "Verification covers document completeness, ownership verification and compliance validation. All verification is performed by independent third-party professionals — Propitz facilitates and coordinates the process.",
  },
  {
    q: "Can Propitz help with SRO procedures?",
    a: "Yes. We provide step-by-step guidance on Sub-Registrar Office requirements, appointments and document readiness so you can approach the SRO with confidence. Propitz does not represent users before government offices.",
  },
];

/* Avatars used in the testimonial / trust rows */
export const clientAvatars = [
  `${IMG}/2026/04/A1.jpeg`,
  `${IMG}/2026/04/A2.jpeg`,
  `${IMG}/2026/04/1.jpeg`,
  `${IMG}/2026/04/2.jpeg`,
];

export const homeGallery = [
  `${IMG}/2026/04/1.jpeg`,
  `${IMG}/2026/04/2.jpeg`,
  `${IMG}/2026/04/3.jpeg`,
  `${IMG}/2026/04/4.jpeg`,
  `${IMG}/2026/04/A1.jpeg`,
  `${IMG}/2026/04/A2.jpeg`,
];
