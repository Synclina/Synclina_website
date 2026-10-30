"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check, FlaskConical } from "lucide-react";
import PhoneMockup from "@/components/ui/PhoneMockup";
import { useReveal } from "@/hooks/useReveal";
import { PRODUCTS, type Product } from "@/lib/constants";
import styles from "./ProductsSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLElement>(null);

  return (
    <article
      ref={ref}
      className={`${styles.card} ${index % 2 ? styles.reverse : ""}`}
      style={{ "--accent": product.accent, "--accent-rgb": product.accentRgb } as React.CSSProperties}
      data-product-card
    >
      <div className={styles.spotlight} aria-hidden="true" />
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.index}>{product.code}</span>
          <span className={styles.domain}>{product.domain}</span>
          <span className={styles.status}>{product.status}</span>
        </div>
        <h3 className={styles.name}>{product.title}</h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.desc}>{product.summary}</p>
        <ul className={styles.highlights}>
          {product.highlights.map((h) => (
            <li key={h.title}>
              <Check size={15} /> {h.title}
            </li>
          ))}
        </ul>
        <Link href={`/products/${product.slug}`} className={styles.link}>
          Release info, updates &amp; more <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className={styles.visual}>
        <div className={styles.halo} aria-hidden="true" />
        <div className={styles.tilt}>
          <PhoneMockup product={product} />
        </div>
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-product-card]").forEach((card) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="products" className={`section ${styles.products}`}>
      <div className="container">
        <div className={styles.list}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}

          <article className={styles.lab} data-product-card>
            <FlaskConical size={30} strokeWidth={1.5} />
            <div>
              <span className={styles.index}>Idea 04 → ∞</span>
              <h3>In the lab: beyond apps.</h3>
              <p>
                Next up are AI-powered products that go beyond your phone screen. They&apos;re being explored quietly
                and will be announced when they&apos;re ready.
              </p>
            </div>
            <Link href="/contact?topic=idea" className={styles.link}>
              Pitch us an idea <ArrowUpRight size={18} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
