import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Intro from "@/components/intro/Intro";
import MotionLayer from "@/components/motion/MotionLayer";
import BackToTop from "@/components/ui/BackToTop";
import AgentWidget from "@/components/ai/AgentWidget";
import { FOUNDER, SITE } from "@/lib/constants";
import "../globals.css";

const display = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Synclina | AI products and automation, built in Hyderabad",
    template: "%s · Synclina",
  },
  description:
    "Synclina is an AI product studio in Hyderabad. We build our own AI apps, starting with DrivSync, and custom automations for businesses tired of repetitive tasks.",
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
  themeColor: "#07050F",
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
    <html lang="en" suppressHydrationWarning data-intro="pending" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(d){d.classList.add("js");try{if(sessionStorage.getItem("synclina-intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("intro-seen")}catch(e){}})(document.documentElement)` }} />
        <noscript>
          <style>{`#intro{display:none!important}html[data-intro]{overflow:auto}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, siteSchema]) }} />

        <div id="site">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </div>

        <MotionLayer />
        <BackToTop />
        <AgentWidget />
        <Intro />
      </body>
    </html>
  );
}
