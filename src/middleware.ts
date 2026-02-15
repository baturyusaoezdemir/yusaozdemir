import { NextRequest, NextResponse } from "next/server";

const DEFAULT_CANONICAL_HOST = "yusaozdemir.de";
const canonicalHost = (process.env.CANONICAL_HOST ?? DEFAULT_CANONICAL_HOST)
  .trim()
  .toLowerCase();

const aliasHosts = (process.env.DOMAIN_ALIASES ?? "yusaoezdemir.de")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

function normalizeHost(value: string): string {
  return value.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

export function middleware(request: NextRequest) {
  const rawHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!rawHost) {
    return NextResponse.next();
  }

  const host = normalizeHost(rawHost);
  if (host === canonicalHost || !aliasHosts.includes(host)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = "https";
  redirectUrl.host = canonicalHost;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

