import { NextResponse, type NextRequest } from "next/server";
import { validAdminPath } from "@/lib/admin/rules";

const INTERNAL = "/console";

/**
 * The admin pages answer only at a private address (ADMIN_PATH). Their real path looks
 * like any other missing page. This only hides them: every page and action also checks
 * the session itself.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === INTERNAL || pathname.startsWith(`${INTERNAL}/`)) {
    return NextResponse.rewrite(new URL("/page-not-found", req.url));
  }

  const secret = process.env.VERCEL_ENV === "preview" ? undefined : process.env.ADMIN_PATH;
  if (!validAdminPath(secret)) return NextResponse.next();
  if (pathname !== `/${secret}` && !pathname.startsWith(`/${secret}/`)) return NextResponse.next();

  const nonce = btoa(crypto.randomUUID());
  const dev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${dev ? " ws:" : ""}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const headers = new Headers(req.headers);
  headers.set("content-security-policy", csp);
  const url = req.nextUrl.clone();
  url.pathname = `${INTERNAL}${pathname.slice(secret.length + 1)}`;

  const res = NextResponse.rewrite(url, { request: { headers } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/((?!_next/|images/|icon\\.svg|favicon|.*\\.(?:png|jpg|jpeg|svg|webp|txt|xml|webmanifest)$).*)"],
};
