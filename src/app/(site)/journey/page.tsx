import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import TimelineSection from "@/components/sections/TimelineSection";
import PageCTA from "@/components/pages/PageCTA";

export const metadata: Metadata = {
  title: "Journey",
  description: "Synclina's journey so far: from May 2026 to today, and what's next.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <PageHero
        label="The journey"
        title="Just getting"
        accent="started."
        lead="Synclina began in May 2026. Here's where we've been, and where we're headed next."
      />
      <TimelineSection bare />
      <PageCTA
        title="Come along for"
        accent="the ride."
        text="We build in public. Follow along on LinkedIn and Instagram, or be first in line for early access."
        primary={{ label: "Join early access", href: "/contact?topic=early-access" }}
        secondary={{ label: "About Synclina", href: "/about" }}
      />
    </>
  );
}
