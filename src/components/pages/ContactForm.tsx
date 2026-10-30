"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, MapPin, Sparkles } from "lucide-react";
import SocialIcon, { type SocialName } from "@/components/ui/SocialIcons";
import Button from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { openAgent } from "@/lib/agent";
import { SITE } from "@/lib/constants";
import styles from "./Pages.module.css";

export const TOPICS = {
  service: "Request a service / automation",
  idea: "I have a product idea",
  "early-access": "Early access to a product",
  partnership: "Collaboration / partnership",
  feedback: "Feedback",
  other: "Just saying hi",
} as const;
type Topic = keyof typeof TOPICS;

const BUDGETS = ["Not sure yet", "Under ₹50k", "₹50k – ₹2L", "₹2L – ₹5L", "₹5L+"];
const TIMELINES = ["Flexible", "ASAP", "Within a month", "1–3 months", "3+ months"];

export default function ContactForm() {
  const params = useSearchParams();
  const initial = (params.get("topic") ?? "") in TOPICS ? (params.get("topic") as Topic) : "service";
  const [topic, setTopic] = useState<Topic>(initial);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const isService = topic === "service";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    data.category = TOPICS[topic];
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      if (json.delivered) {
        setState("sent");
        return;
      }
      // No mail service configured: hand off to the visitor's email app with everything prefilled.
      const subject = `[Website] ${data.category} from ${data.name}`;
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.company && `Company: ${data.company}`,
        `Topic: ${data.category}`,
        data.budget && `Budget: ${data.budget}`,
        data.timeline && `Timeline: ${data.timeline}`,
        "",
        data.message,
      ]
        .filter((l) => l !== undefined && l !== "")
        .join("\n");
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("mailto");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  };

  const socials = Object.entries(SITE.socials) as [SocialName, string][];

  return (
    <section ref={root} className="section" style={{ paddingTop: 0 }}>
      <div className={`container ${styles.contactGrid}`}>
        <div className={`glass-card ${styles.formCard}`} data-reveal>
          {state === "sent" || state === "mailto" ? (
            <div className={styles.sent}>
              <CheckCircle2 size={44} />
              <h3>{state === "sent" ? "Message received!" : "Almost there!"}</h3>
              <p>
                {state === "sent"
                  ? "Thanks for reaching out. We read every message and will get back to you soon."
                  : "Your email app should have opened with your message ready. Just hit send."}
              </p>
              {state === "mailto" && (
                <a href={`mailto:${SITE.email}`} className={styles.mail}>
                  Or email {SITE.email}
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className={styles.form}>
              <fieldset className={styles.topics}>
                <legend>What can we help with?</legend>
                {(Object.keys(TOPICS) as Topic[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`${styles.topic} ${topic === t ? styles.topicActive : ""}`}
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                  >
                    {TOPICS[t]}
                  </button>
                ))}
              </fieldset>

              <div className={styles.row}>
                <label>
                  <span>Name</span>
                  <input name="name" required maxLength={100} placeholder="Your name" autoComplete="name" />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" required maxLength={200} placeholder="you@example.com" autoComplete="email" />
                </label>
              </div>

              {isService && (
                <>
                  <label>
                    <span>Company / brand (optional)</span>
                    <input name="company" maxLength={120} placeholder="Where do you work, or what's your brand?" />
                  </label>
                  <div className={styles.row}>
                    <label>
                      <span>Budget</span>
                      <select name="budget" defaultValue={BUDGETS[0]}>
                        {BUDGETS.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Timeline</span>
                      <select name="timeline" defaultValue={TIMELINES[0]}>
                        {TIMELINES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </>
              )}

              <label>
                <span>{isService ? "What would you like automated or built?" : "Message"}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  placeholder={
                    isService
                      ? "e.g. We reply to 200 Instagram DMs a day by hand, and want leads captured into a sheet automatically…"
                      : "Tell us everything…"
                  }
                />
              </label>
              {/* Honeypot for bots */}
              <input name="website" tabIndex={-1} autoComplete="off" className={styles.hp} aria-hidden="true" />
              {state === "error" && <p className={styles.error}>{error}</p>}
              <Button type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : isService ? "Request a quote" : "Send message"} <ArrowRight size={16} />
              </Button>
            </form>
          )}
        </div>

        <aside className={styles.aside}>
          <div id="ai" className={`glass-card ${styles.asideCard}`} data-reveal data-reveal-delay="0.1">
            <Sparkles size={22} />
            <h3>Or just talk to our AI</h3>
            <p>Instant answers about what we&apos;re building, our services, and how we could help.</p>
            <Button variant="secondary" onClick={() => openAgent()}>
              Open Synclina AI
            </Button>
          </div>
          <div className={`glass-card ${styles.asideCard}`} data-reveal data-reveal-delay="0.2">
            <Mail size={22} />
            <h3>Reach us directly</h3>
            <a href={`mailto:${SITE.email}`} className={styles.mail}>
              {SITE.email}
            </a>
            <span className={styles.location}>
              <MapPin size={14} /> {SITE.location}
            </span>
            <div className={styles.socialRow}>
              {socials.map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noreferrer" aria-label={`Synclina on ${k}`}>
                  <SocialIcon name={k} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
