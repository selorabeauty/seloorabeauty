// ── Ad-platform pixel helpers ──
// Safe no-ops when the relevant pixel ID env var is not set, so this
// can be merged now and will "just work" the moment IDs are added.

declare global {
  interface Window {
    ttq?: { track: (event: string, data?: Record<string, unknown>, opts?: Record<string, unknown>) => void };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
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

/** Click IDs captured on landing — sent with the order for server-side CAPI. */
export function getClickIds(): { ttclid?: string; sc_cid?: string } {
  if (typeof window === 'undefined') return {};
  const out: { ttclid?: string; sc_cid?: string } = {};
  const ttclid = localStorage.getItem('slr_ttclid');
  const scCid = localStorage.getItem('slr_sccid');
  if (ttclid) out.ttclid = ttclid;
  if (scCid) out.sc_cid = scCid;
  return out;
}

export function trackPageView() {
  if (typeof window === 'undefined') return;
  window.ttq?.track('ViewContent');
  window.snaptr?.('track', 'PAGE_VIEW');
}

export function trackInitiateCheckout(value: number) {
  if (typeof window === 'undefined') return;
  window.ttq?.track('InitiateCheckout', { value, currency: 'SAR' });
  window.snaptr?.('track', 'START_CHECKOUT', { price: value, currency: 'SAR' });
}

/**
 * Browser-side purchase event. `eventId` MUST be the same ID sent to the
 * backend — TikTok dedupes on event_id, Snap on client_dedup_id — so the
 * browser + server (CAPI) events merge into ONE conversion.
 */
export function trackPurchase(value: number, orderId: string, eventId?: string) {
  if (typeof window === 'undefined') return;
  const payload = { value, currency: 'SAR', content_id: orderId };
  window.ttq?.track('CompletePayment', payload, eventId ? { event_id: eventId } : undefined);
  window.snaptr?.('track', 'PURCHASE', {
    price: value,
    currency: 'SAR',
    transaction_id: orderId,
    ...(eventId ? { client_dedup_id: eventId } : {}),
  });
}
