'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { BUNDLES } from '@/lib/products';
import { validateKSAPhone, generateOrderId, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { PRODUCTS } from '@/lib/products';

export default function CheckoutPopup() {
  const router = useRouter();
  const { items, isCheckoutOpen, closeCheckout, subtotal, clearCart, setBundle } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isCheckoutOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const cartItems = items.length > 0 ? items : [{ ...PRODUCTS[0], quantity: 1 }];
  const firstItem = cartItems[0];
  const currentBundleQty = firstItem?.bundleQty ?? 1;
  const total = firstItem?.bundlePrice ?? (items.length > 0 ? subtotal() : PRODUCTS[0].price);

  // Upsell: suggest next bundle up
  const currentBundleIdx = BUNDLES.findIndex((b) => b.qty === currentBundleQty);
  const upsellBundle = currentBundleIdx < BUNDLES.length - 1 ? BUNDLES[currentBundleIdx + 1] : null;

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = 'الاسم مطلوب';
    if (!validateKSAPhone(phone)) e.phone = 'رقم الجوال غير صحيح — يجب أن يبدأ بـ 0 ويكون 10 أرقام';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const orderId = generateOrderId();
    const orderData = {
      orderId, name: name.trim(), phone: phone.trim(),
      items: cartItems.map((i) => ({ name: i.name, quantity: i.bundleQty ?? i.quantity, price: i.bundlePrice ?? i.price })),
      subtotal: sub, total,
      createdAt: new Date().toISOString(),
    };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_ORDER_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
          mode: 'no-cors',
        });
      }
    } catch { /* fail silently */ }

    clearCart();
    closeCheckout();
    router.push(`/ar/order/success?id=${orderId}&name=${encodeURIComponent(name)}&total=${total}`);
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
              <p className="text-sm" style={{ color: '#8C7B6E' }}>خطوتان فقط — الدفع عند الاستلام</p>
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

            {/* Upsell Banner */}
            {upsellBundle && (
              <div
                className="rounded-2xl p-4 mb-4 cursor-pointer border-2 transition-all"
                style={{ background: '#FFF8E8', borderColor: '#C4943E' }}
                onClick={() => {
                  setBundle({
                    id: PRODUCTS[0].id + '-' + upsellBundle.id,
                    slug: PRODUCTS[0].slug,
                    name: PRODUCTS[0].name + ` ×${upsellBundle.qty}`,
                    price: PRODUCTS[0].price,
                    originalPrice: PRODUCTS[0].originalPrice,
                    imageBg: PRODUCTS[0].imageBg,
                    bundlePrice: upsellBundle.totalPrice,
                    bundleQty: upsellBundle.qty,
                  });
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⬆️</span>
                  <div className="flex-1">
                    <div className="font-black text-sm" style={{ color: '#8A611E' }}>
                      رقّي طلبك — {upsellBundle.label}
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#2D6B41' }}>
                      {upsellBundle.savingsLabel} · فقط {upsellBundle.totalPrice} ر.س
                      <span className="line-through mr-1 font-normal" style={{ color: '#B0998A' }}>{upsellBundle.originalTotal} ر.س</span>
                    </div>
                  </div>
                  <div className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ background: '#C4943E', color: '#fff' }}>
                    أضيفي ←
                  </div>
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-2xl p-4 mb-5 border" style={{ background: '#F8F2EA', borderColor: '#EFE4D4' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#1A0F08' }}>ملخص الطلب</h3>
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-b ${item.imageBg} rounded-xl flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-[7px] font-bold text-center leading-tight" style={{ color: '#D4A96A' }}>SLR</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm line-clamp-1" style={{ color: '#1A0F08' }}>{item.name}</div>
                    <div className="text-xs" style={{ color: '#8C7B6E' }}>الكمية: {item.quantity}</div>
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
