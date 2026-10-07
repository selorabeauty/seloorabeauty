// ── Ad-platform pixel helpers ──
// Every funnel event fires TWICE with the same event_id:
//   1. Browser pixel (ttq / snaptr)        → instant, rich context
//   2. POST /api/track → server-side CAPI  → survives ad blockers
// TikTok dedupes on event_id, Snap on client_dedup_id, so a visible
// browser + server pair counts once; a blocked browser still counts once.

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: Record<string, unknown>, opts?: Record<string, unknown>) => void;
      page?: () => void;
    };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

/** Persist ad click IDs from the landing URL so they survive navigation. */
export function captureClickIds() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ttclid = params.get('ttclid');
  const scCid = params.get('ScCid') || params.get('sc_cid');
  if (ttclid) localStorage.setItem('slr_ttclid', ttclid);
  if (scCid) localStorage.setItem('slr_sccid', scCid);
}

/**
 * Click IDs + first-party pixel cookies sent with orders/events for CAPI:
 * - ttclid / ScCid  → ad click attribution
 * - _ttp cookie     → TikTok pixel's tracker cookie (big match-quality boost)
 * - _scid cookie    → Snap pixel's tracker cookie (sc_cookie1)
 */
export function getClickIds(): { ttclid?: string; sc_cid?: string; ttp?: string; sc_cookie1?: string } {
  if (typeof window === 'undefined') return {};
  const out: { ttclid?: string; sc_cid?: string; ttp?: string; sc_cookie1?: string } = {};
  const ttclid = localStorage.getItem('slr_ttclid');
  const scCid = localStorage.getItem('slr_sccid');
  const ttp = getCookie('_ttp');
  const scCookie = getCookie('_scid');
  if (ttclid) out.ttclid = ttclid;
  if (scCid) out.sc_cid = scCid;
  if (ttp) out.ttp = ttp;
  if (scCookie) out.sc_cookie1 = scCookie;
  return out;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('slr_sid');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('slr_sid', sid);
  }
  return sid;
}

/** Server mirror — backend forwards to CAPI with the same event_id. */
function mirrorToBackend(event: string, eventId: string, extra: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  fetch(`${API}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: getSessionId(),
      event,
      event_id: eventId,
      page_url: window.location.href,
      referrer: document.referrer,
      ...getClickIds(),
      ...extra,
    }),
    keepalive: true,
  }).catch(() => {});
}

type FunnelEvent = 'view_content' | 'add_to_cart' | 'checkout_start' | 'purchase';

/** Dual-fire one funnel event: browser pixel + server CAPI, same event_id. */
function fireFunnel(
  event: FunnelEvent,
  ttEvent: string | null,
  snapEvent: string | null,
  ttData: Record<string, unknown> = {},
  snapData: Record<string, unknown> = {},
  extra: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return;
  const eventId = crypto.randomUUID();
  if (ttEvent) window.ttq?.track(ttEvent, ttData, { event_id: eventId });
  if (snapEvent) window.snaptr?.('track', snapEvent, { ...snapData, client_dedup_id: eventId });
  mirrorToBackend(event, eventId, extra);
}

/** Fires on SPA route changes (the <head> snippet fires the initial one). */
export function trackPixelPageView() {
  if (typeof window === 'undefined') return;
  window.ttq?.page?.();
  window.snaptr?.('track', 'PAGE_VIEW');
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  fireFunnel(
    'view_content',
    'ViewContent',
    'VIEW_CONTENT',
    {
      contents: [{ content_id: product.id, content_name: product.name, quantity: 1, price: product.price }],
      content_type: 'product',
      value: product.price,
      currency: 'SAR',
    },
    { item_ids: [product.id], price: product.price, currency: 'SAR' },
    { value: product.price, product_id: product.id },
  );
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number }) {
  const qty = item.quantity ?? 1;
  fireFunnel(
    'add_to_cart',
    'AddToCart',
    'ADD_CART',
    {
      contents: [{ content_id: item.id, content_name: item.name, quantity: qty, price: item.price }],
      content_type: 'product',
      value: item.price * qty,
      currency: 'SAR',
    },
    { item_ids: [item.id], price: item.price * qty, currency: 'SAR', number_items: qty },
    { value: item.price * qty, product_id: item.id },
  );
}

export function trackInitiateCheckout(value: number) {
  fireFunnel(
    'checkout_start',
    'InitiateCheckout',
    'START_CHECKOUT',
    { value, currency: 'SAR' },
    { price: value, currency: 'SAR' },
    { value },
  );
}

/**
 * Browser-side purchase — call ONLY after the order API confirms.
 * The backend also fires CAPI purchase from the order itself (richer: has
 * phone hash). `eventId` must equal the event_id sent in the order payload.
 */
export function trackPurchase(value: number, orderId: string, eventId?: string) {
  if (typeof window === 'undefined') return;
  window.ttq?.track(
    'CompletePayment',
    { value, currency: 'SAR', content_id: orderId },
    eventId ? { event_id: eventId } : undefined,
  );
  window.snaptr?.('track', 'PURCHASE', {
    price: value,
    currency: 'SAR',
    transaction_id: orderId,
    ...(eventId ? { client_dedup_id: eventId } : {}),
  });
}
