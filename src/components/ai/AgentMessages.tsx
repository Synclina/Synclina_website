import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import type { ChatMessage } from "@/lib/ai";
import styles from "./AgentWidget.module.css";

/** Inline markdown: **bold**, *italic*, [text](url). Rendered as React nodes — no raw HTML. */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      if (href.startsWith("/")) return <Link key={i} href={href}>{link[1]}</Link>;
      if (/^https?:\/\//.test(href)) return <a key={i} href={href} target="_blank" rel="noreferrer">{link[1]}</a>;
      return link[1];
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ""))}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Product cards for any product the assistant talks about. */
function ProductCards({ text }: { text: string }) {
  const mentioned = PRODUCTS.filter((p) => text.includes(`/products/${p.slug}`));
  if (!mentioned.length) return null;
  return (
    <div className={styles.cards}>
      {mentioned.map((p) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className={styles.productCard}
          style={{ "--accent": p.accent, "--accent-rgb": p.accentRgb } as React.CSSProperties}
        >
          <span className={styles.pcDot} />
          <span>
            <strong>{p.title}</strong>
            <small>{p.code} · {p.status}</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>
      ))}
    </div>
  );
}

export default function AgentMessages({ messages, streaming }: { messages: ChatMessage[]; streaming: boolean }) {
  return (
    <>
      {messages.map((m, i) => {
        const last = i === messages.length - 1;
        return (
          <div key={i} className={`${styles.msg} ${m.role === "user" ? styles.user : styles.bot}`}>
            {m.role === "assistant" && !m.content && streaming && last ? (
              <span className={styles.typing}>
                <i />
                <i />
                <i />
              </span>
            ) : (
              <div className={styles.bubble}>
                {m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
              </div>
            )}
            {m.role === "assistant" && !(streaming && last) && <ProductCards text={m.content} />}
          </div>
        );
      })}
    </>
  );
}
