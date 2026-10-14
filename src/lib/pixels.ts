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
      page?: (opts?: Record<string, unknown>) => void;
      identify?: (props: Record<string, string>) => void;
    };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
    __snapPixelId?: string;
    __ttPvId?: string;
  }
}

/** SHA-256 hex digest — required for pixel advanced-matching fields. */
async function sha256Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface UserIdentity {
  phone?: string;
  name?: string;
  email?: string;
}

export interface ItemData {
  id?: string;
  sku?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

/**
 * Advanced Matching — pass customer identity signals as early as possible.
 * Feeds both TikTok Pixel (ttq.identify) and Snap Pixel SDK (snaptr('init', ...)).
 *
 * Parameters passed to Snapchat:
 * - user_phone_number: normalized E.164 digits without + (9665XXXXXXXX)
 * - user_hashed_phone_number: SHA256 of +9665XXXXXXXX
 * - user_hashed_first_name: SHA256 of first name
 * - user_hashed_last_name: SHA256 of last name (if provided)
 * - user_email / user_hashed_email: (if provided)
 */
export async function identifyUser(
  identityOrPhone: string | UserIdentity,
  maybeName?: string,
  maybeEmail?: string,
) {
  if (typeof window === 'undefined' || !identityOrPhone) return;

  let phone = '';
  let name = '';
  let email = '';

  if (typeof identityOrPhone === 'string') {
    phone = identityOrPhone;
    name = maybeName || '';
    email = maybeEmail || '';
  } else {
    phone = identityOrPhone.phone || '';
    name = identityOrPhone.name || '';
    email = identityOrPhone.email || '';
  }

  const snapParams: Record<string, unknown> = {};
  const ttqParams: Record<string, string> = {};

  if (phone) {
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length >= 7) {
      const e164Digits = rawDigits.startsWith('966') ? rawDigits : `966${rawDigits.replace(/^0+/, '')}`;
      const e164Plus = `+${e164Digits}`;

      try {
        const hashedE164 = await sha256Hex(e164Plus.toLowerCase().trim());
        ttqParams.phone_number = hashedE164;
        snapParams.user_hashed_phone_number = hashedE164;
        snapParams.user_phone_number = e164Digits;
        localStorage.setItem('slr_user_phone', e164Digits);
      } catch {
        snapParams.user_phone_number = e164Digits;
      }
    }
  }

  if (name && name.trim()) {
    const cleanName = name.trim();
    const parts = cleanName.split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    try {
      const hashedFn = await sha256Hex(firstName.toLowerCase().trim());
      snapParams.user_hashed_first_name = hashedFn;
      if (lastName) {
        snapParams.user_hashed_last_name = await sha256Hex(lastName.toLowerCase().trim());
      }
      localStorage.setItem('slr_user_name', cleanName);
    } catch {
      // ignore
    }
  }

  if (email && email.trim() && email.includes('@')) {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const hashedEm = await sha256Hex(cleanEmail);
      ttqParams.email = hashedEm;
      snapParams.user_hashed_email = hashedEm;
      snapParams.user_email = cleanEmail;
      localStorage.setItem('slr_user_email', cleanEmail);
    } catch {
      snapParams.user_email = cleanEmail;
    }
  }

  if (Object.keys(ttqParams).length > 0) {
    window.ttq?.identify?.(ttqParams);
  }

  if (Object.keys(snapParams).length > 0 && window.snaptr && window.__snapPixelId) {
    window.snaptr('init', window.__snapPixelId, snapParams);
  }
}

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

/** Persist the FIRST landing URL with parameters so it survives SPA navigation. */
export function captureLandingUrl() {
  if (typeof window === 'undefined') return;
  const currentUrl = window.location.href;
  const existingLanding = localStorage.getItem('slr_landing_url');

  if (!existingLanding) {
    localStorage.setItem('slr_landing_url', currentUrl);
  } else if (window.location.search) {
    // If user arrives with new campaign/tracking parameters, refresh the landing URL
    const hasParams = /[\?&](utm_|ttclid|sccid|sc_cid|fbclid|gclid)/i.test(window.location.search);
    if (hasParams) {
      localStorage.setItem('slr_landing_url', currentUrl);
    }
  }
}

export function getLandingUrl(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('slr_landing_url') || window.location.href;
}

/** Persist ad click IDs & landing URL from the landing URL so they survive navigation. */
export function captureClickIds() {
  if (typeof window === 'undefined') return;
  captureLandingUrl();
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
 * - landing_url     → the original entry page with UTM/ad parameters
 */
export function getClickIds(): {
  ttclid?: string;
  sc_cid?: string;
  ttp?: string;
  sc_cookie1?: string;
  landing_url?: string;
  user_phone?: string;
  user_name?: string;
  user_email?: string;
} {
  if (typeof window === 'undefined') return {};
  const out: {
    ttclid?: string;
    sc_cid?: string;
    ttp?: string;
    sc_cookie1?: string;
    landing_url?: string;
    user_phone?: string;
    user_name?: string;
    user_email?: string;
  } = {};
  const ttclid = localStorage.getItem('slr_ttclid');
  const scCid = localStorage.getItem('slr_sccid');
  const ttp = getCookie('_ttp');
  const scCookie = getCookie('_scid');
  const landingUrl = getLandingUrl();
  const phone = localStorage.getItem('slr_user_phone');
  const name = localStorage.getItem('slr_user_name');
  const email = localStorage.getItem('slr_user_email');

  if (ttclid) out.ttclid = ttclid;
  if (scCid) out.sc_cid = scCid;
  if (ttp) out.ttp = ttp;
  if (scCookie) out.sc_cookie1 = scCookie;
  if (landingUrl) out.landing_url = landingUrl;
  if (phone) out.user_phone = phone;
  if (name) out.user_name = name;
  if (email) out.user_email = email;
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

type FunnelEvent = 'view_content' | 'add_to_cart' | 'checkout_start' | 'add_payment_info' | 'purchase';

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
  const eventId = crypto.randomUUID();
  window.ttq?.page?.({ event_id: eventId });
  window.snaptr?.('track', 'PAGE_VIEW', { client_dedup_id: eventId });
  mirrorToBackend('pageview', eventId);
}

/**
 * Mirrors the INITIAL pageview to CAPI using the same event_id the <head>
 * snippet gave ttq.page()/snaptr — deduped browser+server PageView.
 */
export function mirrorInitialPageView() {
  if (typeof window === 'undefined') return;
  if (window.__ttPvId) mirrorToBackend('pageview', window.__ttPvId);
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
    {
      item_ids: [product.id],
      item_category: 'skincare',
      description: product.name,
      price: product.price,
      currency: 'SAR',
      number_items: 1,
    },
    { value: product.price, product_id: product.id },
  );
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number; sku?: string }) {
  const qty = item.quantity ?? 1;
  const itemId = item.sku || item.id;
  const totalPrice = item.price * qty;
  fireFunnel(
    'add_to_cart',
    'AddToCart',
    'ADD_CART',
    {
      contents: [{ content_id: itemId, content_name: item.name, quantity: qty, price: item.price }],
      content_type: 'product',
      value: totalPrice,
      currency: 'SAR',
    },
    {
      item_ids: [itemId],
      item_category: 'skincare',
      description: item.name,
      price: totalPrice,
      currency: 'SAR',
      number_items: qty,
    },
    { value: totalPrice, product_id: itemId },
  );
}

export function trackInitiateCheckout(value: number, items?: ItemData[]) {
  const itemIds = (items && items.length > 0) ? items.map((i) => i.sku || i.id || 'set-complete') : ['set-complete'];
  const numberItems = (items && items.length > 0) ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 1;
  const contents = (items && items.length > 0)
    ? items.map((i) => ({
        content_id: i.sku || i.id || 'set-complete',
        content_name: i.name || 'سيلورا بيوتي',
        quantity: i.quantity || 1,
        price: i.price || value,
      }))
    : [{ content_id: 'set-complete', content_name: 'طقم سيلورا بيوتي', quantity: 1, price: value }];

  fireFunnel(
    'checkout_start',
    'InitiateCheckout',
    'START_CHECKOUT',
    { value, currency: 'SAR', contents },
    {
      price: value,
      currency: 'SAR',
      item_ids: itemIds,
      number_items: numberItems,
      item_category: 'skincare',
    },
    { value, product_id: itemIds[0] },
  );
}

/** Payment info provided — fires when the checkout form is submitted. */
export function trackAddPaymentInfo(value: number, items?: ItemData[]) {
  const itemIds = (items && items.length > 0) ? items.map((i) => i.sku || i.id || 'set-complete') : ['set-complete'];
  const numberItems = (items && items.length > 0) ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 1;

  fireFunnel(
    'add_payment_info',
    'AddPaymentInfo',
    'ADD_BILLING',
    { value, currency: 'SAR' },
    {
      price: value,
      currency: 'SAR',
      item_ids: itemIds,
      number_items: numberItems,
      item_category: 'skincare',
    },
    { value },
  );
}

/**
 * Browser-side purchase — call ONLY after the order API confirms.
 * The backend also fires CAPI purchase from the order itself (richer: has
 * phone hash). `eventId` must equal the event_id sent in the order payload.
 * Both CompletePayment + PlaceAnOrder are sent — COD orders are "placed",
 * not paid online, and TikTok's ecommerce diagnostics expect PlaceAnOrder.
 *
 * For Snapchat: includes price, currency, transaction_id, item_ids, number_items,
 * item_category, and client_dedup_id to ensure maximum Event Quality Score (EQS).
 */
export function trackPurchase(
  value: number,
  orderId: string,
  eventId?: string,
  items?: ItemData[],
) {
  if (typeof window === 'undefined') return;
  const opts = eventId ? { event_id: eventId } : undefined;
  const itemIds = (items && items.length > 0) ? items.map((i) => i.sku || i.id || 'set-complete') : ['set-complete'];
  const numberItems = (items && items.length > 0) ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 1;

  const data = {
    value,
    currency: 'SAR',
    content_id: orderId,
    content_type: 'product',
    contents: (items || []).map((i) => ({
      content_id: i.sku || i.id || 'set-complete',
      content_name: i.name || 'سيلورا بيوتي',
      quantity: i.quantity || 1,
      price: i.price || value,
    })),
  };

  window.ttq?.track('CompletePayment', data, opts);
  window.ttq?.track('PlaceAnOrder', data, opts);

  window.snaptr?.('track', 'PURCHASE', {
    price: value,
    currency: 'SAR',
    transaction_id: orderId,
    item_ids: itemIds,
    number_items: numberItems,
    item_category: 'skincare',
    description: (items || []).map((i) => i.name).join(' + ') || 'طقم سيلورا بيوتي',
    ...(eventId ? { client_dedup_id: eventId } : {}),
  });
}
