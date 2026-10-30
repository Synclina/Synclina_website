import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ProductsSection from "@/components/sections/ProductsSection";
import PageCTA from "@/components/pages/PageCTA";

export const metadata: Metadata = {
  title: "Products",
  description: "Multiple ideas, one philosophy — AI-powered products for everyday problems, from mobility to creators to travel.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="Products"
        title="Multiple ideas."
        accent="One philosophy."
        lead="Every idea starts with an everyday problem and an AI-first answer. Here's what's in the works. Names and details will be revealed closer to launch."
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
