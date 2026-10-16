import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const rawSlug = params?.slug ? String(params.slug).trim().toLowerCase() : '';
  const searchParams = request.nextUrl.searchParams;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';

  // Base production site URL
  let siteUrl = 'https://seloorabeauty.shop';

  // Allow host override only if it's a real valid domain (never 0.0.0.0 or localhost)
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (
    forwardedHost &&
    !forwardedHost.includes('0.0.0.0') &&
    !forwardedHost.includes('127.0.0.1') &&
    !forwardedHost.includes('localhost') &&
    forwardedHost.includes('.')
  ) {
    const cleanHost = forwardedHost.split(',')[0].trim().replace(/:80$|:443$/, '');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    siteUrl = `${proto}://${cleanHost}`;
  }

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

  // Absolutely guarantee that 0.0.0.0 never appears in the redirect location
  const finalLocation = targetUrl.toString().replace(/^https?:\/\/0\.0\.0\.0(:\d+)?/i, 'https://seloorabeauty.shop');

  // 307 Temporary Redirect preserves HTTP method and avoids stale permanent browser caching
  return NextResponse.redirect(finalLocation, 307);
}
