import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ProductChapters from "@/components/home/ProductChapters";
import ClosingCTA from "@/components/home/ClosingCTA";

export const metadata: Metadata = {
  title: "Products",
  description: "DrivSync for drivers and riders, Creator Automation for creators and small businesses, and Travel Planning for trips with others. Stages and updates for each.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="Products"
        title="Multiple ideas."
        accent="One philosophy."
        lead="Every product starts with an everyday problem. DrivSync comes first, for everyday drivers and riders. The other two get their names closer to launch."
      />
      <ProductChapters heading={false} />
      <ClosingCTA title="Want early access?" sub="Be first to try what we're building, or tell us which problem to solve next." label="Join early access" href="/contact?topic=early-access" />
    </>
  );
}
