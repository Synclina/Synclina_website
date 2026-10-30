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
  applicationName: "Synclina",
  keywords: [
    "Synclina",
    "Synclina AI",
    "AI startup India",
    "AI products",
    "AI automation services",
    "business automation",
    "AI apps",
    "Hyderabad",
  ],
  authors: [{ name: FOUNDER.name }],
  creator: "Synclina",
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Search Console / Bing Webmaster ownership tags, set in Vercel's environment variables
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    title: "Synclina — Ideas in Sync",
    description: "Building the future, one idea at a time.",
    type: "website",
    locale: "en_IN",
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

// Lets search engines show "Synclina" as the site name in results
const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Synclina",
  alternateName: ["Synclina AI", "Synclina — Ideas in Sync"],
  url: SITE.url,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-intro="pending" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`#intro{display:none!important}html[data-intro]{overflow:auto}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, siteSchema]) }} />

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
