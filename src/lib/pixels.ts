// ── Ad-platform pixel helpers ──
// Safe no-ops when the relevant pixel ID env var is not set, so this
// can be merged now and will "just work" the moment IDs are added.

declare global {
  interface Window {
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
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

export function trackPurchase(value: number, orderId: string) {
  if (typeof window === 'undefined') return;
  window.ttq?.track('CompletePayment', { value, currency: 'SAR', content_id: orderId });
  window.snaptr?.('track', 'PURCHASE', { price: value, currency: 'SAR', transaction_id: orderId });
}
