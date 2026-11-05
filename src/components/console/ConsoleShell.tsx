import Link from "next/link";
import SynclinaMark from "@/components/brand/SynclinaMark";
import { ADMIN_APPS } from "@/lib/admin/apps";
import ConsoleNav from "./ConsoleNav";
import SignOutButton from "./SignOutButton";
import styles from "./Console.module.css";

export default function ConsoleShell({ base, children }: { base: string; children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href={`${base}/home`} className={styles.brand} aria-label="Overview">
          <SynclinaMark size={26} />
        </Link>
        <ConsoleNav base={base} apps={ADMIN_APPS.map(({ slug, title }) => ({ slug, title }))} />
        <SignOutButton base={base} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export function LoadProblem() {
  return <p className={styles.problem}>This couldn&apos;t load. Refresh the page in a moment. If it keeps happening, check the Firebase key in Vercel.</p>;
}
