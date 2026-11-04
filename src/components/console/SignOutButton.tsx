"use client";

import styles from "./Console.module.css";

export default function SignOutButton({ base }: { base: string }) {
  const signOut = async () => {
    try {
      await fetch(`${base}/api/logout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    } finally {
      window.location.assign(base);
    }
  };
  return (
    <button type="button" className={styles.signOut} onClick={signOut}>
      Sign out
    </button>
  );
}
