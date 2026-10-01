/**
 * Selora Beauty — internal analytics tracking
 * Sends events to /api/track (KSA + VPN filtering happens server-side)
 */

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('slr_sid');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('slr_sid', sid);
  }
  return sid;
}

async function send(event: string, extra: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  try {
    await fetch(`${API}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        event,
        page_url: window.location.href,
        referrer: document.referrer,
        ...extra,
      }),
      keepalive: true,
    });
  } catch {
    // silent — never break the user experience
  }
}

export const track = {
  pageview:       () => send('pageview'),
  addToCart:      () => send('add_to_cart'),
  checkoutStart:  () => send('checkout_start'),
  purchase:       (orderId: string) => send('purchase', { order_id: orderId }),
};
