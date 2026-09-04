# 07 — Pixels & Tracking Specification

## Architecture: Browser Pixel + Server CAPI (Dual-Fire with Dedup)

```
User Action           Browser Pixel             Server CAPI
─────────────────────────────────────────────────────────────
Page View       →  ttq.track('ViewContent')  ← NOT server-fired
Add to Cart     →  ttq.track('AddToCart')    ← NOT server-fired  
Open Checkout   →  ttq.track('InitiateCheckout') ← NOT server-fired
Submit Order    →  ttq.track('CompletePayment', {event_id})
                                        +
                                        POST /api/orders
                                        → backend fires CAPI with same event_id

DEDUPLICATION: TikTok & Snap match on event_id → count once only
```

---

## TikTok Pixel Setup

### Browser Pixel (deferred — fires after LCP)

```typescript
// src/lib/pixels.ts

declare global {
  interface Window { ttq: any; }
}

let pixelLoaded = false;

export function loadTikTokPixel(pixelId: string) {
  if (pixelLoaded || typeof window === 'undefined') return;
  pixelLoaded = true;

  // Inject base pixel code
  (function(w: any, d, t) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
    ttq.setAndDefer = function(obj: any, method: string) { obj[method] = function() { obj.push([method].concat(Array.prototype.slice.call(arguments, 0))); }; };
    ttq.methods.forEach((method: string) => ttq.setAndDefer(ttq, method));
    ttq.instance = function(t: string) {
      const i = ttq._i[t] || [];
      ttq.methods.forEach((method: string) => ttq.setAndDefer(i, method));
      return i;
    };
    ttq.load = function(e: string, o: any) {
      const n = '//analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = n;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = o || {};
      const s = d.createElement('script') as HTMLScriptElement;
      s.type = 'text/javascript';
      s.async = true;
      s.src = n + '?sdkid=' + e + '&lib=' + t;
      const f = d.getElementsByTagName('script')[0];
      f.parentNode?.insertBefore(s, f);
    };
    ttq.load(pixelId);
    ttq.page();
  })(window, document, 'ttq');
}

export function ttqTrack(event: string, params?: object) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params);
  }
}
```

### usePixel Hook

```typescript
// src/hooks/usePixel.ts
'use client';
import { useEffect } from 'react';
import { loadTikTokPixel, loadSnapchatPixel } from '@/lib/pixels';

export function usePixels() {
  useEffect(() => {
    // Defer until after LCP — use requestIdleCallback or setTimeout
    const load = () => {
      const tikTokId  = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
      const snapId    = process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID;
      if (tikTokId)  loadTikTokPixel(tikTokId);
      if (snapId)    loadSnapchatPixel(snapId);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(load, { timeout: 3000 });
    } else {
      setTimeout(load, 1500);
    }
  }, []);
}
```

### Event Tracking Calls

```typescript
// src/lib/pixels.ts — event helpers

export function trackViewContent(productId: string, price: number) {
  ttqTrack('ViewContent', {
    content_id:   productId,
    content_type: 'product',
    currency:     'SAR',
    value:        price,
  });
  snapTrack('VIEW_CONTENT', {
    item_ids:  productId,
    price:     price.toString(),
    currency:  'SAR',
  });
}

export function trackAddToCart(productId: string, price: number) {
  ttqTrack('AddToCart', {
    content_id:   productId,
    content_type: 'product',
    currency:     'SAR',
    value:        price,
  });
  snapTrack('ADD_CART', {
    item_ids: productId,
    price:    price.toString(),
    currency: 'SAR',
  });
}

export function trackInitiateCheckout(price: number) {
  ttqTrack('InitiateCheckout', {
    currency: 'SAR',
    value:    price,
  });
  snapTrack('START_CHECKOUT', {
    price:    price.toString(),
    currency: 'SAR',
  });
}

// Called on form submit — BEFORE sending to backend
export function trackPurchaseBrowser(eventId: string, total: number, productId: string, qty: number) {
  ttqTrack('CompletePayment', {
    event_id:     eventId,   // MUST match backend CAPI event_id
    currency:     'SAR',
    value:        total,
    content_type: 'product',
    contents: [{ content_id: productId, quantity: qty, price: total / qty }],
  });
  snapTrack('PURCHASE', {
    client_dedup_id: eventId,  // MUST match backend CAPI event_id
    transaction_id:  eventId,
    price:           total.toString(),
    currency:        'SAR',
    item_ids:        productId,
    number_items:    qty.toString(),
  });
}
```

---

## Snapchat Pixel Setup

```typescript
// src/lib/pixels.ts

let snapLoaded = false;

export function loadSnapchatPixel(pixelId: string) {
  if (snapLoaded || typeof window === 'undefined') return;
  snapLoaded = true;

  (function(e: any, t: any, n: any) {
    if (e.snaptr) return;
    const a: any = e.snaptr = function() {
      a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
    };
    a.queue = [];
    const s = 'script';
    const r = t.createElement(s) as HTMLScriptElement;
    r.async = true;
    r.src = n;
    const u = t.getElementsByTagName(s)[0];
    u.parentNode?.insertBefore(r, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');

  (window as any).snaptr('init', pixelId, { user_email: '' });
  (window as any).snaptr('track', 'PAGE_VIEW');
}

export function snapTrack(event: string, params?: object) {
  if (typeof window !== 'undefined' && (window as any).snaptr) {
    (window as any).snaptr('track', event, params);
  }
}
```

---

## Click ID Capture (ttclid & ScCid)

```typescript
// src/lib/clickIds.ts
// Called on page load — reads URL params and saves to sessionStorage

export function captureClickIds() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);

  const ttclid = params.get('ttclid');
  const scCid  = params.get('ScCid');

  if (ttclid) sessionStorage.setItem('ttclid', ttclid);
  if (scCid)  sessionStorage.setItem('sc_cid', scCid);
}

export function getClickIds() {
  return {
    ttclid: sessionStorage.getItem('ttclid') || '',
    sc_cid: sessionStorage.getItem('sc_cid') || '',
  };
}
```

---

## Event ID Generation (Deduplication)

```typescript
// src/lib/utils.ts

export function generateEventId(): string {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `EVT-${ts}-${rnd}`;
}
```

**Rule:** Generate `eventId` ONCE per checkout submit. Pass to:
1. `trackPurchaseBrowser(eventId, ...)` — browser pixel
2. `POST /api/orders` body as `event_id` → backend fires CAPI with same ID

TikTok and Snapchat both deduplicate on this ID within 48 hours.

---

## Checkout Submit Flow (Frontend)

```typescript
// In CheckoutPopup.tsx handleSubmit:

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setSubmitting(true);

  const eventId = generateEventId();
  const { ttclid, sc_cid } = getClickIds();

  // 1. Fire browser pixels FIRST (before API call)
  trackInitiateCheckout(total);
  trackPurchaseBrowser(eventId, total, 'retinal-serum-150ml', qty);

  // 2. Send to backend (which fires CAPI)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, phone, quantity: qty,
      ttclid, sc_cid, event_id: eventId,
      ip: '',              // backend reads from request headers
      user_agent: navigator.userAgent,
      page_url:   window.location.href,
    }),
  });

  const order = await res.json();
  clearCart();
  closeCheckout();
  router.push(`/ar/order/success?id=${order.order_id}&total=${order.total}`);
};
```

---

## TikTok CAPI Events Map

| User Action | Browser Pixel Event | CAPI Event | Fires From |
|---|---|---|---|
| Page load | `ViewContent` | — | Browser only |
| Add to cart | `AddToCart` | — | Browser only |
| Open checkout | `InitiateCheckout` | — | Browser only |
| Submit order | `CompletePayment` | `CompletePayment` | Both (dedup by event_id) |

---

## Snapchat CAPI Events Map

| User Action | Browser Pixel Event | CAPI Event | Fires From |
|---|---|---|---|
| Page load | `PAGE_VIEW` | — | Browser only |
| View product | `VIEW_CONTENT` | — | Browser only |
| Add to cart | `ADD_CART` | — | Browser only |
| Open checkout | `START_CHECKOUT` | — | Browser only |
| Submit order | `PURCHASE` | `PURCHASE` | Both (dedup by event_id / transaction_id) |

---

## Speed & Performance Rules

1. **Pixels load AFTER LCP** — use `requestIdleCallback` with 3s timeout fallback
2. **No pixel scripts in `<head>`** — inject dynamically via `useEffect`
3. **No blocking resources** — pixel scripts are `async`
4. **Minimize pixel payload** — only send what's needed per event
5. **event_id always present** — prevents double-counting, required for CAPI match quality
6. **Phone hashing** — SHA256 of normalized E.164 format (+9665XXXXXXXX)

---

## TikTok Ads Manager Setup Checklist

- [ ] Create TikTok Ads account for KSA
- [ ] Create Pixel in Events Manager → copy Pixel ID → add to `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- [ ] Generate Events API Access Token → add to backend `TIKTOK_ACCESS_TOKEN`
- [ ] Enable "Deduplication" in Events Manager
- [ ] Verify events firing in Events Manager Test Events tab
- [ ] Create custom conversions: CompletePayment = Purchase goal

## Snapchat Ads Manager Setup Checklist

- [ ] Create Snapchat Business account
- [ ] Create Pixel → copy Pixel ID → add to `NEXT_PUBLIC_SNAPCHAT_PIXEL_ID`
- [ ] Generate CAPI token → add to backend `SNAPCHAT_ACCESS_TOKEN`
- [ ] Verify events in Snap Ads Manager → Events Manager
- [ ] Set PURCHASE as primary optimization event
