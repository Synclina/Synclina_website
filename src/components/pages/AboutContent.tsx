"use client";

import { useRef } from "react";
import { BrainCircuit, Cpu, Lightbulb, MapPin, ShieldCheck, Smartphone, Users, Workflow } from "lucide-react";
import SynclinaMark from "@/components/brand/SynclinaMark";
import SocialIcon from "@/components/ui/SocialIcons";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { FOUNDER, SITE } from "@/lib/constants";
import styles from "./Pages.module.css";

const FACTS = [
  { label: "Founded", value: SITE.founded },
  { label: "Based in", value: SITE.location },
  { label: "Focus", value: "AI products & automation" },
  { label: "Stage", value: "Building in public" },
];

const WHAT = [
  { icon: Cpu, title: "AI-powered platforms", text: "Intelligent systems that learn, assist and automate, with humans firmly in control." },
  { icon: Smartphone, title: "Consumer & productivity apps", text: "Everyday tools that make driving, creating and travelling simpler." },
  { icon: Workflow, title: "Automation for businesses", text: "Custom automations, assistants and builds that give teams their time back." },
];

const VALUES = [
  { icon: ShieldCheck, title: "Privacy", text: "Your data stays yours. We collect only what makes the product better for you." },
  { icon: BrainCircuit, title: "Human-first AI", text: "AI that assists, explains itself and stays honest about what it doesn't know." },
  { icon: Users, title: "Community", text: "Every product grows with the people who use it, and they shape what comes next." },
  { icon: Lightbulb, title: "Open ideas", text: "Good ideas come from anywhere. We share what we learn and listen to what you need." },
];

export default function AboutContent() {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root}>
      {/* ── The company ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.facts}>
            {FACTS.map((f, i) => (
              <div key={f.label} className={styles.fact} data-reveal data-reveal-delay={i * 0.06}>
                <span>{f.label}</span>
                <strong>{f.value}</strong>
              </div>
            ))}
          </div>

          <div className={styles.story}>
            <div data-reveal>
              <span className="section-label">The company</span>
              <h2>
                Human-first AI that turns ideas into <span className="text-gradient">useful products.</span>
              </h2>
            </div>
            <div className={styles.storyBody}>
              <p data-reveal>
                So much of everyday life is still harder than it needs to be: running a vehicle, growing an audience,
                planning a trip with friends, or keeping a small business on top of its busywork. The technology to fix it
                exists. It just isn&apos;t in sync with how people actually live.
              </p>
              <p data-reveal data-reveal-delay="0.1">
                Synclina exists to close that gap. Each idea starts with a real problem, puts intelligence at its core,
                and treats privacy as non-negotiable. Today that means apps and automation. Tomorrow it means AI-powered
                products beyond the screen.
              </p>
              <p data-reveal data-reveal-delay="0.2">
                <strong>Multiple ideas, one philosophy. Just getting started, with a lot more to come.</strong>
              </p>
            </div>
          </div>

          <div className={styles.whatGrid}>
            {WHAT.map((w, i) => (
              <div key={w.title} className={styles.what} data-reveal data-reveal-delay={i * 0.08}>
                <w.icon size={24} strokeWidth={1.6} />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The founder ── */}
      <section className="section">
        <div className={`container ${styles.founder}`}>
          <div ref={card} className={styles.founderCardWrap} data-reveal>
            <div className={styles.founderCard}>
              <div className={styles.founderGlow} aria-hidden="true" />
              <div className={styles.monogram}>{FOUNDER.initials}</div>
              <div className={styles.founderBadge}>
                <SynclinaMark size={18} /> {FOUNDER.role}
              </div>
              <h3>{FOUNDER.name}</h3>
              <span className={styles.founderMeta}>
                <MapPin size={14} /> {SITE.location}
              </span>
            </div>
          </div>
          <div className={styles.founderText}>
            <span className="section-label" data-reveal>
              The founder
            </span>
            <h2 data-reveal data-reveal-delay="0.05">
              The person behind <span className="text-gradient">the sync.</span>
            </h2>
            {FOUNDER.bio.map((para, i) => (
              <p key={i} data-reveal data-reveal-delay={0.1 + i * 0.08}>
                {para}
              </p>
            ))}
            <div className={styles.joinActions} style={{ justifyContent: "flex-start" }} data-reveal data-reveal-delay="0.25">
              <Button href={FOUNDER.linkedin}>
                <SocialIcon name="linkedin" size={16} /> Connect on LinkedIn
              </Button>
              <Button variant="secondary" href="/contact">
                Say hello
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & mission ── */}
      <section className="section">
        <div className="container">
          <div className={styles.mission}>
            <div data-reveal>
              <span className="section-label">Vision</span>
              <h3>A world where technology quietly understands you, and then gets out of the way.</h3>
            </div>
            <div data-reveal data-reveal-delay="0.1">
              <span className="section-label">Mission</span>
              <h3>Turn everyday problems into intelligent, private, delightful products, one idea at a time.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <span className="section-label" data-reveal>
              What we value
            </span>
            <h2 data-reveal data-reveal-delay="0.1">
              Principles we <span className="text-gradient">build by.</span>
            </h2>
          </header>
          <div className={styles.values}>
            {VALUES.map((v, i) => (
              <div key={v.title} className={`glass-card ${styles.value}`} data-reveal data-reveal-delay={i * 0.08}>
                <v.icon size={26} strokeWidth={1.6} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
