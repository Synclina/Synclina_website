"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Console.module.css";

export default function ConsoleNav({ base, apps }: { base: string; apps: { slug: string; title: string }[] }) {
  const path = usePathname();
  const links = [
    { href: `${base}/home`, label: "Overview" },
    ...apps.map((a) => ({ href: `${base}/apps/${a.slug}`, label: a.title })),
    { href: `${base}/activity`, label: "Activity" },
  ];
  return (
    <nav className={styles.nav} aria-label="Admin">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? styles.navActive : styles.navLink} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
