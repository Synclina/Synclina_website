import type { MetadataRoute } from "next";
import { PRODUCTS, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/products", "/services", "/technology", "/build-log", "/about", "/contact", "/legal", "/legal/drivsync/privacy", "/legal/drivsync/terms", "/legal/drivsync/delete-account", ...PRODUCTS.map((p) => `/products/${p.slug}`)];
  return routes.map((r) => ({
    url: `${SITE.url}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
