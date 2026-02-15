const DEFAULT_SITE_URL = "https://yusaozdemir.de";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  process.env.SITE_URL?.replace(/\/$/, "") ??
  DEFAULT_SITE_URL;

