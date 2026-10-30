"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, FlaskConical, Zap } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Home.module.css";

const ITEMS = [
  {
    icon: Boxes,
    title: "We build AI-powered apps",
    text: "Products for everyday problems: getting around, growing online, and planning trips.",
    href: "/products",
    cta: "See the products",
  },
  {
    icon: Zap,
    title: "We automate work for businesses",
    text: "Chatbots, auto-replies, workflows and custom builds that save your team hours every week.",
    href: "/services",
    cta: "See our services",
  },
  {
    icon: FlaskConical,
    title: "We're exploring what's next",
    text: "AI-powered products beyond the phone screen, built on the same human-first philosophy.",
    href: "/journey",
    cta: "Follow the journey",
  },
];

export default function WhatWeDo() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} className="section">
      <div className="container">
        <header className="section-header">
          <span className="section-label" data-reveal>
            What we do
          </span>
          <h2 data-reveal>
            Multiple ideas. <span className="text-gradient">One philosophy.</span>
          </h2>
          <p data-reveal>AI should make everyday life simpler, not more complicated. Everything we build follows that idea.</p>
        </header>

        <div className={styles.three}>
          {ITEMS.map((item, i) => (
            <Link key={item.title} href={item.href} className={styles.doCard} data-reveal data-reveal-delay={i * 0.08}>
              <span className={styles.doIcon}>
                <item.icon size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className={styles.more}>
                {item.cta} <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
