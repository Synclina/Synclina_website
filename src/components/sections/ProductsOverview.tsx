"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { PRODUCTS } from "@/lib/constants";
import styles from "./Home.module.css";

/** Compact product cards for the home page; the full story lives on /products. */
export default function ProductsOverview() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className="section">
      <div className="container">
        <header className={styles.rowHead}>
          <div data-reveal>
            <span className="section-label">Products</span>
            <h2>What we&apos;re building</h2>
          </div>
          <div data-reveal>
            <Button variant="secondary" href="/products">
              All products <ArrowRight size={16} />
            </Button>
          </div>
        </header>

        <div className={styles.three}>
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={styles.productCard}
              style={{ "--accent": p.accent, "--accent-rgb": p.accentRgb } as React.CSSProperties}
              data-reveal
              data-reveal-delay={i * 0.08}
            >
              <div className={styles.productTop}>
                <span className={styles.code}>{p.code}</span>
                <span className={styles.status}>{p.status}</span>
              </div>
              <h3>{p.title}</h3>
              <p className={styles.productTag}>{p.tagline}</p>
              <p>{p.summary}</p>
              <span className={styles.more}>
                Details &amp; updates <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
