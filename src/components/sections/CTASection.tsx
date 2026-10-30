"use client";

import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { openAgent } from "@/lib/agent";
import styles from "./CTASection.module.css";

export default function CTASection() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className="section">
      <div className="container">
        <div className={styles.panel} data-reveal>
          <div>
            <h2 className={styles.title}>
              Need something automated? <span className="text-gradient">Let&apos;s talk.</span>
            </h2>
            <p>
              Tell us what&apos;s slowing you down, or pitch us your idea. The first call is free, and you&apos;ll get a
              clear plan and price.
            </p>
          </div>
          <div className={styles.actions}>
            <Button href="/contact?topic=service">
              Request a service <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" onClick={() => openAgent()}>
              <Sparkles size={16} /> Ask Synclina AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
