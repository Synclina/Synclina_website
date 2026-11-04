import { notFound, redirect } from "next/navigation";
import SignInForm from "@/components/console/SignInForm";
import { adminConfig } from "@/lib/admin/config";
import { hasSession } from "@/lib/admin/session";

export default async function ConsoleSignIn() {
  const cfg = adminConfig();
  if (!cfg) notFound();
  const base = `/${cfg.path}`;
  if (await hasSession()) redirect(`${base}/home`);
  return <SignInForm base={base} />;
}
