import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ServicesContent from "@/components/pages/ServicesContent";
import PageCTA from "@/components/pages/PageCTA";

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
        title="Need something"
        accent="automated?"
        lead="Repetitive tasks, customer replies, reports, a chatbot or a whole app. Tell us what's slowing you down. We'll scope it, quote it and build it."
      />
      <ServicesContent />
      <PageCTA
        title="Let's make"
        accent="a deal."
        text="Tell us what you'd like automated or built. The first call is free, and you'll get a clear plan and price."
        primary={{ label: "Request a service", href: "/contact?topic=service" }}
        secondary={{ label: "Ask our AI first", href: "/contact?topic=service#ai" }}
      />
    </>
  );
}
