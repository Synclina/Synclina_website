"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Pages.module.css";

type Action = { label: string; href: string };

/** Closing call-to-action band shared by the inner pages. */
export default function PageCTA({
  title,
  accent,
  text,
  primary,
  secondary,
}: {
  title: string;
  accent: string;
  text: string;
  primary: Action;
  secondary?: Action;
}) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} className="section">
      <div className={`container ${styles.join}`} data-reveal>
        <h2>
          {title} <span className="text-gradient">{accent}</span>
        </h2>
        <p>{text}</p>
        <div className={styles.joinActions}>
          <Button href={primary.href}>
            {primary.label} <ArrowRight size={16} />
          </Button>
          {secondary && (
            <Button variant="secondary" href={secondary.href}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
