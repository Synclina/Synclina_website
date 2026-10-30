import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoorIntro from "@/components/intro/DoorIntro";
import BackToTop from "@/components/ui/BackToTop";
import AgentWidget from "@/components/ai/AgentWidget";
import { FOUNDER, SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Synclina — Ideas in Sync | Human-first AI products & automation",
    template: "%s · Synclina",
  },
  description:
    "Synclina is a human-first AI studio building intelligent products for everyday problems — and helping businesses automate the work that slows them down.",
  keywords: ["Synclina", "AI", "automation", "AI products", "AI services", "Hyderabad", "startup"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Synclina — Ideas in Sync",
    description: "Building the future, one idea at a time.",
    type: "website",
    siteName: "Synclina",
    images: [{ url: "/images/logos/synclina9.png", width: 1254, height: 1254, alt: "Synclina — Ideas in Sync" }],
  },
  twitter: { card: "summary_large_image", title: "Synclina — Ideas in Sync", images: ["/images/logos/synclina9.png"] },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Synclina",
  url: SITE.url,
  logo: `${SITE.url}/images/logos/synclina-mark.png`,
  foundingDate: "2026-05",
  email: SITE.email,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  founder: { "@type": "Person", name: FOUNDER.name },
  slogan: "Ideas in Sync.",
  sameAs: Object.values(SITE.socials),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-intro="pending" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`#intro{display:none!important}html[data-intro]{overflow:auto}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

        <div className="grid-background" aria-hidden="true" />

        <div id="site">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </div>

        <BackToTop />
        <AgentWidget />
        <DoorIntro />
      </body>
    </html>
  );
}
