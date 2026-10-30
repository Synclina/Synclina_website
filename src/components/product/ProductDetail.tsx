"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bug,
  CalendarClock,
  Check,
  CircleDot,
  GitCommitVertical,
  Layers,
  Lock,
  MessageSquareQuote,
  Rocket,
  Sparkles,
  Star,
} from "lucide-react";
import PhoneMockup from "@/components/ui/PhoneMockup";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { openAgent } from "@/lib/agent";
import { PRODUCTS, formatUpdateDate, getProduct, updatesFor } from "@/lib/constants";
import styles from "./ProductDetail.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "release", label: "Release" },
  { id: "build", label: "Build" },
  { id: "updates", label: "Updates" },
  { id: "fixes", label: "Fixes" },
  { id: "reviews", label: "Reviews" },
];

function Empty({ icon: Icon, title, text, cta }: { icon: typeof Bug; title: string; text: string; cta?: React.ReactNode }) {
  return (
    <div className={styles.empty}>
      <Icon size={28} strokeWidth={1.5} />
      <h4>{title}</h4>
      <p>{text}</p>
      {cta}
    </div>
  );
}

export default function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const updates = updatesFor(slug);
  const root = useRef<HTMLDivElement>(null);
  const heroPhone = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("overview");
  useReveal(root);

  const idx = PRODUCTS.findIndex((p) => p.slug === slug);
  const next = PRODUCTS[(idx + 1) % PRODUCTS.length];
  const done = product.build.phases.filter((p) => p.state === "done").length;
  const progress = (done + 0.5 * product.build.phases.filter((p) => p.state === "active").length) / product.build.phases.length;

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.3 })
        .from("[data-hero-in]", { y: 50, opacity: 0, duration: 1.2, stagger: 0.08 })
        .from(`.${styles.heroVisual}`, { y: 120, rotateX: 20, opacity: 0, duration: 1.6 }, 0.1);

      TABS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setActive(id),
        });
      });

      gsap.fromTo(
        `.${styles.progressFill}`,
        { scaleX: 0 },
        { scaleX: progress, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: "#build", start: "top 70%", once: true } },
      );
      if (updates.length) gsap.fromTo(
        `.${styles.changelogLine}`,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: `.${styles.changelog}`, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
    },
    { scope: root },
  );

  const earlyAccess = `/contact?topic=early-access`;

  return (
    <div ref={root} style={{ "--accent": product.accent, "--accent-rgb": product.accentRgb } as React.CSSProperties}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <Link href="/products" className={styles.back} data-hero-in>
              <ArrowLeft size={16} /> All products
            </Link>
            <div className={styles.meta} data-hero-in>
              <span className={styles.code}>{product.code}</span>
              <span>{product.domain}</span>
              <span className={styles.status}>
                <i /> {product.status}
              </span>
            </div>
            <h1 className={styles.title} data-hero-in>
              {product.title}
            </h1>
            <p className={styles.tagline} data-hero-in>
              {product.tagline}
            </p>
            <p className={styles.desc} data-hero-in>
              {product.summary}
            </p>
            <div className={styles.ctas} data-hero-in>
              <Button href={earlyAccess}>
                <Bell size={16} /> Get early access
              </Button>
              <Button variant="secondary" onClick={() => openAgent(`Tell me about ${product.title}`)}>
                <Sparkles size={16} /> Ask the AI
              </Button>
            </div>
          </div>
          <div ref={heroPhone} className={styles.heroVisual}>
            <div className={styles.heroTilt}>
              <PhoneMockup product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky section nav ── */}
      <nav className={styles.subnav} aria-label="Product sections">
        <div className={`container ${styles.subnavInner}`}>
          {TABS.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={`${styles.tab} ${active === t.id ? styles.tabActive : ""}`}>
              {t.label}
              {t.id === "updates" && <sup>{updates.length}</sup>}
              {t.id === "fixes" && <sup>{product.fixes.length}</sup>}
              {t.id === "reviews" && <sup>{product.reviews.length}</sup>}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Overview ── */}
      <section id="overview" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Overview</span>
          <h2>The idea</h2>
        </div>
        <div className={styles.overview}>
          <div className={styles.pa} data-reveal>
            <span>The problem</span>
            <p>{product.problem}</p>
          </div>
          <div className={styles.pa} data-reveal data-reveal-delay="0.1">
            <span>Our approach</span>
            <p>{product.approach}</p>
          </div>
        </div>
        <div className={styles.highlights}>
          {product.highlights.map((h, i) => (
            <div key={h.title} className={styles.highlight} data-reveal data-reveal-delay={i * 0.08}>
              <Check size={18} />
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.secret} data-reveal>
          <Lock size={14} /> More details, including the name, will be revealed closer to launch.
        </p>
      </section>

      {/* ── Release info ── */}
      <section id="release" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Release info</span>
          <h2>When can I use it?</h2>
        </div>
        <div className={styles.infoGrid}>
          {[
            { icon: Rocket, label: "Stage", value: product.release.stage },
            { icon: CalendarClock, label: "Release window", value: product.release.window },
            { icon: Layers, label: "Platforms", value: product.release.platforms.join(" · ") },
            { icon: Bell, label: "Access", value: product.release.access },
          ].map((f, i) => (
            <div key={f.label} className={styles.info} data-reveal data-reveal-delay={i * 0.06}>
              <f.icon size={20} />
              <span>{f.label}</span>
              <strong>{f.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ── Build info ── */}
      <section id="build" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Build info</span>
          <h2>Where it stands</h2>
        </div>
        <div className={styles.buildCard} data-reveal>
          <div className={styles.buildMeta}>
            <div>
              <span>Version</span>
              <strong>{product.build.version}</strong>
            </div>
            <div>
              <span>Channel</span>
              <strong>{product.build.channel}</strong>
            </div>
            <div>
              <span>Last updated</span>
              <strong>{product.build.lastUpdated}</strong>
            </div>
          </div>
          <div className={styles.progress}>
            <div className={styles.progressFill} />
          </div>
          <ol className={styles.phases}>
            {product.build.phases.map((p) => (
              <li key={p.label} className={styles[p.state]}>
                <span className={styles.phaseDot}>{p.state === "done" ? <Check size={13} /> : <CircleDot size={13} />}</span>
                <span className={styles.phaseLabel}>{p.label}</span>
                <span className={styles.phaseState}>{p.state === "done" ? "Done" : p.state === "active" ? "In progress" : "Up next"}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Updates rolled out ── */}
      <section id="updates" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Updates rolled out</span>
          <h2>Changelog</h2>
        </div>
        {updates.length ? (
          <div className={styles.changelog}>
            <div className={styles.changelogTrack} aria-hidden="true">
              <div className={styles.changelogLine} />
            </div>
            <ol>
            {updates.map((u) => (
              <li key={u.title} data-reveal>
                <span className={styles.commit}>
                  <GitCommitVertical size={16} />
                </span>
                <div>
                  <span className={styles.updDate}>{formatUpdateDate(u.date)}</span>
                  <h3>{u.title}</h3>
                  <ul>
                    {u.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            </ol>
          </div>
        ) : (
          <Empty icon={GitCommitVertical} title="No updates yet" text="Release notes will appear here as builds roll out." />
        )}
      </section>

      {/* ── Issues fixed ── */}
      <section id="fixes" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Issues fixed</span>
          <h2>Bug fixes</h2>
        </div>
        {product.fixes.length ? (
          <ul className={styles.fixes}>
            {product.fixes.map((f) => (
              <li key={f.title} data-reveal>
                <Bug size={16} />
                <span>{f.title}</span>
                <time>{f.date}</time>
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal>
            <Empty
              icon={Bug}
              title="Nothing public yet"
              text="Fixed issues are tracked internally for now. The public log opens with early access."
            />
          </div>
        )}
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className={`container ${styles.block}`}>
        <div className={styles.blockHead} data-reveal>
          <span className="section-label">Reviews</span>
          <h2>What people say</h2>
        </div>
        {product.reviews.length ? (
          <div className={styles.reviews}>
            {product.reviews.map((r) => (
              <figure key={r.name} className={styles.review} data-reveal>
                <div className={styles.stars} aria-label={`${r.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={15} fill={i < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <strong>{r.name}</strong> · {r.role}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div data-reveal>
            <Empty
              icon={MessageSquareQuote}
              title="Be one of the first reviewers"
              text="Reviews open with early access. Join the list to try it first and shape what we build."
              cta={
                <Button href={earlyAccess}>
                  Join early access <ArrowRight size={16} />
                </Button>
              }
            />
          </div>
        )}
      </section>

      {/* ── Next ── */}
      <section className={`container ${styles.block}`}>
        <Link
          href={`/products/${next.slug}`}
          className={styles.next}
          style={{ "--next": next.accent } as React.CSSProperties}
          data-reveal
        >
          <span>Next idea · {next.code}</span>
          <strong>
            {next.title} <ArrowRight />
          </strong>
        </Link>
      </section>
    </div>
  );
}
