'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore, VAT_RATE, COD_FEE } from '@/store/cartStore';
import { PRODUCTS } from '@/lib/products';
const PRODUCT = PRODUCTS[0];
import { validateKSAPhone, generateOrderId, formatPrice } from '@/lib/utils';
import { ShieldCheck, Truck, Star } from 'lucide-react';

interface FormData {
  name: string; phone: string; city: string; address: string; district: string;
}
interface Errors { name?: string; phone?: string; city?: string; address?: string; }

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal, clearCart, addItem } = useCartStore();

  // If cart is empty, add default product
  const cartItems = items.length > 0 ? items : [{ ...PRODUCT, quantity: 1 }];
  const firstItem = cartItems[0];
  const isBundle  = !!firstItem?.bundlePrice;
  const sub       = isBundle ? (firstItem.bundlePrice as number) : (items.length > 0 ? subtotal() : PRODUCT.price);
  const total     = sub; // all-in price — no VAT, no COD fee

  const [form, setForm] = useState<FormData>({ name: '', phone: '', city: '', address: '', district: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const cities: string[] = t.raw('cities') as string[];

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = t('validation.name_required');
    if (!validateKSAPhone(form.phone)) e.phone = t('validation.phone_invalid');
    if (!form.city) e.city = t('validation.city_required');
    if (!form.address.trim()) e.address = t('validation.address_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate order submission
    await new Promise((r) => setTimeout(r, 1200));
    const orderId = generateOrderId();
    clearCart();
    router.push(`/${locale}/order/success?id=${orderId}`);
  };

  const Field = ({
    label, name, type = 'text', placeholder, required = true,
  }: {
    label: string; name: keyof FormData; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-charcoal-900 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => { setForm((f) => ({ ...f, [name]: e.target.value })); setErrors((er) => ({ ...er, [name]: undefined })); }}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-base bg-white transition-colors outline-none focus:ring-2 focus:ring-gold-400/40 ${errors[name as keyof Errors] ? 'border-red-400' : 'border-cream-200 focus:border-gold-400'}`}
      />
      {errors[name as keyof Errors] && (
        <p className="text-red-500 text-xs mt-1">{errors[name as keyof Errors]}</p>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-50 pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-charcoal-900">{t('heading')}</h1>
            <p className="text-charcoal-800/60 mt-2">{t('subheading')}</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* Form */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Field label={t('name')} name="name" placeholder={locale === 'ar' ? 'مثال: سارة الأحمد' : 'e.g. Sarah Al-Ahmad'} />
                <Field label={t('phone')} name="phone" type="tel" placeholder={t('phone_placeholder')} />

                {/* City select */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-900 mb-1.5">
                    {t('city')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value })); setErrors((er) => ({ ...er, city: undefined })); }}
                    className={`w-full px-4 py-3 rounded-xl border text-base bg-white transition-colors outline-none focus:ring-2 focus:ring-gold-400/40 ${errors.city ? 'border-red-400' : 'border-cream-200 focus:border-gold-400'}`}
                  >
                    <option value="">{locale === 'ar' ? '-- اختاري مدينتك --' : '-- Select your city --'}</option>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <Field label={t('district')} name="district" placeholder={locale === 'ar' ? 'مثال: حي النزهة' : 'e.g. Al Nuzha District'} required={false} />
                <Field label={t('address')} name="address" placeholder={t('address_placeholder')} />

                {/* Payment method */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-900 mb-1.5">{t('payment_method')}</label>
                  <div className="flex items-center gap-3 bg-sage-100 border border-sage-200 rounded-xl px-4 py-3">
                    <div className="w-4 h-4 rounded-full border-2 border-sage-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-sage-600" />
                    </div>
                    <span className="font-semibold text-sage-800">{t('cod')}</span>
                    <span className="text-xs text-sage-600 ms-auto">
                      {locale === 'ar' ? 'ادفعي للمندوب' : 'Pay the courier'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full text-xl py-5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed animate-cta-pulse"
                >
                  {submitting ? t('submitting') : t('submit')}
                </button>

                {/* Micro-trust */}
                <div className="flex items-center justify-center gap-6 text-xs text-charcoal-800/40 pt-1">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} /> {locale === 'ar' ? 'آمن 100%' : '100% Secure'}</span>
                  <span className="flex items-center gap-1"><Truck size={12} /> {locale === 'ar' ? 'شحن سريع' : 'Fast Shipping'}</span>
                  <span className="flex items-center gap-1"><Star size={12} /> {locale === 'ar' ? 'ضمان 30 يوم' : '30-Day Guarantee'}</span>
                </div>
              </form>
            </div>

            {/* Order summary */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6">
                <h3 className="font-bold text-charcoal-900 mb-5">
                  {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </h3>

                {/* Items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b border-cream-100">
                    <div className="w-14 h-14 bg-gradient-to-b from-sage-800 to-charcoal-900 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <span className="text-cream-50 text-[8px] font-bold text-center leading-tight">SELORA<br/>SERUM</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-charcoal-900">{item.name}</div>
                      <div className="text-xs text-charcoal-800/50">30 ml · {locale === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}</div>
                    </div>
                    <div className="font-bold text-charcoal-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between" style={{ color: '#2D6B41' }}>
                    <span className="font-medium">✅ شامل الضريبة والشحن</span>
                    <span className="font-bold">{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-cream-200" style={{ color: '#1A0F08' }}>
                    <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span style={{ color: '#C4943E' }}>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust cards */}
              {[
                { icon: '🚚', text: locale === 'ar' ? 'شحن سريع 1-3 أيام' : 'Fast 1-3 day shipping' },
                { icon: '🔄', text: locale === 'ar' ? 'ضمان استرداد 30 يوم' : '30-day return guarantee' },
                { icon: '💬', text: locale === 'ar' ? 'دعم على واتساب 24/7' : 'WhatsApp support 24/7' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-2xl border border-cream-200 px-4 py-3 text-sm font-medium text-charcoal-800">
                  <span className="text-xl">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
