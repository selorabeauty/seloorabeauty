'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, Truck, RotateCcw, Loader2, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS, getSetProducts, itemImages } from '@/lib/products';
import { validateKSAPhone, generateOrderId, formatPrice, cn } from '@/lib/utils';
import { captureClickIds, getClickIds, trackInitiateCheckout, trackPurchase } from '@/lib/pixels';
import { track } from '@/lib/track';

const CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الخبر', 'الطائف', 'تبوك', 'أبها', 'نجران', 'حائل', 'القصيم', 'الجوف', 'مدينة أخرى'];

const PAYMENT_METHODS = [
  { id: 'cod', label: 'الدفع عند الاستلام', sub: 'ادفعي للمندوب عند وصول طلبكِ', Icon: Banknote },
  { id: 'tabby_tamara', label: 'قسّطي مع Tabby أو Tamara', sub: 'بدون فوائد — قسمي المبلغ على ٤ دفعات', Icon: CreditCard },
  { id: 'apple_pay_mada', label: 'Apple Pay / مدى', sub: 'ادفعي فوراً وبأمان عبر بطاقتكِ', Icon: Smartphone },
] as const;

type PaymentMethod = typeof PAYMENT_METHODS[number]['id'];

// Only ever suggest an upgrade to a bigger *real* bundle — never a made-up product
const UPSELL_UPGRADE: Record<string, string> = {
  'set-serum-only': 'set-complete',
  'set-cream-only': 'set-complete',
  'set-complete': 'set-double',
};

export default function CheckoutPopup() {
  const router = useRouter();
  const { items, isCheckoutOpen, closeCheckout, subtotal, clearCart, setMainSet } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; city?: string; address?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isCheckoutOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCheckoutOpen]);

  const fallbackSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;
  const cartItems = items.length > 0
    ? items
    : [{ id: fallbackSet.id, name: fallbackSet.label, price: fallbackSet.totalPrice, originalPrice: fallbackSet.originalTotal, quantity: 1, imageBg: 'from-bark-800 to-bark-900', includes: ['سيروم علاج تشققات الجسم', 'كريم علاج تشققات الجسم'], sku: fallbackSet.sku }];
  const total = items.length > 0 ? subtotal() : fallbackSet.totalPrice;

  const upsellSetId = UPSELL_UPGRADE[cartItems[0]?.id];
  const upsellSet = upsellSetId ? SET_OPTIONS.find((s) => s.id === upsellSetId) : undefined;

  const handleUpgrade = () => {
    if (!upsellSet) return;
    const includedProducts = getSetProducts(upsellSet);
    setMainSet({
      id: upsellSet.id,
      name: upsellSet.label,
      price: upsellSet.totalPrice,
      originalPrice: upsellSet.originalTotal,
      imageBg: 'from-bark-800 to-bark-900',
      includes: includedProducts.length > 1 ? includedProducts.map((p) => p.name) : undefined,
      sku: upsellSet.sku,
    });
  };

  useEffect(() => {
    captureClickIds();
  }, []);

  useEffect(() => {
    if (isCheckoutOpen) {
      trackInitiateCheckout(total);   // fires pixel + CAPI mirror with shared event_id
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const e: { name?: string; phone?: string; city?: string; address?: string } = {};
    if (!name.trim()) e.name = 'الاسم مطلوب';
    if (!validateKSAPhone(phone)) e.phone = 'رقم الجوال غير صحيح — يجب أن يبدأ بـ 0 ويكون 10 أرقام';
    if (!city) e.city = 'المدينة مطلوبة';
    if (!address.trim()) e.address = 'العنوان التفصيلي مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const orderId = generateOrderId();
    const eventId = crypto.randomUUID();   // shared browser+CAPI dedup id
    const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

    const orderData = {
      name:            name.trim(),
      phone:           phone.trim(),
      city,
      district:        district.trim(),
      address:         address.trim(),
      payment_method:  paymentMethod,
      quantity:        totalQty,
      total,
      items:           cartItems.map((i) => ({ sku: i.sku ?? i.id, name: i.name, quantity: i.quantity, price: i.price })),
      page_url:        typeof window !== 'undefined' ? window.location.href : undefined,
      event_id:        eventId,
      ...getClickIds(),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);
      const result = await response.json();
      const serverOrderId = result.order_id || orderId;

      // Purchase pixels fire ONLY on confirmed success — browser + CAPI share eventId for dedup
      trackPurchase(total, serverOrderId, eventId);
      track.purchase(serverOrderId);
      clearCart();
      closeCheckout();
      router.push(`/ar/order/success?id=${serverOrderId}&name=${encodeURIComponent(name)}&total=${total}`);
    } catch (err) {
      console.error("❌ Order failed:", err);
      setSubmitting(false);
      setErrors({ name: 'تعذر إرسال الطلب — تأكدي من الاتصال وحاولي مرة أخرى' });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 backdrop-blur-sm"
        style={{ background: 'rgba(26,15,8,0.65)' }}
        onClick={closeCheckout}
        aria-hidden
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[95vh] overflow-y-auto"
          style={{ background: '#FDFAF6', boxShadow: '0 8px 48px rgba(26,15,8,0.22)' }}
        >
          {/* Header */}
          <div
            className="sticky top-0 px-6 py-4 flex items-center justify-between z-10 border-b"
            style={{ background: '#FDFAF6', borderColor: '#EFE4D4' }}
          >
            <div>
              <h2 className="font-bold text-xl" style={{ color: '#1A0F08' }}>أكملي طلبكِ</h2>
              <p className="text-sm" style={{ color: '#8C7B6E' }}>بيانات التوصيل — الدفع عند الاستلام</p>
            </div>
            <button
              onClick={closeCheckout}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#F8F2EA' }}
            >
              <X size={18} style={{ color: '#3D2B1F' }} />
            </button>
          </div>

          <div className="px-6 py-5">

            {/* Upgrade banner — only ever a real bundle from SET_OPTIONS */}
            {upsellSet && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="w-full rounded-2xl p-4 mb-4 border-2 text-start transition-all"
                style={{ background: '#FFF8E8', borderColor: '#C4943E' }}
              >
                <div className="flex items-center gap-3">
                  <img src={upsellSet.image} alt={upsellSet.label} className="w-12 h-12 rounded-xl object-cover border" style={{ borderColor: '#D6C6B4' }} decoding="async" />
                  <div className="flex-1">
                    <div className="font-black text-sm" style={{ color: '#8A611E' }}>
                      رقّي طلبك إلى {upsellSet.label}
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#2D6B41' }}>
                      {upsellSet.savingsLabel} · فقط {upsellSet.totalPrice} ر.س
                      <span className="line-through mr-1 font-normal" style={{ color: '#B0998A' }}>{upsellSet.originalTotal} ر.س</span>
                    </div>
                  </div>
                  <div className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ background: '#C4943E', color: '#fff' }}>
                    رقّي ←
                  </div>
                </div>
              </button>
            )}

            {/* Order summary */}
            <div className="rounded-2xl p-4 mb-5 border" style={{ background: '#F8F2EA', borderColor: '#EFE4D4' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#1A0F08' }}>ملخص الطلب</h3>
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ border: '1px solid #EFE4D4' }}
                  >
                    {itemImages(item).map((src) => (
                      <img key={src} src={src} alt={item.name} className={src.includes('stretch-') ? 'h-full object-contain' : 'w-full h-full object-cover'} decoding="async" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm line-clamp-1" style={{ color: '#1A0F08' }}>{item.name}</div>
                    {'includes' in item && item.includes && item.includes.length > 0 ? (
                      <div className="text-xs" style={{ color: '#8C7B6E' }}>{item.includes.join(' + ')}</div>
                    ) : (
                      <div className="text-xs" style={{ color: '#8C7B6E' }}>الكمية: {item.quantity}</div>
                    )}
                  </div>
                  <div className="font-bold text-sm" style={{ color: '#1A0F08' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t" style={{ borderColor: '#EFE4D4' }}>
                <div className="flex justify-between font-bold text-base" style={{ color: '#1A0F08' }}>
                  <span>الإجمالي</span>
                  <span style={{ color: '#C4943E' }}>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
                  الاسم الكامل <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                  placeholder="مثال: سارة الأحمد"
                  className={cn('input', errors.name && 'input-error')}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
                  رقم الجوال <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className={cn('input text-start', errors.phone && 'input-error')}
                />
                <p className="text-xs mt-1" style={{ color: '#8C7B6E' }}>
                  مثال: 0501234567 — رقم سعودي مكوّن من ١٠ أرقام يبدأ بـ 0
                </p>
                {errors.phone && <p className="text-xs mt-0.5" style={{ color: '#C0392B' }}>{errors.phone}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
                  المدينة <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: undefined })); }}
                  className={cn('input', errors.city && 'input-error')}
                >
                  <option value="">-- اختاري مدينتك --</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.city}</p>}
              </div>

              {/* District (optional) */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
                  الحي <span className="text-xs font-normal" style={{ color: '#8C7B6E' }}>(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: حي النزهة"
                  className="input"
                />
              </div>

              {/* Detailed address */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A0F08' }}>
                  العنوان التفصيلي <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                  placeholder="اسم الشارع، رقم المبنى، أقرب معلم"
                  className={cn('input', errors.address && 'input-error')}
                />
                {errors.address && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.address}</p>}
              </div>

              {/* Payment method */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                style={{ background: '#EAF5EE', borderColor: '#A8D8B8' }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: '#2D6B41' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: '#2D6B41' }} />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#1A4A2A' }}>الدفع عند الاستلام</div>
                  <div className="text-xs" style={{ color: '#2D6B41' }}>ادفعي للمندوب عند وصول طلبكِ</div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full text-lg py-5 mt-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-cta-pulse"
              >
                {submitting
                  ? <><Loader2 size={18} className="animate-spin" /> جاري إرسال الطلب...</>
                  : 'تأكيدي طلبي الآن'}
              </button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-5 text-xs pb-2" style={{ color: '#8C7B6E' }}>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} style={{ color: '#2D6B41' }} /> آمن ١٠٠٪
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={12} style={{ color: '#C4943E' }} /> شحن سريع
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={12} style={{ color: '#C4943E' }} /> ضمان ٣٠ يوم
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
