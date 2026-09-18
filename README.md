# Propitz — Next.js Rebuild

A modern, faithful rebuild of [propitz.com](https://propitz.com) using **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. It reproduces the structure, sections and content of the original WordPress/Elementor site with a clean, component-driven codebase.

## Quick start

```bash
npm install
npm run dev      
```

Build for production:

```bash
npm run build
npm run start
```

## What's included

- **All pages** of the original site:
  - Home, About Us, Services (listing), Property Marketplace, Contact Us
  - 8 service-detail pages (`/services/[slug]`)
  - 4 resource pages (`/resources/[slug]`)
  - 3 blog posts (`/blog`, `/blog/[slug]`)
  - Custom 404
- Shared **Header** (sticky, services dropdown, mobile menu), **Footer**, floating **WhatsApp/Call** buttons.
- Reusable UI: hero, section headings, service cards, stats, testimonials carousel, "who we are" tabs, FAQ accordion, contact form, CTA band, scroll-reveal animations.

## Project structure

```
src/
  app/                 # routes (App Router)
    page.tsx           # home
    about-us/
    services/          # listing + [slug] detail
    property-marketplace/
    contact-us/
    resources/[slug]/
    blog/ + blog/[slug]/
    layout.tsx         # root layout, fonts, header/footer
    globals.css        # Tailwind v4 + design tokens
  components/           # Header, Footer, ServiceCard, FAQ, etc.
  data/                # all content (site, services, resources, blog)
```

## Editing content

Content is data-driven — you rarely need to touch JSX:

- `src/data/site.ts` — nav, contact details, stats, testimonials, FAQs, "who we are" tabs.
- `src/data/services.ts` — the 8 services (title, hero, process, documents, disclaimer).
- `src/data/resources.ts` — the 4 reference pages.
- `src/data/blog.ts` — blog posts.

## Design tokens (colours & fonts)

All brand colours live at the top of `src/app/globals.css` under `@theme` — change one line to re-skin the whole site:

```css
--color-brand: #0f766e;   /* primary teal */
--color-accent: #f59e0b;  /* gold accent  */
--color-ink: #0e2a33;     /* headings     */
```

Fonts (Poppins for headings, Inter for body) are loaded via `<link>` in `layout.tsx`.

## Images & media

Images, the hero video and service photos are referenced directly from the live
site (`https://propitz.com/wp-content/...`) — configured in `next.config.ts`
(`images.unoptimized = true` + `remotePatterns`). They load automatically when
you run the app with internet access.

To self-host instead: download the assets into `public/`, then swap the
`https://propitz.com/...` URLs in `src/data/*` for local `/`-paths.

## Notes

- Blog article **bodies** were not exposed by the site crawler, so the text in
  `src/data/blog.ts` is a faithful reconstruction from each post's topic.
  Replace it with the exact article copy when available (marked with a comment).
- The contact form composes a `mailto:` to `enquire@propitz.com` (no backend
  required). Wire it to your form provider / API route when you're ready.
- The exact original hex palette wasn't publicly available, so the tokens above
  are a clean, close approximation — tweak to match your brand precisely.
