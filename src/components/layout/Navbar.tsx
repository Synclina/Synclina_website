"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SynclinaMark from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import { NAV_LINKS } from "@/lib/constants";
import { getLenis } from "@/lib/scroll";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  // Transparent over the hero, solid after 80px, hides on the way down and returns on the way up
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 80);
      if (Math.abs(y - last) > 4) setHidden(y > 120 && y > last);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lock the page behind the full-screen menu
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`${styles.bar} ${solid || open ? styles.solid : ""} ${hidden && !open ? styles.hidden : ""} ${open ? styles.isOpen : ""}`}
    >
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <Link href="/" className={styles.logo} aria-label="Synclina home">
          <SynclinaMark size={26} />
          <SynclinaWordmark height={11} />
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`link-draw ${styles.link}`} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/contact?topic=service" className={`btn btn-primary btn-sm ${styles.cta}`}>
          Book a call
        </Link>

        <button
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-menu" className={styles.menu} hidden={!open}>
        <ul>
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} className="line" style={{ "--i": i } as React.CSSProperties}>
              <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                <span>{l.label}</span>
              </Link>
            </li>
          ))}
          <li className="line" style={{ "--i": NAV_LINKS.length } as React.CSSProperties}>
            <Link href="/contact">
              <span>Contact</span>
            </Link>
          </li>
        </ul>
        <Link href="/contact?topic=service" className="btn btn-primary">
          Book a free call
        </Link>
      </div>
    </header>
  );
}
