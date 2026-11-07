import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ServicesContent from "@/components/pages/ServicesContent";
import Flagship from "@/components/home/Flagship";
import ClosingCTA from "@/components/home/ClosingCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Need something automated? Synclina builds workflow automation, AI assistants, chatbots, custom apps and integrations for businesses and creators.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title="Automations and custom builds"
        accent="for businesses."
        lead="Repetitive tasks, customer replies, reports, a chatbot or a whole app. Tell us what's slowing you down. We'll scope it, quote it and build it."
      />
      <Flagship />
      <ServicesContent />
      <ClosingCTA />
    </>
  );
}
