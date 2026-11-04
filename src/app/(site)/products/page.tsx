import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ProductsSection from "@/components/sections/ProductsSection";
import PageCTA from "@/components/pages/PageCTA";

export const metadata: Metadata = {
  title: "Products",
  description: "Multiple ideas, one philosophy — AI-powered products for everyday problems, from DrivSync for drivers and riders to creators and travel.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="Products"
        title="Multiple ideas."
        accent="One philosophy."
        lead="Every idea starts with an everyday problem and an AI-first answer. DrivSync comes first, for everyday drivers and riders. The other two get their names closer to launch."
      />
      <ProductsSection />
      <PageCTA
        title="Want early"
        accent="access?"
        text="Be the first to try what we're building, or tell us which problem we should solve next."
        primary={{ label: "Join early access", href: "/contact?topic=early-access" }}
        secondary={{ label: "Follow the journey", href: "/journey" }}
      />
    </>
  );
}
