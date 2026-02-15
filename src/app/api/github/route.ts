import { NextResponse } from 'next/server';

export const revalidate = 300; // ISR/Caching für 5 Min

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const username = searchParams.get('user') || 'baturyusaoezdemir';

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json, application/vnd.github.mercy-preview+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = repo
    ? `https://api.github.com/repos/${repo}`
    : `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

  const res = await fetch(url, { headers, cache: 'no-store' }); // wir setzen HTTP-Cache weiter unten

  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    const msg = remaining === '0' && reset
      ? `GitHub Rate Limit erreicht. Versuche es nach ${new Date(Number(reset) * 1000).toLocaleString('de-DE')} erneut.`
      : `GitHub API Fehler (${res.status})`;
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const data = await res.json();

  const response = NextResponse.json(data, { status: 200 });
  // leichte Browser-/Edge-Cache-Kontrolle
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
  return response;
}
