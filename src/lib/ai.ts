import { FOUNDER, PRODUCTS, SERVICES, SITE } from "./constants";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const productBrief = PRODUCTS.map(
  (p) =>
    `### ${p.code}: ${p.title} (${p.domain}) — status: ${p.status}, release: ${p.release.window}\nTagline: ${p.tagline}\n${p.summary}\nPage: /products/${p.slug}`,
).join("\n\n");

export const SYSTEM_PROMPT = `You are Synclina AI, the assistant on the website of Synclina — a human-first AI studio whose tagline is "Ideas in Sync."

ABOUT SYNCLINA
- Founded in ${SITE.founded} in ${SITE.location} by ${FOUNDER.name} (${FOUNDER.role}).
- "Multiple ideas, one philosophy": builds AI-powered products for everyday problems — apps today, and AI-powered products beyond apps in the future.
- Values: AI at the core, privacy-first, community-driven, safety features never paywalled.
- Early-stage and honest about it: "Just getting started. A lot more to come."
- Contact: ${SITE.email} or the /contact page. LinkedIn and Instagram (@synclina.ai).

PRODUCTS (in development — described by use case only)
${productBrief}

SERVICES (for businesses and individuals — page: /services)
${SERVICES.map((s) => `- ${s.title}: ${s.text}`).join("\n")}
Process: tell us the problem → free scoping call & quote → build & iterate → launch & support.

HOW TO BEHAVE
- Be warm, enthusiastic and concise (usually under 120 words). Short paragraphs or bullet lists; markdown bold is fine.
- IMPORTANT: product names are confidential. Never reveal or guess product names, internal codenames beyond "Idea 01/02/03", tech stacks, metrics or release dates. If asked, say details will be shared closer to launch.
- Never invent pricing, launch dates, download links, user numbers or team details.
- If someone wants something automated or built, get excited, ask one clarifying question, and invite them to /contact?topic=service to get a free scoping call and quote.
- Point people to pages when relevant: /products, /services, /technology, /journey, /about, /contact.
- For unrelated questions, answer briefly if harmless, then steer back.`;

/** Offline answers used when no Gemini key is configured. */
export function localAnswer(question: string): string {
  const q = question.toLowerCase();
  const product = PRODUCTS.find(
    (p) => q.includes(p.slug.replace("-", " ")) || q.includes(p.title.toLowerCase()) || q.includes(p.code.toLowerCase()) || p.domain.toLowerCase().split(/[ ·&]+/).some((w) => w.length > 4 && q.includes(w)),
  );

  if (/automat|service|hire|deal|quote|client|business|chatbot|bot\b|build (me|us|my)|website|app for/.test(q)) {
    return `Yes — we help businesses and individuals automate the work that slows them down. ⚡\n\n${SERVICES.slice(0, 4)
      .map((s) => `- **${s.title}**`)
      .join("\n")}\n\nTell us what you'd like automated on the [contact page](/contact?topic=service) — we'll set up a free scoping call and send a clear quote. More on our [services page](/services).`;
  }
  if (product) {
    return `**${product.code} · ${product.title}** — ${product.tagline}\n\n${product.summary}\n\n${product.highlights
      .map((h) => `- **${h.title}:** ${h.text}`)
      .join("\n")}\n\nStatus: ${product.status}. Release: ${product.release.window}. Follow along on the [${product.title} page](/products/${product.slug}).`;
  }
  if (/name|called|launch|release|when/.test(q)) {
    return `We're keeping names and launch dates under wraps for now 🤫 — they'll be shared closer to launch. Follow us on [Instagram](${SITE.socials.instagram}) or [LinkedIn](${SITE.socials.linkedin}) to be the first to know.`;
  }
  if (/idea|collab|partner|work with/.test(q)) {
    return `We love that! 🚀 Synclina is all about turning ideas into intelligent products.\n\nWhat problem does your idea solve, and who is it for? Share a few details on our [contact page](/contact?topic=idea) — we read every message.`;
  }
  if (/founder|who (made|built|runs)|team|sreenath/.test(q)) {
    return `Synclina was founded in ${SITE.founded} by **${FOUNDER.name}** in ${SITE.location}. Read the story on our [about page](/about).`;
  }
  if (/tech|stack|model|privacy/.test(q)) {
    return `We build across **mobile, web, AI and automation** — with privacy first: your data stays yours, on-device wherever possible. More on our [technology page](/technology).`;
  }
  if (/product|what do you|offer|apps?\b/.test(q)) {
    return `Multiple ideas, one philosophy. Right now we're building:\n\n${PRODUCTS.map((p) => `- **${p.title}** — ${p.tagline}`).join("\n")}\n\nAnd we help businesses with automation and AI services. See [products](/products) or [services](/services).`;
  }
  return `**Synclina** is a human-first AI studio — *Ideas in Sync.* We build intelligent products for everyday problems, and help businesses automate the work that slows them down.\n\nAsk me about our products, our services, or how we could help you.`;
}
