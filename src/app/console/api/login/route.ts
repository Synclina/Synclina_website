import { handleSignIn } from "@/lib/admin/login";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = handleSignIn;
