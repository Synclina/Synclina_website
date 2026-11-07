import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import TechSection from "@/components/sections/TechSection";
import Capabilities from "@/components/pages/Capabilities";
import ClosingCTA from "@/components/home/ClosingCTA";

export const metadata: Metadata = {
  title: "Technology",
  description: "How Synclina builds: AI at the core, automation everywhere, real-time insight and privacy first.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        label="Technology & AI DNA"
        title="Built on four"
        accent="pillars."
        lead="Every product we ship shares the same core: intelligence that helps, automation that frees you, and respect for your data."
      />
      <TechSection bare />
      <Capabilities />
      <ClosingCTA title="Put this to work for you." sub="We use the same approach on automations and custom builds for businesses." label="Explore services" href="/services" />
    </>
  );
}
