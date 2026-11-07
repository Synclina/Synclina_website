import Hero from "@/components/home/Hero";
import ProofStrip from "@/components/home/ProofStrip";
import ProductChapters from "@/components/home/ProductChapters";
import Approach from "@/components/home/Approach";
import Flagship from "@/components/home/Flagship";
import BuildLog from "@/components/home/BuildLog";
import ClosingCTA from "@/components/home/ClosingCTA";

/* Surfaces alternate: Night, Paper, Paper (dark stage), Night, Paper, Night, Paper, then the Night footer. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <ProductChapters />
      <Approach />
      <Flagship />
      <BuildLog limit={5} />
      <ClosingCTA />
    </>
  );
}
