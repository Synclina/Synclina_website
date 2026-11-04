import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DRIVSYNC_DOCS } from "../../documents";
import styles from "../../Legal.module.css";

type Params = { params: Promise<{ doc: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => DRIVSYNC_DOCS.map((d) => ({ doc: d.slug }));

const find = (slug: string) => DRIVSYNC_DOCS.find((d) => d.slug === slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = find((await params).doc);
  if (!doc) return {};
  return { title: doc.title, description: doc.text, alternates: { canonical: `/legal/drivsync/${doc.slug}` } };
}

export default async function LegalDocumentPage({ params }: Params) {
  const doc = find((await params).doc);
  if (!doc) notFound();
  // Our own text, read at build time. The app's test keeps it the same as the app's copy.
  const html = await readFile(path.join(process.cwd(), "src/content/legal/drivsync", `${doc.slug}.html`), "utf8");

  return (
    <section className={`container ${styles.page}`}>
      <Link href="/products/drivsync" className={styles.app}>
        DrivSync
      </Link>
      <nav className={styles.tabs} aria-label="DrivSync documents">
        {DRIVSYNC_DOCS.map((d) => (
          <Link key={d.slug} href={`/legal/drivsync/${d.slug}`} className={d.slug === doc.slug ? styles.tabActive : styles.tab} aria-current={d.slug === doc.slug ? "page" : undefined}>
            {d.label}
          </Link>
        ))}
      </nav>
      <article className={styles.doc} dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
