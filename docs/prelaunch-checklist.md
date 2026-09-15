# PropITZ pre-launch checklist

Tracks every item in *PropITZ Final Developer Corrections — Pre-Launch*.

**Status key**

- `[x]` **Done**, changed in code and checked in the browser
- `[ ]` **Partly done**, some of it is in, the rest is described
- `[ ]` **Needs input**, blocked on a fact or decision only the business has
- `[ ]` **Pending**, can be built without input, not started yet
- `[ ]` **Not code**, a business, content or production task
- `[ ]` **Functional branch**, needs the listing database and admin work on `feat/market-place`; the UI side is on this branch

---

## Top three launch blockers

- [x] **Done.** Registration promise and service scope say the same thing.
- [ ] **Needs input.** All statistics reconciled to one verified set.
- [x] **Done.** Live defects fixed: unfinished copy, typos, social links, broken CTAs.

---

## 1. Critical corrections (P0)

- [x] **Done. Registration contradiction resolved.**
  The service page said "You complete registration independently" and "does not provide registration execution services", while the homepage promises a coordinator on the day. The service page now uses the recommended wording: PropITZ coordinates, statutory execution stays with the parties, professionals and authority. SRO Process Assistance was aligned the same way.

- [ ] **Needs input. Reconcile statistics site-wide.**
  The homepage About block (17+ years, 3+ team, 178+ projects), the "4.8/5 from 500+ reviews" line and both "5k+ satisfied clients" mentions are gone with the duplicate sections. What remains still conflicts:

  | Concept | Values on the site today | Where |
  | --- | --- | --- |
  | Years of experience | 10+ | Homepage trust strip, About page stats |
  | Customers | 500+ | Homepage trust strip, About page stats |
  | Team size | 50+ expert team members | About page stats |
  | Network | 50+ advocates and surveyors | Homepage trust strip |

  "50+ expert team members" and "50+ advocates and surveyors on the network" may describe the same people; label them precisely or keep one. Send the verified figures.

- [x] **Done. Live defects fixed.**
  - "Get Free Quote" removed from the homepage and the shared CTA band.
  - "Schedule a Call Back" dialled immediately rather than scheduling anything, so it is now "Call us".
  - Three button styles were used but never defined, so CTAs on every service page, the CTA band and the About page rendered as plain text. Now defined.
  - Unfinished headings and spelling or plural errors fixed across the homepage, stats, footer and Who We Are.
  - Social icons all linked to the enquiry Google Form. PropITZ has no social media accounts, so the icons are removed for good. Phone and WhatsApp are the contact channels, both read from one setting. *Needs input (Q3): confirm the phone and WhatsApp numbers; the site currently uses 8925876765 for both.*
  - Footer newsletter form discarded every address typed into it. Hidden. *Needs input: where subscribers should be stored.*
  - Homepage marketplace teaser's "Map view" button only reloaded the page. Hidden.

- [x] **Done. Service pages rewritten around customer outcomes.**
  All eight open with the outcome the customer gets. The repeated "What is this service about?" and "How PropITZ helps" blocks are merged into one "What PropITZ handles" list.
  *The rewritten copy should get a business read-through before launch.*

- [ ] **Partly done. Service pages shortened, standard structure.**
  Page body between header and footer is 32–39% shorter; whole page 25–31%, measured on three services. Order: outcome and CTAs, what PropITZ handles, your journey, documents in an accordion, who is responsible for what.
  *Needs input for the rest of the template: pricing or pricing basis, typical timeline and FAQs per service.*

- [x] **Done. No forced login before a first enquiry.**
  The contact form, WhatsApp, phone and "Start a request" all work signed out.

- [ ] **Needs input. Checklist lead magnet.**
  "Get my checklist" still links to the Contact page. Needs the checklist content (or confirmation the five items shown are enough), the delivery route (download, or WhatsApp which needs a Business API account), and where captured leads are stored.

- [ ] **Needs input, then functional branch. Define every marketplace verification label.**
  Cards currently show a generic "Verified" or "In review" badge plus free-text document badges. The document asks for scoped checks: EC reviewed, parent deeds reviewed, Patta cross-checked, approval reviewed, site survey completed or not, legal opinion available, review date and reviewing professional. The listing form and database on the functional branch need these fields. *Needs input: confirm the fields, and whether the reviewing professional's name may be shown publicly.*

- [ ] **Needs input. Replace placeholder and unverified trust claims.**
  Removed so far: "India's premier", "Nationwide Support Centres", the "Our centres" navigation label, and the client avatar row on the homepage. Still to verify or remove:
  - Every statistic in the table above.
  - The four named testimonials, their photos, and whether those customers consented.
  - **Blog articles.** A note in the blog data file says the article bodies were reconstructed because the originals could not be retrieved. Replace them with the real text.
  - Homepage walkthrough claims: an advocate reads the parent-document chain before booking, and a coordinator walks into the office with you.
  - Three centres (Chennai, Chengalpattu, Tiruvallur) named in the location data when only Chennai has an address.
  - Mission and vision references to nationwide centres on the About page.
  - Sample listings on the marketplace and homepage teaser, and the "nothing is marked verified unless an advocate has read the chain" claim.

- [x] **Done. Brand name standardised as "PropITZ".**
  Visible copy, metadata, alt text and messages. The domain, email and asset paths stay lowercase.
  *Not code: check the Supabase auth emails (confirmation, password reset) in the Supabase dashboard.*

- [x] **Done. Unique SEO title and description on every major page.**
  Home, About, Services, all eight services, Contact, Blog, Login and Register. Blog posts and resource pages use their own title and summary.
  Checked on all 23 public pages: no duplicate titles or descriptions. The four reference pages now have search-phrased titles, such as "Land Area Converter: Cents, Grounds, Acres & Sq Ft", instead of repeating their headings.

---

## 2. Homepage (P1)

- [x] **Done.** Keep hero headline "Property in Tamil Nadu, without the guesswork."
- [x] **Done.** Hero supporting line broadened, using the recommended wording.
- [x] **Done.** "What do you need help with?" sits directly under the hero.
- [x] **Done.** Intent row is Buy · Sell · Verify · Register · Documents · Property Services. The separate Buy/Sell band below it repeated two of these and is removed.
- [ ] **Partly done.** Homepage reordered: hero and intents, services, phygital model and trust numbers, marketplace, free tools, testimonials, guides, FAQs, final CTA. *There is no dedicated "How it works", "Professionals" or "Centres" section yet; the registration walkthrough in the hero covers "How it works" for now.*
- [x] **Done.** Duplicate bands removed: the About block with mission, vision and second stats row; the second "Our Services" grid; the "Who We Are" tabs; "Our Commitment" and its decorative banner.
- [ ] **Needs input.** Bring the Sell flow on-platform. Needs the fields the Google Form collects today.
- [x] **Done.** Retain "Online where it is faster. In person where it matters."
- [x] **Done.** "Start a request" is the primary hero CTA; "Chat on WhatsApp" sits beside it, and WhatsApp stays persistent on every page. *"Start a request" still opens the Google Form until an on-platform intake exists.*

## 3. Service pages (P1)

- [ ] **Partly done.** One consistent template. Structure is in; pricing, timeline and FAQ sections need input.
- [ ] **Needs input.** Pricing or pricing basis, only where commercially reliable.
- [x] **Done.** Outcome-led copy on the first screen.
- [x] **Done.** Customer-facing labels, such as "Verify a property before you commit", "Find the right property professional" and "Structure your property transaction". Each service page leads with its label, with the formal name kept in the breadcrumb, navigation and footer. The services index shows both.
- [x] **Done.** PropITZ versus professional responsibility stated on each service page.
- [ ] **Partly done.** Documents are in an accordion. FAQs follow once they exist.

## 4. Marketplace (P1)

- [x] **Done.** Keep the proposition "Listings we have actually looked at." It is the marketplace page heading.
- [ ] **Needs input, then functional branch.** Replace generic verification badges with transparent scope. See the P0 verification label item above.
- [x] **Done.** Marketplace modes separated with explicit tabs, now named "Properties" and "Property Professionals" as the document suggests. The professionals tab title, breadcrumb and search title use the same name. No "Services" tab added.
- [ ] **Functional branch and not code.** Real property photographs only. Listing cards show a placeholder until photo upload exists; the photos themselves must be real.
- [ ] **Not code.** Do not launch an empty-looking marketplace prominently. The homepage currently features the marketplace teaser; decide whether to keep it there until real inventory exists.

## 5. About, Contact and Login (P1)

- [x] **Done.** Remove "India's premier" positioning.
- [ ] **Needs input.** Real company information on About: legal entity, founder or leadership, office, centre and panel model.
- [x] **Done.** "Our centres" renamed "Contact" in the navigation, accurate whatever the footprint. *Needs input to go further: which centres operate, so a Centres page can be built.*
- [ ] **Partly done.** Contact form now captures name, mobile, requirement category, property location and preferred channel (WhatsApp, Call, Email), with email optional. The category and location go in the email subject so the inbox can be sorted. *Needs input: it still sends a pre-filled email; say where leads should be stored (Supabase or a CRM).*
- [ ] **Needs input (Q18). Reposition Login as the customer workspace.** The document lists tracking of service requests, documents, professionals, payments and property records. None of these exist in the account area yet, so saying so now would be an unverified claim. Decide whether to describe them as coming soon, or wait until they are built. Meanwhile, four places that already implied tracking were corrected: the Login and Register search descriptions, the Register page subtitle, and the homepage line "Track where your file has reached, at any hour".

## 6. Platform and product

- [ ] **Needs input (P1).** Surface the Digital Property Workspace concept. Same concern as Login: the workspace does not exist yet. Decide how to present it.
- [ ] **Pending (P2).** Full property lifecycle positioning.
- [x] **Done (P2).** No fractional or investor functionality in public navigation.
- [x] **Done (P2).** Distressed Real Estate Resolution kept off the site.

## 7. Knowledge, content and SEO (P1)

- [x] **Done.** Every guide and reference page ends with the service that solves its problem, for example the registration guide offering "Start a registration request" and the EC and Patta page offering "Start a case".
- [ ] **Not code.** Prioritise Tamil Nadu problem-led search topics for new articles.
- [ ] **Partly done.** Interactive tools. A land area converter is live on the land measurement page. It covers square feet, square metres, square yards, cents, grounds, ares, acres and hectares; district-dependent units like the kuzhi are deliberately excluded. *Needs input for the rest: a stamp duty and registration fee calculator needs a rates table you trust; Find My SRO needs a verified office list.*
- [ ] **Partly done.** Generic copy removed from service pages, the CTA band, a knowledge page, the Services and Contact page intros, the Register page, the footer description and the marketplace FAQ answer. *Pending: the marketplace page's workflow and fee model sections still say "structured onboarding", "structured coordination support" and "directional guidance".*

## 8. Visual and production

- [x] **Done (P1).** No visual redesign.
- [ ] **Not code (P1).** Curated PropITZ image library.
- [ ] **Not code (P2).** Proprietary photo shoot.

## 9. Final developer checklist (verified)

Mirrors section 9 of the corrections document. Each line was re-checked against the code and the running site, not carried over from earlier notes. Question numbers refer to the "Input needed" boxes in the document.

### Critical (P0)

- [x] **Done.** Registration promise is consistent across homepage and service page. Both say a coordinator supports you on execution day, and the service page carries the recommended responsibility wording.
- [ ] **Needs input (Q1, Q2).** Statistics reconciled to one verified set. Years (10+) and customers (500+) now match between homepage and About. "50+ expert team members" on About and "50+ advocates and surveyors" on the homepage still need confirming.
- [x] **Done.** Live defects fixed. No "Get Free Quote", no unstyled buttons (every button style in use is defined), no brand-name variants, no social links. *Q3 confirms the phone and WhatsApp numbers.*
- [ ] **Partly done (Q4, Q11–Q13).** Service pages shortened and rewritten around outcomes. Pricing, timeline and FAQs still to add, and the copy needs a business read-through.
- [x] **Done.** Initial enquiry works without login. Only the account area requires signing in.
- [ ] **Needs input (Q5, Q6, Q17).** "Get my checklist" still links to the Contact page.
- [x] **Done.** "PropITZ" used consistently. No variants found in any visible text or metadata.
- [x] **Done.** Unique title and description on every major page. All 23 public pages checked, with no duplicates.
- [ ] **Needs input, then functional branch.** Marketplace verification labels have a defined scope.
- [ ] **Needs input (Q1, Q2, Q7, Q8, Q9, Q14, Q16).** No placeholder statistics, testimonials, articles, centre claims or credentials remain.

### Should improve before launch (P1)

- [x] **Done.** Homepage reordered, with the problem-led "What do you need help with?" directly under the hero.
- [x] **Done.** Duplicate and generic homepage bands removed.
- [x] **Done.** Hero supports the full proposition, not registration only.
- [x] **Done.** "Start a request" is primary; WhatsApp is persistent on every page and the secondary hero action. *"Start a request" still opens the Google Form.*
- [ ] **Needs input (Q10).** Sell flow moved on-platform.
- [ ] **Needs input (Q11, Q12).** Service pages show pricing basis and timeline.
- [ ] **Not code.** Enough genuine inventory before a prominent marketplace launch.
- [ ] **Partly done (Q16).** "Our centres" reflects the real footprint. The navigation now says "Contact" and the Contact page names only Chennai. The homepage still says "physical assistance centres" in the plural.
- [ ] **Partly done (Q19, Q20).** Tools use dependable data. The land converter uses fixed standard definitions only. The stamp duty calculator and Find My SRO wait for verified data.
- [ ] **Needs input (Q14, Q15).** About page contains real company and operating information.
- [x] **Done.** Contact form captures requirement type, property location and preferred channel. *Q17 decides where enquiries are stored; today they arrive by email.*
- [ ] **Needs input (Q18).** Login communicates the Property Workspace benefit.
- [ ] **Functional branch and not code.** Production listings use real property photos only.
- [x] **Done.** Primary CTAs have clear destinations and consistent labels, checked on all 23 pages. "Start a request", "Chat on WhatsApp" (previously "Ask on WhatsApp" on service pages), "Call us" and "Tell us what you need". The marketplace page now matches too: "Enrol / Submit your Query" became "Start a request", and "Talk to our team" and "Talk to a coordinator" became "Call us". Action-specific labels remain where they say something different: "Book a site visit", "Request an introduction" and each guide's service link.
- [x] **Done.** Desktop and mobile checked: no horizontal overflow on the homepage, About, Services, a service page, Contact, Register or the land measurement page, and "Start a request" is visible without scrolling on service pages.

### Later (P2)

- [x] **Done.** No fractional-investment marketing on the public site.
- [x] **Done.** Distressed Resolution not on the public site.
- [ ] **Pending.** Full property-lifecycle positioning.
- [ ] **Not code.** Proprietary photo shoot.

### Housekeeping before launch

- [ ] **Pending.** Unused data still in the code holds old claims that no page shows: "17+ years", "178+ projects", "5k+ satisfied clients", a 4.8 rating, "India's leading" and "Nationwide Support Centres". Delete it so it cannot be switched back on by accident.
