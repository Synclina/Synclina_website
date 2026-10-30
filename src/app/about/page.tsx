import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import AboutContent from "@/components/pages/AboutContent";
import PageCTA from "@/components/pages/PageCTA";
import { FOUNDER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Synclina is a human-first AI studio founded in May 2026 in Hyderabad by ${FOUNDER.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Synclina"
        title="Ideas, built to stay"
        accent="in sync."
        lead="A human-first AI studio from Hyderabad, turning everyday problems into intelligent products and helping businesses automate the rest."
      />
      <AboutContent />
      <PageCTA
        title="Join the"
        accent="journey."
        text="Follow along, try our products early, or bring us the next idea worth building."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "See the journey", href: "/journey" }}
      />
    </>
  );
}
