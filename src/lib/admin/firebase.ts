import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { initializeFirestore, type Firestore } from "firebase-admin/firestore";

let firestore: Firestore | null = null;

function app(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  // Local emulators need no key.
  if (process.env.FIRESTORE_EMULATOR_HOST) return initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "demo-synclina" });
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!encoded) throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not set");
  return initializeApp({ credential: cert(JSON.parse(Buffer.from(encoded, "base64").toString("utf8"))) });
}

export function db(): Firestore {
  // preferRest: much faster to start on a serverless function than the default connection.
  // The local emulator only speaks the default one.
  firestore ??= initializeFirestore(app(), process.env.FIRESTORE_EMULATOR_HOST ? {} : { preferRest: true });
  return firestore;
}

/** Loaded only when needed, so signing in and saving a ticket start faster. */
export async function auth() {
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(app());
}
