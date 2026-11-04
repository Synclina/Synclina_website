import HeroSection from "@/components/sections/HeroSection";
import WhatWeDo from "@/components/sections/WhatWeDo";
import UpdatesCarousel from "@/components/sections/UpdatesCarousel";
import ProductsOverview from "@/components/sections/ProductsOverview";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatWeDo />
      <UpdatesCarousel />
      <ProductsOverview />
      <CTASection />
    </>
  );
}
