"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./Footer.module.css";

const TAPS = 7;
const WITHIN_MS = 4000;

/** The footer's copyright line. */
export default function Copyright() {
  const taps = useRef<number[]>([]);
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");

  const tapped = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < WITHIN_MS), now];
    if (taps.current.length >= TAPS) {
      taps.current = [];
      setOpen(true);
    }
  };

  const close = () => {
    setOpen(false);
    setWord("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const typed = word;
    close();
    try {
      const res = await fetch("/api/door", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: typed }),
      });
      const { to } = (await res.json()) as { to?: string };
      if (to) window.location.assign(to);
    } catch {
      // Nothing to show.
    }
  };

  return (
    <>
      <span className={styles.copyright} onClick={tapped}>
        © {new Date().getFullYear()} Synclina. All rights reserved.
      </span>
      {open && (
        <div className={styles.doorBackdrop} onClick={close}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()}>
            <input
              className={styles.doorInput}
              type="password"
              aria-label="Input"
              autoFocus
              autoComplete="off"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && close()}
            />
          </form>
        </div>
      )}
    </>
  );
}
