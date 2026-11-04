"use client";

import { useState, type FormEvent } from "react";
import SynclinaMark from "@/components/brand/SynclinaMark";
import styles from "./Console.module.css";

export default function SignInForm({ base }: { base: string }) {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      if (res.ok) {
        window.location.assign(`${base}/home`);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "That didn't work. Try again.");
      setCode("");
    } catch {
      setError("No connection. Try again.");
    }
    setBusy(false);
  };

  return (
    <main className={styles.signInPage}>
      <form className={styles.signIn} onSubmit={submit}>
        <SynclinaMark size={36} />
        <h1>Sign in</h1>
        <label>
          Password
          <input type="password" autoComplete="current-password" autoFocus required maxLength={200} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Authenticator code
          <input type="text" autoComplete="one-time-code" required maxLength={20} spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} />
          <small>Lost your phone? Enter a recovery code instead.</small>
        </label>
        {error && (
          <p className={styles.problem} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
