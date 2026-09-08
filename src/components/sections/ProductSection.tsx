'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { ShieldCheck, Truck, Star, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS, BUNDLES } from '@/lib/products';
const PRODUCT = PRODUCTS[0];

export default function ProductSection() {
  const t = useTranslations('product');
  const locale = useLocale();
  const { setBundle, openCheckout } = useCartStore();
  const [selectedBundle, setSelectedBundle] = useState(0); // default: حبة واحدة
  const [added, setAdded] = useState(false);

  const bundle = BUNDLES[selectedBundle];

  const handleBuyNow = () => {
    setBundle({
      id: PRODUCT.id + '-' + bundle.id,
      slug: PRODUCT.slug,
      name: PRODUCT.name + (bundle.qty > 1 ? ` ×${bundle.qty}` : ''),
      price: PRODUCT.price,
      originalPrice: PRODUCT.originalPrice,
      imageBg: PRODUCT.imageBg,
      bundlePrice: bundle.totalPrice,
      bundleQty: bundle.qty,
    });
    openCheckout();
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const steps: string[] = t.raw('how_to_use.steps') as string[];

  return (
    <section id="product" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Image column */}
          <div className="sticky top-20">
            <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden aspect-square flex items-center justify-center border border-cream-200">
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="w-36 h-52 bg-gradient-to-b from-sage-800 to-charcoal-900 rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center px-3">
                    <div className="text-cream-50 text-sm font-bold tracking-widest mb-1">SELORA</div>
                    <div className="text-gold-300 text-[10px] font-semibold leading-relaxed tracking-wider">
                      RETINAL<br/>BOOSTER<br/>SERUM
                    </div>
                    <div className="text-cream-50/30 text-[9px] mt-3">30 ml · Encapsulated</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="star-filled fill-gold-400" />)}
                  </div>
                  <span className="text-sm text-charcoal-800/60">4.9 · 2,431 {locale === 'ar' ? 'تقييم' : 'reviews'}</span>
                </div>
              </div>

              {/* Badges on image */}
              <div className="absolute top-4 start-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl">
                {locale === 'ar' ? '-29%' : '-29%'}
              </div>
              <div className="absolute top-4 end-4 bg-sage-100 text-sage-800 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-sage-200">
                {locale === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {['تقنية التغليف', 'مكونات فعّالة', 'نتائج مثبتة', 'آمن للبشرة'].map((label, i) => (
                <div key={i} className="bg-white rounded-xl border border-cream-200 aspect-square flex items-center justify-center p-2 cursor-pointer hover:border-gold-400 transition-colors">
                  <span className="text-[9px] text-center text-charcoal-800/60 font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="badge mb-3">{t('badge_clinical')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 leading-tight">
                {t('name')}
              </h2>
              <p className="text-sage-600 font-medium mt-1">{t('tagline')}</p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="star-filled fill-gold-400" />)}
              </div>
              <span className="text-sm font-bold text-charcoal-900">4.9</span>
              <a href="#reviews" className="text-sm text-sage-600 hover:text-gold-400 underline">
                (2,431 {locale === 'ar' ? 'تقييم' : 'reviews'})
              </a>
            </div>

            {/* Description */}
            <p className="text-base text-charcoal-800/70 leading-relaxed">
              {t('description_short')}
            </p>

            {/* Bundle selector */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-sm" style={{ color: '#1A0F08' }}>اختاري العرض الأنسب:</span>
              {BUNDLES.map((b, i) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBundle(i)}
                  className="rounded-2xl cursor-pointer transition-all overflow-hidden"
                  style={{
                    border: `2px solid ${selectedBundle === i ? '#C4943E' : b.highlight ? '#C4943E' : '#EFE4D4'}`,
                    background: selectedBundle === i ? '#FBF3E3' : '#fff',
                    boxShadow: b.highlight ? '0 4px 16px rgba(196,148,62,0.15)' : 'none',
                  }}
                >
                  {/* Most Popular ribbon for bundle-3 */}
                  {b.highlight && (
                    <div className="w-full text-center py-1.5 text-xs font-black tracking-wide" style={{ background: '#C4943E', color: '#fff' }}>
                      ⭐ الأكثر مبيعاً — الأفضل قيمة
                    </div>
                  )}

                  <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Radio */}
                      <div
                        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: selectedBundle === i ? '#C4943E' : '#C9AF97',
                          background: selectedBundle === i ? '#C4943E' : 'transparent',
                        }}
                      >
                        {selectedBundle === i && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>

                      {/* Label + savings */}
                      <div className="flex-1">
                        <div className="font-bold text-sm" style={{ color: '#1A0F08' }}>{b.label}</div>
                        {b.savingsLabel && (
                          <div className="text-xs font-bold" style={{ color: '#2D6B41' }}>{b.savingsLabel}</div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-end">
                        <div className="font-black text-xl" style={{ color: '#1A0F08' }}>{b.totalPrice} <span className="text-base font-bold">ر.س</span></div>
                        <div className="text-[10px]" style={{ color: '#8C7B6E' }}>{b.perUnitLabel}</div>
                      </div>

                      {/* Badge for bundle-2 */}
                      {b.badge && !b.highlight && (
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                          style={{ background: '#F8F2EA', color: '#8A611E', border: '1px solid #E8C98A' }}
                        >
                          {b.badge}
                        </span>
                      )}
                    </div>
                    {b.freeShipping && (
                      <div className="flex items-center gap-1 mt-2 text-xs font-bold" style={{ color: '#2D6B41' }}>
                        <Truck size={12} /> شامل الضريبة والشحن
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="btn-gold w-full text-xl py-5 animate-cta-pulse"
              >
                {added ? '✓ تمت الإضافة — إكملي طلبكِ' : 'اطلبي الآن — الدفع عند الاستلام'}
              </button>
            </div>

            {/* Trust micro-copy */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <ShieldCheck size={15} />, text: locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery' },
                { icon: <Truck size={15} />, text: locale === 'ar' ? 'شحن 1-3 أيام' : '1-3 Day Shipping' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-sage-600 font-medium">
                  <span className="text-gold-400">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* How to use */}
            <div className="border-t border-cream-200 pt-6">
              <h3 className="font-bold text-lg text-charcoal-900 mb-4">
                {t('how_to_use.heading')}
              </h3>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-charcoal-900 text-cream-50 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-charcoal-800/70 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
