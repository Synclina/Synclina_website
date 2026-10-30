import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/pages/PageHero";
import ContactForm from "@/components/pages/ContactForm";

export const metadata: Metadata = {
  title: "Get in touch",
  description:
    "Need something automated, have an idea, or want early access? Get in touch with Synclina. We'll scope it, quote it and build it.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Get in touch"
        title="Let's build something"
        accent="together."
        lead="Want something automated, have an idea, or just want to say hi? Tell us below. The first call is always free."
      />
      <Suspense>
        <ContactForm />
      </Suspense>
    </>
  );
}
