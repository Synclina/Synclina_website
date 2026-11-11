import Hero from "@/components/home/Hero";
import ProductChapters from "@/components/home/ProductChapters";
import Approach from "@/components/home/Approach";
import Flagship from "@/components/home/Flagship";
import BuildLog from "@/components/home/BuildLog";
import ClosingCTA from "@/components/home/ClosingCTA";

/* One dark surface throughout; sections are separated by spacing and a slightly raised services band. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProductChapters />
      <Approach />
      <Flagship />
      <BuildLog limit={3} />
      <ClosingCTA />
    </>
  );
}
