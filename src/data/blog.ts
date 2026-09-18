import { IMG } from "./site";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  /**
   * Only published posts get a page, appear in the blog index and on the
   * homepage. The blog itself 404s while nothing is published.
   */
  published: boolean;
  body: { heading?: string; paragraphs: string[]; list?: string[] }[];
};

/**
 * Articles supplied by PropITZ ("Blogs for website", September 2026). The
 * text is theirs; only LinkedIn hashtags were dropped and the list items
 * were laid out as lists.
 */
export const posts: BlogPost[] = [
  {
    slug: "next-25-years-land-demand-housing-food-energy",
    published: true,
    title:
      "The next 25 years could demand more new land than humanity has ever built on — several times over",
    date: "17 Sep, 2026",
    author: "PropITZ",
    image: `${IMG}/Land-Measurement-Conversion-1.jpeg`,
    excerpt:
      "Housing, farmland and energy all want the same flat, watered, connected ground. Why rising total demand does not lift every parcel, and where land value really comes from.",
    body: [
      {
        paragraphs: [
          "By 2050, the world could claim 5× more land than everything it has built in 10,000 years.",
          "Every city, town and road across all of history fits in about 1 million km². The claims coming in the next 25 years total roughly five times that.",
          "Not mostly for cities. That's the part people get wrong.",
          "Cities will roughly double their footprint by 2050 — significant, but the smallest claim on the list.",
          "Farmland is bigger: feeding 9.7 billion people means as much as 6 million km² of new agricultural land, even with better yields.",
          "And the claim nobody was pricing five years ago: energy. The IEA (International Energy Agency) estimates solar and wind could need 2 million km² by 2050 — ten times today's footprint. The energy transition has quietly become one of the largest land acquisitions in history.",
          "Here's what makes this a real-estate story and not just a climate story:",
          "All three claims want the same ground. Flat, watered, connected, near a grid. A solar developer, a housing developer and a farmer are now bidding on the same parcel — and more than half of the world's new urban land is projected to be built over existing cropland.",
          "“But solar can go in the desert.” It can — and some of the world's largest parks do. Yet most solar keeps landing on farmland anyway, because deserts have no grid, no roads, no water for cleaning panels. Remote land only joins the competition after someone spends billions connecting it. The value was never in the land. It's in the connection.",
          "Does that mean “buy land”? No — and that's the trap. Japan's land peaked in 1991 and never recovered. US farmland fell ~60% in the 1980s during a global food boom. Rising total demand does not lift every parcel. Value comes from conversion — unserviced to serviced, agricultural to zoned, disputed to clean title — and that is decided plot by plot, not by a global chart.",
          "The next 25 years won't run out of land.",
          "They'll run out of land that everyone wants at the same time.",
          "Which force do you think reaches your market first — housing, food, or energy?",
        ],
      },
    ],
  },
  {
    slug: "your-land-was-already-sold-property-impersonation-fraud-tamil-nadu",
    published: true,
    title: "Sir, Your Land Was Already Sold",
    date: "17 Sep, 2026",
    author: "PropITZ",
    image: `${IMG}/EC-Patta-Chitta-Guideline-Value-GV-1.jpeg`,
    excerpt:
      "Owners of land held untouched for decades are finding it already registered to someone else. How impersonation fraud works in Tamil Nadu, and five steps to protect land you hold.",
    body: [
      {
        paragraphs: [
          "Over the last few months, I have come across a few cases in Tamil Nadu that genuinely disturbed me.",
          "An elderly gentleman in his seventies walked into a Sub-Registrar Office with a prospective buyer to complete the sale of land his family had owned since the 1990s. The plot had never been sold, never mortgaged — simply held, untouched, for three decades.",
          "Instead of completing the registration, he was told the property had already been registered in someone else's name a few months earlier.",
          "According to the complaint, the person who executed that earlier sale carried the same name as the real owner — but a different photograph and different identity documents. The buyer in that fraudulent transaction was an NRI who had purchased through his parents, in good faith, with registered documents in hand and full payment made. He was cheated just as thoroughly as the owner was.",
          "The matter is now before the police and the courts. And it isn't an isolated case — I have come across a few more incidents with strikingly similar facts. I don't know how widespread this pattern is. But the method is clear enough: identify a vacant plot with an absent owner, forge documents and an identity around the name on a decades-old deed, and sell the land to someone who has no reason to suspect anything.",
        ],
      },
      {
        heading: "Why legacy holdings are the target",
        paragraphs: [
          "Lakhs of families bought land in the 1980s and 1990s, filed the original sale deed away in a cupboard, and assumed ownership was settled forever. That assumption was reasonable then. It may not be anymore.",
          "Properties registered before the digital era carry a specific vulnerability: identity verification at the time relied on physical documents, old photographs, and local witnesses. There was no biometric link, no centralized identity trail. If your ownership record has never been touched since, the registration system has no modern way of knowing what you look like — only what your name is. And a name can be copied.",
          "We talk constantly in real estate about title, valuation, approvals, and litigation. Perhaps we should also be talking about identity — because in these cases, title was never the weak point. The weak point was that nobody could verify who was standing at the counter.",
        ],
      },
      {
        heading: "What struck me most",
        paragraphs: [
          "There was more than one victim here. The landowner lost his peace of mind and now faces years of litigation over land that was always his. The buyer's family lost their money and their trust. Both sides acted honestly. The only people who benefited are the ones who allegedly orchestrated the fraud — and who, so far, remain untraceable.",
        ],
      },
      {
        heading: "If you hold land that has sat untouched for years",
        paragraphs: [
          "Land is, for most families, the largest investment of their lives. It deserves an hour of your time this month:",
        ],
        list: [
          "Pull your Encumbrance Certificate (EC). Available online in most states in minutes. It will show whether any transaction or lien has been registered against your survey number without your knowledge.",
          "Verify your Patta / revenue records. Confirm the record still reflects your name and correct extent.",
          "Link your Aadhaar to the property records. This is the single most important step. A record linked to a verified modern identity is far harder to impersonate than a 30-year-old paper deed.",
          "Update your mobile number wherever the registry or revenue portal allows it, so any attempted transaction triggers an alert to you — not to a stranger.",
          "Visit the land periodically, or ask someone local to. Impersonators depend on absence.",
        ],
      },
      {
        paragraphs: [
          "A small amount of preventive effort today can spare a family years of litigation tomorrow.",
          "I work on land diligence and project delivery in Tamil Nadu, which is how these cases reached me.",
          "To the property lawyers, registration officials, and fellow real estate professionals here — have you encountered impersonation cases like this? What change to the registration process would make this fraud meaningfully harder?",
          "Property ownership should not become uncertain simply because a family chose to preserve an asset for the next generation.",
        ],
      },
    ],
  },
  {
    slug: "price-identification-in-property-transactions",
    published: true,
    title: "Price identification in property transactions",
    date: "17 Sep, 2026",
    author: "PropITZ",
    image: `${IMG}/Negotiation-Deal-Support.webp`,
    excerpt:
      "Most property buyers in India are winning the negotiation but losing the deal. Why the price itself is often not real, and how to build a defensible price range instead.",
    body: [
      {
        paragraphs: [
          "Most property buyers in India are winning the negotiation but losing the deal.",
          "They spend weeks grinding a broker on price per sq. ft. — without realising that the “price” itself was never real to begin with.",
          "Here's what we've seen in land transactions firsthand:",
          "The seller receives fair value — at or marginally above the last traded market price.",
          "The buyer pays significantly more — sometimes up to 25% higher.",
          "The gap doesn't go to the market. It goes to the deal structure.",
          "This isn't price appreciation. It's manufactured opacity — enabled by one simple tactic: keeping the buyer and seller from ever comparing notes.",
          "The reason it works is that India has no single source of truth on property prices. There are three numbers in play:",
        ],
        list: [
          "The Guideline Value — the government's legal floor",
          "The Registered Value — the official paper trail",
          "The Market Rate — what the buyer actually pays",
        ],
      },
      {
        paragraphs: [
          "The gap between these three is where transparency dies — and where uninformed buyers quietly absorb costs they never see coming.",
        ],
      },
      {
        heading: "The mindset shift that changes this",
        paragraphs: [
          "Stop asking “What is this property worth?”",
          "Start asking “What is my margin of safety?”",
          "In a fragmented market, precision is an illusion. Smart capital doesn't chase the true price. It builds a defensible price range.",
        ],
      },
      {
        heading: "How",
        paragraphs: [],
        list: [
          "Build a price band, not a number. Speak to multiple independent sources — brokers, local participants, recent buyers. Look for convergence, not confirmation.",
          "Watch liquidity, not quotes. A quoted price is an aspiration. How long a property sits on the market is the reality check.",
          "Price the opacity. If you can't verify the data, the discount you negotiate isn't a win — it's your insurance premium for the uncertainty you're absorbing.",
        ],
      },
      {
        paragraphs: [
          "The Indian market doesn't lack data. It lacks reliable data.",
          "The buyers who understand that distinction stop haggling on price and start making defensible decisions.",
          "That's the difference between a negotiator and an investor.",
        ],
      },
    ],
  },
];

export const publishedPosts = posts.filter((p) => p.published);

export const getPost = (slug: string) => publishedPosts.find((p) => p.slug === slug);
