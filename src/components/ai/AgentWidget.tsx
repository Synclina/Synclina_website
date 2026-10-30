"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUp, Sparkles, X, RotateCcw } from "lucide-react";
import SynclinaMark from "@/components/brand/SynclinaMark";
import AgentMessages from "./AgentMessages";
import { OPEN_AGENT_EVENT } from "@/lib/agent";
import { onIntroDone } from "@/lib/scroll";
import type { ChatMessage } from "@/lib/ai";
import styles from "./AgentWidget.module.css";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hey there 👋 I'm **Synclina AI**.\n\nAsk me about what we are building, our services, or how we could automate something for you.",
};
const SUGGESTIONS = ["What are you building?", "Can you automate my work?", "Who founded Synclina?"];

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return;
    setInput("");
    const history = [...messagesRef.current.filter((m) => m !== WELCOME), { role: "user" as const, content }];
    setMessages([...messagesRef.current, { role: "user", content }, { role: "assistant", content: "" }]);
    setStreaming(true);

    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    const append = (chunk: string) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + chunk };
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        append(dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") append("Sorry — I couldn't reach the server. Please try again in a moment.");
    } finally {
      setStreaming(false);
    }
  }, []);

  // Open requests from anywhere on the site
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (q) setTimeout(() => send(q), 350);
    };
    window.addEventListener(OPEN_AGENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_AGENT_EVENT, onOpen);
  }, [send]);

  useEffect(() => {
    if (!fab.current) return;
    gsap.set(fab.current, { scale: 0, opacity: 0 });
    return onIntroDone(() => gsap.to(fab.current, { scale: 1, opacity: 1, duration: 0.8, delay: 1, ease: "back.out(2)" }));
  }, []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30, scale: 0.92, transformOrigin: "100% 100%" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out" },
      );
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      gsap.to(el, { autoAlpha: 0, y: 20, scale: 0.95, duration: 0.3, ease: "power2.in" });
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const reset = () => {
    abort.current?.abort();
    setMessages([WELCOME]);
    setStreaming(false);
  };

  return (
    <>
      <div ref={panel} className={styles.panel} role="dialog" aria-label="Synclina AI chat" aria-hidden={!open}>
        <header className={styles.header}>
          <div className={styles.avatar}>
            <SynclinaMark size={24} />
          </div>
          <div className={styles.headText}>
            <strong>Synclina AI</strong>
            <span>
              <i className={styles.online} /> Online · usually instant
            </span>
          </div>
          <button className={styles.iconBtn} onClick={reset} aria-label="New conversation" title="New conversation">
            <RotateCcw size={16} />
          </button>
          <button className={styles.iconBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <X size={18} />
          </button>
        </header>

        <div ref={list} className={styles.messages}>
          <AgentMessages messages={messages} streaming={streaming} />
          {messages.length === 1 && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((q) => (
                <button key={q} onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (!streaming) send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Synclina…"
            maxLength={2000}
            aria-label="Message"
          />
          <button type="submit" disabled={!input.trim() || streaming} aria-label="Send">
            <ArrowUp size={18} />
          </button>
        </form>
      </div>

      <button
        ref={fab}
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Synclina AI" : "Open Synclina AI"}
      >
        <span className={styles.fabRing} />
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </>
  );
}
