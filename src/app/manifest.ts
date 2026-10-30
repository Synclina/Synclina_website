import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Synclina — Ideas in Sync",
    short_name: "Synclina",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050508",
    theme_color: "#050508",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/images/logos/synclina-mark.png", sizes: "1433x1098", type: "image/png" },
    ],
  };
}
