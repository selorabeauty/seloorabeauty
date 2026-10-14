import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const rawSlug = params?.slug ? String(params.slug).trim().toLowerCase() : '';
  const searchParams = request.nextUrl.searchParams;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';

  // Compute public site URL safely behind reverse proxy / Cloudflare
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  let cleanHost = 'seloorabeauty.shop';
  if (
    forwardedHost &&
    !forwardedHost.includes('0.0.0.0') &&
    !forwardedHost.includes('127.0.0.1') &&
    !forwardedHost.includes('localhost')
  ) {
    cleanHost = forwardedHost.split(',')[0].trim();
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      cleanHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).host;
    } catch {}
  }
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const siteUrl = `${proto}://${cleanHost}`;

  let destination = '/ar';

  if (rawSlug) {
    try {
      const res = await fetch(`${apiUrl}/api/links/public/${encodeURIComponent(rawSlug)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.destination && typeof data.destination === 'string') {
          const candidate = data.destination.trim();
          // Loop prevention: avoid redirecting to the same /ads/[slug]
          if (!candidate.toLowerCase().includes(`/ads/${rawSlug}`)) {
            destination = candidate;
          }
        }
      }
    } catch (err) {
      console.error(`[ads-redirect] Error resolving slug '${rawSlug}':`, err);
    }
  }

  // Resolve target URL (supports both relative paths like "/ar" or "/lp" and absolute URLs)
  let targetUrl: URL;
  try {
    if (destination.startsWith('http://') || destination.startsWith('https://')) {
      targetUrl = new URL(destination);
    } else {
      // Relative path: resolve against site base URL
      const cleanPath = destination.startsWith('/') ? destination : `/${destination}`;
      targetUrl = new URL(cleanPath, siteUrl);
    }
  } catch {
    targetUrl = new URL('/ar', siteUrl);
  }

  // Merge and preserve all incoming ad tracking parameters (utm_*, ttclid, ScCid, etc.)
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  // 307 Temporary Redirect preserves HTTP method and avoids stale permanent browser caching
  return NextResponse.redirect(targetUrl.toString(), 307);
}
