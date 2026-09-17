# PropITZ pre-launch checklist

Tracks every item in *PropITZ Final Developer Corrections — Pre-Launch*, including the answers PropITZ gave to the developer questions (Q1–Q20) and Appendix A.

**Status key**

- `[x]` **Done**, changed in code and checked in the browser
- `[ ]` **Partly done**, some of it is in, the rest is described
- `[ ]` **Waiting on PropITZ**, needs something only the business can supply
- `[ ]` **Functional branch**, needs the listing database and admin work on `feat/market-place`
- `[ ]` **Not code**, a business, content or production task

---

## Before this goes live

1. **Run the leads migration.** Supabase dashboard → SQL Editor → paste `supabase/migrations/20260916_leads.sql` → Run. Until then, Start a Request, Sell and newsletter submissions show a "could not save" message, and checklist downloads still work but their leads are not stored. Leads are read in the Supabase table editor.
2. **Re-verify the stamp duty and registration fee rates** against the current Tamil Nadu Government / TNREGINET position, then update `checked` in `src/data/registrationRates.ts`.
3. **PropITZ reviews and approves the service page wording** (Q4).

---

## Top three launch blockers

- [x] **Done.** Registration promise and service scope say the same thing, with execution-day assistance described as available where the engagement includes it (Q7).
- [x] **Done.** Statistics reconciled to one verified set (Q1, Q2).
- [x] **Done.** Live defects fixed: unfinished copy, typos, social links, broken CTAs.

---

## 1. Critical corrections (P0)

- [x] **Done. Registration contradiction resolved.**
  The service page uses the recommended wording: PropITZ coordinates, statutory execution stays with the parties, professionals and authority. Per Q7, advocate title review is described as happening "where legal verification is part of your case", and coordinator presence as "where included" and "where permitted", on the homepage walkthrough, services grid, phygital section and registration service page.

- [x] **Done. Statistics reconciled (Q1, Q2).**
  Only two figures appear anywhere: **15+ years of real-estate expertise** and **1,000+ advisory transactions handled**. The customer count (500+), team size (50+) and network size (50+) are removed from the homepage trust strip and About page. The unused data holding older figures (17+, 178+, 5k+, 4.8 rating) is deleted.

- [x] **Done. Live defects fixed.**
  - "Get Free Quote", undefined button styles, spelling and plural errors all fixed.
  - No social media accounts exist, so there are no social icons.
  - **Q3: +91 89258 76765 is WhatsApp only.** No `tel:` link remains anywhere. The floating call button is removed; the floating WhatsApp button stays. Footer, Contact page, service pages and About show it as "WhatsApp +91 89258 76765". Calls are offered only as a callback chosen in a form.
  - The footer newsletter works again and stores sign-ups as leads.

- [x] **Done. Service pages rewritten around customer outcomes.**
  *Waiting on PropITZ (Q4): final wording review and approval before production.*

- [x] **Done. Service pages shortened, standard structure.**
  Outcome and CTAs, what PropITZ handles, your journey, documents (accordion), pricing and timeline, FAQs (accordion), who is responsible for what.
  - **Pricing (Q11):** every service shows "Quote after scope review".
  - **Timeline (Q12):** "Initial scope and document review normally begins within one business day", with completion confirmed after review and government time stated as outside PropITZ's control. No fixed completion times.
  - **FAQs (Q13):** the three Appendix A FAQs for each of the eight services, also published as FAQ structured data for search.

- [x] **Done. No forced login before a first enquiry.**

- [x] **Done. Checklist lead magnet (Q5, Q6).**
  "Get my checklist" asks for name and mobile, saves a checklist lead, then downloads a PDF immediately. The PDF is the purchase and registration readiness checklist PropITZ specified (title deed, EC, Patta/Chitta, FMB sketch, approvals, tax receipts, ID/PAN, sale agreement, Power of Attorney, legal-heir/settlement documents) and states clearly that the final list varies by property and transaction. "Ask on WhatsApp instead" is offered alongside. No WhatsApp Business API dependency. If saving the lead fails, the visitor still gets the PDF and the failure is logged.

- [ ] **Waiting on PropITZ, then functional branch. Define every marketplace verification label.**
  Cards still show a generic "Verified" / "In review" badge. Confirm the scoped fields (EC reviewed, parent deeds reviewed, Patta cross-checked, approval reviewed, site survey, legal opinion, review date, reviewing professional) and whether the reviewer's name may be public.

- [ ] **Partly done. Replace placeholder and unverified trust claims.**
  Done: testimonials and their photos removed (Q8); reconstructed blog articles removed and replaced with the three real articles PropITZ supplied (Q9); walkthrough claims qualified (Q7); "centres" claims removed (Q16); mission and vision replaced (Q14); verified statistics only (Q1, Q2).
  Remaining: the marketplace sample listings, and the marketplace line "Nothing is marked verified unless an advocate has read the chain", which depend on the verification label item above.

- [x] **Done. Brand name standardised as "PropITZ".**
  *Not code: check the Supabase auth email templates.*

- [x] **Done. Unique SEO title and description on every major page**, including the new Sell and calculator pages.

---

## 2. Homepage (P1)

- [x] **Done.** Hero headline kept.
- [x] **Done.** Hero supporting line broadened.
- [x] **Done.** "What do you need help with?" directly under the hero: Buy · Sell · Verify · Register · Documents · Property Services.
- [ ] **Partly done.** Homepage reordered. No dedicated "How it works" or "Professionals" section; the registration walkthrough covers how it works. Testimonials stay hidden until genuine ones exist. The homepage shows the latest three articles under Insights.
- [x] **Done.** Duplicate and generic bands removed.
- [x] **Done (Q10). Sell flow on-platform.** New `/sell` page with the Google Form's three fields (name, mobile, preferred time to call as hour, minute and AM/PM) plus a short property details field, stored as a seller lead. Every Sell link now opens it; the Google Form is no longer used anywhere.
- [x] **Done.** "Online where it is faster. In person where it matters." retained.
- [x] **Done.** "Start a request" is primary everywhere and opens the on-site request form; WhatsApp is persistent and secondary.

## 3. Service pages (P1)

- [x] **Done. Copy corrections of 16 September 2026 applied** ("PropITZ 8 Service Pages — Copy Corrections"). Each page uses the recommended headline, opening copy, process and responsibility statement. Page-specific lists added: verification scope, advisory use cases, professions in the network, what structuring may include, and negotiation areas of support. Documents and verification pages carry the recommended clarifying notes. CTA hierarchy is Start a Request, WhatsApp, then a Talk to Us text link. The duplicate service list is gone from the sidebar. *Not code: the corrections noted the rewrite was missing from the live Vercel build; these changes need deploying.*

- [x] **Done.** One consistent template.
- [x] **Done (Q11, Q12).** Pricing basis and timeline.
- [x] **Done.** Outcome-led copy on the first screen.
- [x] **Done.** Customer-facing labels.
- [x] **Done.** PropITZ versus professional responsibility on each page.
- [x] **Done (Q13).** Documents and FAQs in accordions.

## 4. Marketplace (P1)

- [x] **Done.** Proposition "Listings we have actually looked at." kept.
- [ ] **Waiting on PropITZ, then functional branch.** Transparent verification scope (see P0).
- [x] **Done.** Tabs named "Properties" and "Property Professionals".
- [ ] **Functional branch and not code.** Real property photographs only.
- [ ] **Not code.** Do not prominently launch an empty-looking marketplace. The homepage still features the marketplace teaser with sample listings; decide whether it stays for launch.

## 5. About, Contact and Login (P1)

- [x] **Done (Q14).** "India's premier" gone; mission and vision use PropITZ's approved text, leading with Tamil Nadu and region-by-region growth.
- [ ] **Partly done (Q15).** About now shows the operating company (Peri Gold Developers Pvt Ltd), registered office, contact details, the office model, the professional-panel model, and a side-by-side "what PropITZ does / what professionals do". The footer names the company too. *Not supplied: founder or leadership names.*
- [x] **Done (Q16).** Navigation says "Contact". Only the verified Perungudi, Chennai office is shown; the mobile menu and homepage no longer mention Chengalpattu or Tiruvallur centres.
- [x] **Done (Q17).** Start a Request captures name, mobile, requirement type, property location, preferred channel (WhatsApp, Callback, Email) and optional email and notes, and stores a structured lead with source, page, status and timestamp in Supabase. Any page can open it pre-selected, e.g. each service page opens it with that service chosen.
- [x] **Done (Q18).** Login describes only what works today. The Digital Property Workspace appears beneath it, explicitly labelled "Coming soon".

## 6. Platform and product

- [x] **Done (Q18).** Digital Property Workspace mentioned only as "Coming soon", on the Login page.
- [ ] **Not started (P2).** Full property-lifecycle positioning.
- [x] **Done (P2).** No fractional-investment marketing.
- [x] **Done (P2).** Distressed Resolution not on the public site.

## 7. Knowledge, content and SEO (P1)

- [x] **Done.** Every reference page ends with the matching service CTA. Blog articles will get theirs automatically when published.
- [ ] **Not code.** Prioritise Tamil Nadu problem-led search topics.
- [ ] **Partly done. Interactive tools.**
  - Land area converter: live.
  - **Stamp duty & registration fee calculator (Q19): live** for standard Sale / Conveyance deeds. 7% stamp duty, 4% registration fee, and a 1-point registration fee reduction when every purchaser is a woman and the value is up to ₹10 lakh (G.O. Ms. No. 77, 29 March 2025). Rates live in `src/data/registrationRates.ts`. Checked in the browser: ₹50 lakh gives ₹3,50,000 + ₹2,00,000; ₹10 lakh with women purchasers gives a 3% fee of ₹30,000; ₹10,00,001 reverts to 4%. *Re-verify rates before production.*
  - **Find My SRO (Q20): not built.** SRO jurisdictions change, so it needs a live data source or API. Identify one before building. The "Find my Sub-Registrar Office" menu link is renamed "Sub-Registrar Office (SRO) guide" so it no longer promises a lookup.
- [ ] **Partly done.** Generic copy removed site-wide except the marketplace page's workflow and fee model sections.

## 8. Visual and production

- [x] **Done (P1).** No visual redesign.
- [ ] **Not code (P1).** Curated PropITZ image library.
- [ ] **Not code (P2).** Proprietary photo shoot.

---

## 9. Final developer checklist (verified)

### Critical (P0)

- [x] Registration promise consistent across homepage and service page.
- [x] Statistics and trust claims reconciled to one verified set.
- [x] Live defects fixed.
- [x] Service pages shortened and rewritten around outcomes. *Q4 approval pending.*
- [x] Initial enquiry works without login.
- [x] "Get my checklist" delivers the checklist immediately.
- [x] "PropITZ" used consistently.
- [x] Unique title and meta description on every major page.
- [ ] Marketplace verification labels have a defined scope. *Waiting on PropITZ, then functional branch.*
- [ ] No placeholder statistics, case results, addresses or credentials remain. *Marketplace sample listings remain.*

### Should improve before launch (P1)

- [x] Homepage reordered; problem-led entry under the hero.
- [x] Duplicate and generic homepage bands removed.
- [x] Hero supports the full proposition.
- [x] "Start a request" primary; WhatsApp persistent and secondary.
- [x] Sell flow moved on-platform.
- [x] Service pages show pricing basis and expected timeline.
- [ ] Marketplace has enough genuine inventory before prominent launch. *Not code.*
- [x] "Our centres" reflects the real operating footprint.
- [ ] Tools use dependable data. *Converter and calculator live; Find My SRO needs a data source.*
- [ ] About page contains real company and operating information. *Leadership names not supplied.*
- [x] Contact form captures requirement type, property location and preferred channel.
- [x] Login communicates only current functionality, with the Workspace labelled "Coming soon".
- [ ] Production listings use real property photos only. *Functional branch and not code.*
- [x] Primary CTAs have clear destinations and consistent labels.
- [x] Desktop and mobile checked: no horizontal overflow on Home, About, Contact, Sell, Login, a service page or the calculator.

### Later (P2)

- [x] No fractional-investment marketing.
- [x] Distressed Resolution not on the public site.
- [ ] Full property-lifecycle positioning.
- [ ] Proprietary photo shoot.
