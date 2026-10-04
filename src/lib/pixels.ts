// ── Ad-platform pixel helpers ──
// Safe no-ops when the relevant pixel script is not loaded, so events
// silently skip if the pixel IDs are not configured.

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: Record<string, unknown>, opts?: Record<string, unknown>) => void;
      page?: () => void;
    };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

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
 * Click IDs + first-party pixel cookies sent with the order for CAPI:
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

/** Fires on every route change (pixel snippet fires the initial one itself). */
export function trackPixelPageView() {
  if (typeof window === 'undefined') return;
  window.ttq?.page?.();
  window.snaptr?.('track', 'PAGE_VIEW');
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  if (typeof window === 'undefined') return;
  window.ttq?.track('ViewContent', {
    contents: [{ content_id: product.id, content_name: product.name, quantity: 1, price: product.price }],
    content_type: 'product',
    value: product.price,
    currency: 'SAR',
  });
  window.snaptr?.('track', 'VIEW_CONTENT', {
    item_ids: [product.id],
    price: product.price,
    currency: 'SAR',
  });
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number }) {
  if (typeof window === 'undefined') return;
  const qty = item.quantity ?? 1;
  window.ttq?.track('AddToCart', {
    contents: [{ content_id: item.id, content_name: item.name, quantity: qty, price: item.price }],
    content_type: 'product',
    value: item.price * qty,
    currency: 'SAR',
  });
  window.snaptr?.('track', 'ADD_CART', {
    item_ids: [item.id],
    price: item.price * qty,
    currency: 'SAR',
    number_items: qty,
  });
}

export function trackInitiateCheckout(value: number) {
  if (typeof window === 'undefined') return;
  window.ttq?.track('InitiateCheckout', { value, currency: 'SAR' });
  window.snaptr?.('track', 'START_CHECKOUT', { price: value, currency: 'SAR' });
}

/**
 * Browser-side purchase event — call ONLY after the order API confirms.
 * `eventId` MUST match the ID sent to the backend — TikTok dedupes on
 * event_id, Snap on client_dedup_id — so browser + CAPI merge into ONE
 * conversion instead of double-counting.
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
