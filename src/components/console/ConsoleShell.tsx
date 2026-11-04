import Link from "next/link";
import SynclinaMark from "@/components/brand/SynclinaMark";
import { ADMIN_APPS } from "@/lib/admin/apps";
import SignOutButton from "./SignOutButton";
import styles from "./Console.module.css";

export default function ConsoleShell({ base, active, children }: { base: string; active: string; children: React.ReactNode }) {
  const tab = (key: string) => (key === active ? styles.navActive : styles.navLink);
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href={`${base}/home`} className={styles.brand} aria-label="Overview">
          <SynclinaMark size={26} />
        </Link>
        <nav className={styles.nav} aria-label="Admin">
          <Link href={`${base}/home`} className={tab("home")}>
            Overview
          </Link>
          {ADMIN_APPS.map((a) => (
            <Link key={a.slug} href={`${base}/apps/${a.slug}`} className={tab(a.slug)}>
              {a.title}
            </Link>
          ))}
          <Link href={`${base}/activity`} className={tab("activity")}>
            Activity
          </Link>
        </nav>
        <SignOutButton base={base} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export function LoadProblem() {
  return <p className={styles.problem}>This couldn&apos;t load. Refresh the page in a moment. If it keeps happening, check the Firebase key in Vercel.</p>;
}
