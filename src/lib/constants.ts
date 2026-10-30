export const SITE = {
  name: "Synclina",
  tagline: "Ideas in Sync.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Synclina is a human-first AI studio turning everyday problems into intelligent products — and helping businesses automate the work that slows them down.",
  email: "ysaisreenathreddy@gmail.com",
  location: "Hyderabad, India",
  founded: "May 2026",
  socials: {
    linkedin: "https://www.linkedin.com/company/synclina/",
    instagram: "https://www.instagram.com/synclina.ai/",
    // github: added once the organisation page is live
  } as Partial<Record<"linkedin" | "instagram" | "github" | "x", string>>,
};

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Technology", href: "/technology" },
  { label: "Journey", href: "/journey" },
  { label: "About", href: "/about" },
];

/* ─────────────────────────── PRODUCTS ───────────────────────────
 * Products are presented by use case only — no product names yet.
 * Everything below (status, updates, fixes, reviews) is plain data:
 * edit it here and every page updates.
 */

export type Phase = { label: string; state: "done" | "active" | "next" };
export type Update = {
  /** ISO date (YYYY-MM-DD) — used for ordering; shown as "Mon YYYY". */
  date: string;
  product: string;
  title: string;
  notes: string[];
};
export type Fix = { date: string; title: string };
export type Review = { name: string; role: string; rating: number; text: string };

export type Product = {
  slug: string;
  code: string;
  title: string;
  domain: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  highlights: { title: string; text: string }[];
  accent: string;
  accentRgb: string;
  status: string;
  release: { stage: string; window: string; platforms: string[]; access: string };
  build: { version: string; channel: string; lastUpdated: string; phases: Phase[] };
  fixes: Fix[];
  reviews: Review[];
  /** Mini UI rendered inside the stylised phone mockup. */
  screen: { title: string; metric: string; metricLabel: string; rows: [string, string][] };
};

export const PRODUCTS: Product[] = [
  {
    slug: "mobility",
    code: "Idea 01",
    title: "Smart Mobility",
    domain: "Mobility · Everyday driving",
    tagline: "Your vehicle, finally understood.",
    summary:
      "An AI companion for everyday drivers and riders — making running costs, trips and road safety simple to understand.",
    problem: "Most people have no clear picture of what their vehicle really costs them, or help when something goes wrong on the road.",
    approach: "Turn everyday driving data into simple insights and timely nudges — with safety features that are never behind a paywall.",
    highlights: [
      { title: "Clarity on costs", text: "Know where your money goes, without spreadsheets." },
      { title: "Safety first", text: "Help when it matters most — free, always." },
      { title: "An AI copilot", text: "Ask questions about your vehicle in plain language." },
    ],
    accent: "#3B82F6",
    accentRgb: "59, 130, 246",
    status: "Advanced development",
    release: { stage: "Internal testing", window: "To be announced", platforms: ["Android", "iOS"], access: "Early-access list opening soon" },
    build: {
      version: "Pre-release · v2 (internal)",
      channel: "Internal",
      lastUpdated: "Oct 2026",
      phases: [
        { label: "Research & design", state: "done" },
        { label: "Core experience", state: "done" },
        { label: "Testing & polish", state: "active" },
        { label: "Early access", state: "next" },
        { label: "Public launch", state: "next" },
      ],
    },
    fixes: [],
    reviews: [],
    screen: { title: "Overview", metric: "18.4", metricLabel: "km / L this week", rows: [["Trips", "12"], ["Spend", "Tracked"], ["Health", "Good"]] },
  },
  {
    slug: "creator-growth",
    code: "Idea 02",
    title: "Creator Automation",
    domain: "Social · Creators & small business",
    tagline: "Grow without the grind.",
    summary:
      "Automation and insights for creators and small businesses — so engagement keeps flowing while you focus on creating.",
    problem: "Replying to every comment and message by hand doesn't scale, and analytics rarely say what to actually do next.",
    approach: "Simple rules that respond for you, and insights that turn numbers into clear next steps — built on official platform APIs.",
    highlights: [
      { title: "Always-on replies", text: "Never leave a follower waiting." },
      { title: "Insights that matter", text: "Know what works and why." },
      { title: "Safe by design", text: "Official integrations only." },
    ],
    accent: "#F472B6",
    accentRgb: "244, 114, 182",
    status: "Early development",
    release: { stage: "Foundations", window: "To be announced", platforms: ["Mobile", "Web"], access: "Early-access list opening soon" },
    build: {
      version: "Pre-release · Phase 0",
      channel: "Internal",
      lastUpdated: "2026",
      phases: [
        { label: "Research & design", state: "done" },
        { label: "Foundations", state: "done" },
        { label: "Core automation", state: "active" },
        { label: "Early access", state: "next" },
        { label: "Public launch", state: "next" },
      ],
    },
    fixes: [],
    reviews: [],
    screen: { title: "Automations", metric: "24/7", metricLabel: "replies running", rows: [["Rule", "Active"], ["Replies", "Today"], ["Insights", "Weekly"]] },
  },
  {
    slug: "travel",
    code: "Idea 03",
    title: "Travel Planning",
    domain: "Travel · Lifestyle",
    tagline: "Plan together. Travel better.",
    summary:
      "A smarter way to plan trips and travel with others — from the first idea to splitting the last bill.",
    problem: "Planning a trip means juggling a dozen apps, endless group chats and awkward money conversations.",
    approach: "One place that plans with you, surfaces places worth discovering, and keeps the group — and the expenses — in sync.",
    highlights: [
      { title: "Plans in minutes", text: "From idea to itinerary, fast." },
      { title: "Discover more", text: "Places worth the detour." },
      { title: "Travel together", text: "Companions and shared costs, sorted." },
    ],
    accent: "#10B981",
    accentRgb: "16, 185, 129",
    status: "In development",
    release: { stage: "Building", window: "To be announced", platforms: ["Web", "Mobile"], access: "Early-access list opening soon" },
    build: {
      version: "Pre-release",
      channel: "Internal",
      lastUpdated: "2026",
      phases: [
        { label: "Research & design", state: "done" },
        { label: "Core experience", state: "active" },
        { label: "Testing & polish", state: "next" },
        { label: "Early access", state: "next" },
        { label: "Public launch", state: "next" },
      ],
    },
    fixes: [],
    reviews: [],
    screen: { title: "Your trip", metric: "Day 2", metricLabel: "planned for you", rows: [["Morning", "Explore"], ["Afternoon", "Discover"], ["Group", "In sync"]] },
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/* ─────────────────────────── UPDATES FEED ───────────────────────────
 * Publish an update by adding it here. It appears in the "Latest updates"
 * carousel on the home page and in that product's changelog.
 */
export const UPDATES: Update[] = [
  {
    date: "2026-10-01",
    product: "mobility",
    title: "Second major internal build",
    notes: ["Redesigned experience end to end", "Expanded automated test coverage"],
  },
  {
    date: "2026-09-25",
    product: "travel",
    title: "Core experience in progress",
    notes: ["Planning flow designed", "First features being built"],
  },
  {
    date: "2026-08-20",
    product: "creator-growth",
    title: "Foundations complete",
    notes: ["Architecture and integrations set up", "Automation engine groundwork laid"],
  },
  {
    date: "2026-05-15",
    product: "mobility",
    title: "Development kicks off",
    notes: ["Use case validated", "First designs and prototypes"],
  },
];

const byNewest = (a: Update, b: Update) => b.date.localeCompare(a.date);
export const latestUpdates = (limit = 8) => [...UPDATES].sort(byNewest).slice(0, limit);
export const updatesFor = (slug: string) => UPDATES.filter((u) => u.product === slug).sort(byNewest);
export const formatUpdateDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });

/* ─────────────────────────── SERVICES ─────────────────────────── */

export const SERVICES = [
  { icon: "workflow", title: "Workflow automation", text: "Repetitive tasks, approvals, reports and hand-offs — automated end to end so your team gets hours back every week." },
  { icon: "bot", title: "AI assistants & chatbots", text: "Customer-support bots, lead qualifiers and internal knowledge assistants that actually understand your business." },
  { icon: "megaphone", title: "Social & marketing automation", text: "Auto-replies, lead capture, follow-ups and content scheduling that keep engagement flowing." },
  { icon: "smartphone", title: "Custom apps & websites", text: "Mobile apps, web apps and sites designed and built around the problem you need solved." },
  { icon: "plug", title: "Integrations & dashboards", text: "Connect the tools you already use, keep data in sync and see what matters at a glance." },
  { icon: "sparkles", title: "AI prototyping", text: "Have an idea? We'll validate it fast with a working AI-powered prototype." },
] as const;

export const SERVICE_STEPS = [
  { title: "Tell us the problem", text: "Share what's slowing you down — no jargon needed." },
  { title: "Scope & quote", text: "A free call to understand it, then a clear plan and price." },
  { title: "Build & iterate", text: "We build in short cycles and keep you in the loop." },
  { title: "Launch & support", text: "We ship it, train your team and stay around to help." },
];

/* ─────────────────────────── TECHNOLOGY ─────────────────────────── */

export const STATS = [
  { value: 3, suffix: "", label: "Ideas in build" },
  { value: 1, suffix: "", label: "Philosophy" },
  { value: 0, suffix: "", label: "Data sold. Ever." },
  { value: 24, suffix: "/7", label: "Automation" },
];

export const PILLARS = [
  { icon: "brain", title: "AI at the core", description: "Every product ships with intelligence that understands context, not just commands." },
  { icon: "workflow", title: "Automation", description: "Rules, triggers and agents that quietly do the repetitive work for you." },
  { icon: "activity", title: "Real-time insight", description: "Live data turned into decisions — as it happens, in plain language." },
  { icon: "shield", title: "Privacy first", description: "Your data stays yours. On-device wherever possible; safety features never paywalled." },
] as const;

export const CAPABILITIES = [
  { title: "Mobile", text: "Cross-platform apps for Android and iOS from a single, well-tested codebase." },
  { title: "Web", text: "Fast, modern web apps and sites — server-rendered and SEO-friendly." },
  { title: "AI & LLMs", text: "Assistants, agents and smart features built on leading AI models." },
  { title: "Automation", text: "Event-driven workflows and integrations that run around the clock." },
  { title: "Cloud & edge", text: "Serverless backends that scale on demand and stay cost-efficient." },
  { title: "Quality", text: "Automated testing from day one — reliability is a feature." },
];

/* ─────────────────────────── JOURNEY ─────────────────────────── */

export const TIMELINE = [
  { date: "May 2026", title: "Synclina is born", description: "Founded in Hyderabad with one belief: AI should simplify everyday life, not complicate it." },
  { date: "Jun 2026", title: "First ideas in motion", description: "Three everyday problems chosen — mobility, creator growth and travel — and work begins." },
  { date: "Summer 2026", title: "Building in private", description: "Research, design, prototypes and internal builds. Lots of testing, lots of learning." },
  { date: "Sep 2026", title: "Going public", description: "Synclina starts building in public on LinkedIn and Instagram." },
  { date: "Oct 2026", title: "Website & Synclina AI", description: "This website goes live — along with an AI assistant and services for businesses." },
  { date: "Next", title: "More to come…", description: "Early access, AI-powered products beyond apps, and more ideas in sync." },
];

/* ─────────────────────────── ABOUT ─────────────────────────── */

export const FOUNDER = {
  name: "Sai Sreenath Reddy Y",
  role: "Founder",
  initials: "SR",
  // Replace with the personal LinkedIn profile URL when available.
  linkedin: SITE.socials.linkedin,
  bio: [
    "Sai Sreenath Reddy Y started Synclina in May 2026 with a simple conviction: the technology to fix everyday frustrations already exists — it just isn't in sync with how people actually live.",
    "From picking the problems worth solving to designing and building the products, Sai leads every idea at Synclina — with a builder's mindset, a love for AI, and a habit of building in public.",
  ],
};
