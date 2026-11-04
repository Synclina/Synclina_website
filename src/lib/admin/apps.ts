import { PRODUCTS } from "../constants";

/** Every app on the site gets a page. Add a slug here once an app starts sending tickets. */
const WITH_TICKETS = ["drivsync"];

export const ADMIN_APPS = PRODUCTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  accent: p.accent,
  takesTickets: WITH_TICKETS.includes(p.slug),
}));

export const adminApp = (slug: string) => ADMIN_APPS.find((a) => a.slug === slug);
