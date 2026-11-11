"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, isoDay, latestUpdates, productBySlug } from "@/lib/constants";
import { prefersReducedMotion } from "@/lib/scroll";
import styles from "./BuildLog.module.css";

const ENTRIES = latestUpdates(100);
const FILTERS = [{ slug: "all", label: "All" }, ...PRODUCTS.map((p) => ({ slug: p.slug, label: p.title }))];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function relative(iso: string, now: number) {
  const days = Math.round((new Date(isoDay(iso) + "T00:00:00+05:30").getTime() - now) / 86_400_000);
  const abs = Math.abs(days);
  if (abs < 7) return rtf.format(days, "day");
  if (abs < 31) return rtf.format(Math.round(days / 7), "week");
  if (abs < 365) return rtf.format(Math.round(days / 30.4), "month");
  return rtf.format(Math.round(days / 365), "year");
}

type Props = { heading?: boolean; limit?: number; id?: string };

/** The studio's build log: every dated update, filterable, newest first. Reads src/data/log.json. */
export default function BuildLog({ heading = true, limit, id = "build-log" }: Props) {
  const [filter, setFilter] = useState("all");
  const [now, setNow] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const prev = useRef(new Map<string, DOMRect>());

  useEffect(() => setNow(Date.now()), []);

  const rows = ENTRIES.filter((e) => filter === "all" || e.product === filter).slice(0, limit);

  // FLIP: rows that stay slide to their new place in 300ms
  const choose = (slug: string) => {
    prev.current = new Map(
      Array.from(list.current?.children ?? []).map((el) => [(el as HTMLElement).dataset.key!, el.getBoundingClientRect()]),
    );
    setFilter(slug);
  };

  useLayoutEffect(() => {
    if (!list.current || !prev.current.size || prefersReducedMotion()) return;
    Array.from(list.current.children).forEach((el) => {
      const node = el as HTMLElement;
      const before = prev.current.get(node.dataset.key!);
      const after = node.getBoundingClientRect();
      if (!before) {
        node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "cubic-bezier(.16,1,.3,1)" });
        return;
      }
      const dy = before.top - after.top;
      if (dy) node.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 300, easing: "cubic-bezier(.16,1,.3,1)" });
    });
    prev.current.clear();
  }, [filter]);

  const newest = ENTRIES[0];

  return (
    <section id={id} className={`surface-night section ${styles.log}`}>
      <div className="container">
        {heading && (
          <div className={styles.head}>
            <div>
              <p className="eyebrow">Build log</p>
              <h2>What changed, and when.</h2>
            </div>
            {limit && (
              <Link href="/build-log" className={styles.all}>
                Full log <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}

        {/* A short preview (home) is just the latest few; filtering lives on the full log */}
        {!limit && (
          <div className={styles.filters} role="group" aria-label="Filter the build log by product">
            {FILTERS.map((f) => (
              <button
                key={f.slug}
                className={styles.chip}
                aria-pressed={filter === f.slug}
                onClick={() => choose(f.slug)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <ol ref={list} className={styles.rows}>
          {rows.map((e, i) => {
            const product = productBySlug(e.product);
            const key = `${e.date}-${e.title}`;
            return (
              <li key={key} data-key={key} data-reveal style={{ "--i": Math.min(i, 6) * 0.57 } as React.CSSProperties} className={styles.row}>
                <time dateTime={e.date} className={styles.date}>
                  {e.date}
                  <small suppressHydrationWarning>{now ? relative(e.date, now) : " "}</small>
                </time>
                <div className={styles.what}>
                  <h3>
                    {e === newest && <i className={styles.dot} aria-label="Newest" />}
                    {e.title}
                  </h3>
                  {e.notes.length > 0 && <p>{e.notes.join(" · ")}</p>}
                </div>
                {product && (
                  <Link href={`/products/${product.slug}`} className={styles.tag}>
                    {product.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
