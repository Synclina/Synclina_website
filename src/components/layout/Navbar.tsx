"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import SynclinaMark from "@/components/brand/SynclinaMark";
import SynclinaWordmark from "@/components/brand/SynclinaWordmark";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={styles.navbar}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <Link href="/" className={styles.logo} aria-label="Synclina home">
          <SynclinaMark size={28} />
          <SynclinaWordmark height={12} />
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${isActive(link.href) ? styles.active : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>
          Get in touch
        </Link>

        <button
          className={styles.toggle}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`${styles.mobileLink} ${isActive(link.href) ? styles.active : ""}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      )}
    </header>
  );
}
