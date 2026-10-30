import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import TechSection from "@/components/sections/TechSection";
import Capabilities from "@/components/pages/Capabilities";
import PageCTA from "@/components/pages/PageCTA";

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
      <PageCTA
        title="Want this tech"
        accent="working for you?"
        text="We put the same stack to work on automations and custom builds for businesses."
        primary={{ label: "Explore services", href: "/services" }}
        secondary={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
