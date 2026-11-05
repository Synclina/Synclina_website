import ConsoleShell from "@/components/console/ConsoleShell";
import { adminBase, requireSession } from "@/lib/admin/session";

/** Stays in place between pages, so only the content changes. */
export default async function SignedInLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return <ConsoleShell base={adminBase()}>{children}</ConsoleShell>;
}
