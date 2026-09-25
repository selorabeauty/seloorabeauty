'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Star, ArrowDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS, SET_OPTIONS } from '@/lib/products';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;
const singleSet = SET_OPTIONS.find((s) => s.id === 'set-serum-only')!;

// ── EMOTIONAL + RATIONAL bullets — stretch marks pain points ──
const PAIN_BULLETS = [
  {
    emoji: '🤰',
    bold: 'تشققات الحمل والولادة تسرق ثقتكِ:',
    rest: 'كل مرة تنظرين للمرآة تتمنين لو اختفت — روتين سيلورا يُرمم النسيج العميق ويُعيد المرونة التي افتقدتِها.',
  },
  {
    emoji: '⚖️',
    bold: 'تقلبات الوزن ليست عائقاً بعد اليوم:',
    rest: 'سواء بسبب حمية أو بناء عضلي، ثلاثية الشيا والأرجان واللوز تمنح جلدكِ القدرة على التمدد دون تمزق.',
  },
  {
    emoji: '🛡️',
    bold: 'ثقة ومصداقية طبية:',
    rest: 'معتمد من هيئة الغذاء والدواء (SFDA) ومطابق لمعايير ISO — نتائج سريرية موثقة (87% تحسن، 94% مرونة).',
  },
];

export default function Hero() {
  const { setMainSet, openCheckout } = useCartStore();
  const [ordersToday, setOrdersToday] = useState(63);
  // Which purchase option is picked in the side-by-side selector below — bundle wins by default.
  const [selectedSetId, setSelectedSetId] = useState<'set-serum-only' | 'set-complete'>('set-complete');

  useEffect(() => {
    const t = setInterval(() => setOrdersToday((n) => n + 1), 11000);
    return () => clearInterval(t);
  }, []);

  const selectedSet = selectedSetId === 'set-complete' ? completeSet : singleSet;

  const handleBuyNow = () => {
    setMainSet({
      id: selectedSet.id,
      name: selectedSet.label,
      price: selectedSet.totalPrice,
      originalPrice: selectedSet.originalTotal,
      imageBg: 'from-bark-800 to-bark-900',
      includes: selectedSetId === 'set-complete'
        ? ['سيروم علاج تشققات الجسم', 'كريم علاج تشققات الجسم']
        : ['سيروم علاج تشققات الجسم'],
      sku: selectedSet.sku,
    });
    openCheckout();
  };

  const discount = Math.round((1 - completeSet.totalPrice / completeSet.originalTotal) * 100);

  return (
    <section className="relative min-h-screen flex items-center bg-hero pt-20 pb-16 md:pb-0 overflow-hidden">

      {/* Soft decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -end-40 w-[580px] h-[580px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,148,62,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -start-24 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(61,43,31,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-2 gap-14 items-center">

        {/* ── RIGHT-reading content (text) ── */}
        <div className="flex flex-col gap-6 order-2 md:order-1 pb-8 md:pb-0">

          {/* Social proof pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border shadow-sm"
              style={{ background: '#fff', borderColor: '#EFE4D4' }}
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-current" style={{ color: '#C4943E' }} />
              ))}
              <span className="text-xs font-bold mr-1" style={{ color: '#1A0F08' }}>4.9</span>
              <span className="text-xs" style={{ color: '#8C7B6E' }}>(٣٤١٨ تقييم)</span>
            </div>
            <span className="badge-gold">🔴 {ordersToday} طلب اليوم</span>
          </div>

          {/* ── HEADLINE ── */}
          <h1
            className="text-[2.3rem] md:text-[2.9rem] lg:text-[3.25rem] leading-[1.18] tracking-tight"
            style={{
              fontWeight: 800,
              color: '#1A0F08',
              fontFamily: 'var(--font-tajawal), Tajawal, Cairo, Arial, sans-serif',
            }}
          >
            {/* Line 1 — emotional hook */}
            <span style={{ color: '#1A0F08' }}>استعيدي ثقتكِ بكل مرآة..</span>
            <br />
            {/* Line 2 — rational promise */}
            <span style={{ color: '#3D2B1F' }}>
              ثلاثية الشيا والأرجان واللوز لعلاج تشققات الجسم.
            </span>
          </h1>

          {/* ── SUB-HEADLINE — emotional + rational ── */}
          <p
            className="text-lg pb-2"
            style={{
              color: '#333333',
              fontWeight: 500,
              lineHeight: '2.05',
              letterSpacing: '0.01em',
              fontFamily: 'var(--font-tajawal), Tajawal, Cairo, Arial, sans-serif',
            }}
          >
            هل تعبتِ من إخفاء تشققات البطن والأرداف والصدر؟ سيلورا يقدم لكِ الروتين الطبي المتكامل بزبدة الشيا والزيوت المغربية — يتغلغل بعمق لترميم الأنسجة ومنع العلامات المستقبلية.
          </p>

          {/* ── PAIN-POINT BULLETS ── */}
          <ul className="flex flex-col gap-3">
            {PAIN_BULLETS.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed"
                style={{ background: '#F8F2EA', border: '1px solid #EFE4D4' }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{b.emoji}</span>
                <span style={{ color: '#3D2B1F' }}>
                  <strong style={{ color: '#1A0F08', fontWeight: 700 }}>{b.bold}</strong>{' '}
                  {b.rest}
                </span>
              </li>
            ))}
          </ul>

          {/* ── Buy options — single piece vs. complete bundle, side by side ── */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Single piece — 199 SAR */}
            <button
              type="button"
              onClick={() => setSelectedSetId('set-serum-only')}
              className="text-start rounded-2xl border-2 px-4 py-3.5 transition-all"
              style={{
                borderColor: selectedSetId === 'set-serum-only' ? '#C4943E' : '#EFE4D4',
                background: selectedSetId === 'set-serum-only' ? '#FBF3E4' : '#fff',
              }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: '#6E5C50' }}>قطعة واحدة</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: '#1A0F08' }}>{singleSet.totalPrice}</span>
                <span className="text-xs font-bold" style={{ color: '#1A0F08' }}>ر.س</span>
                <span className="text-xs line-through" style={{ color: '#C9AF97' }}>{singleSet.originalTotal}</span>
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: '#8C7B6E' }}>سيروم أو كريم فقط</div>
            </button>

            {/* Complete bundle — 279 SAR, best value */}
            <button
              type="button"
              onClick={() => setSelectedSetId('set-complete')}
              className="relative text-start rounded-2xl border-2 px-4 py-3.5 transition-all"
              style={{
                borderColor: selectedSetId === 'set-complete' ? '#C4943E' : '#EFE4D4',
                background: selectedSetId === 'set-complete' ? '#FBF3E4' : '#fff',
              }}
            >
              <span
                className="absolute -top-2.5 end-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#1A0F08', color: '#D4A96A' }}
              >
                ⭐ الروتين المتكامل
              </span>
              <div className="text-xs font-bold mb-1" style={{ color: '#6E5C50' }}>علاج طبي منزلي</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: '#1A0F08' }}>{completeSet.totalPrice}</span>
                <span className="text-xs font-bold" style={{ color: '#1A0F08' }}>ر.س</span>
                <span className="text-xs line-through" style={{ color: '#C9AF97' }}>{completeSet.originalTotal}</span>
              </div>
              <div className="text-[11px] mt-0.5 font-semibold" style={{ color: '#2D6B41' }}>سيروم + كريم — وفري ٣٠٪</div>
            </button>
          </div>
          <p className="text-xs -mt-1" style={{ color: '#8C7B6E' }}>💡 الروتين الكامل مصمم ليعمل السيروم على الطبقات العميقة والكريم كحاجز وقاية خارجي</p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleBuyNow} className="btn-gold flex-1 text-base py-4 animate-cta-pulse">
              اطلبي الآن — {selectedSet.totalPrice} ر.س
            </button>
            <Link
              href="/ar/products/stretch-mark-serum"
              className="btn-outline flex-1 text-center py-4"
            >
              اعرفي أكثر
            </Link>
          </div>

          {/* Trust micro-row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { Icon: ShieldCheck, text: 'دفع عند الاستلام' },
              { Icon: RotateCcw,   text: 'ضمان ٣٠ يوم' },
              { Icon: Truck,       text: 'شحن ١‑٣ أيام' },
            ].map(({ Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 border text-xs font-bold shadow-sm"
                style={{ background: '#fff', borderColor: '#EFE4D4', color: '#3D2B1F' }}
              >
                <Icon size={13} style={{ color: '#C4943E', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── LEFT: product visual (image placeholder) ── */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-72 h-72 md:w-[400px] md:h-[400px]">

            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(196,148,62,0.12) 0%, transparent 70%)' }}
            />

            {/* Hero image placeholder — replace with real product photography */}
            <div
              className="absolute inset-6 rounded-full flex items-center justify-center"
              style={{ background: '#fff', boxShadow: '0 8px 48px -6px rgba(58,40,24,0.18)' }}
            >
              <div className="flex gap-3 px-4">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className={`w-24 h-40 rounded-2xl flex flex-col items-center justify-center gap-2 px-2 bg-gradient-to-b ${p.imageBg}`}
                    style={{ boxShadow: '0 8px 32px rgba(26,15,8,0.35)' }}
                  >
                    <span className="text-[10px] font-bold tracking-[0.14em]" style={{ color: '#D4A96A' }}>SELLURA</span>
                    <span className="text-[7px] font-bold tracking-wider text-center leading-relaxed" style={{ color: '#C9AF97' }}>
                      {p.subtitle.toUpperCase()}
                    </span>
                    <span className="text-[7px] mt-1" style={{ color: 'rgba(253,250,246,0.4)' }}>100 ml</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chip: stretch marks */}
            <div
              className="absolute -top-2 -start-4 rounded-2xl px-3.5 py-2.5 border shadow-luxury animate-float"
              style={{ background: '#fff', borderColor: '#EFE4D4' }}
            >
              <div className="text-xl font-bold" style={{ color: '#C4943E' }}>87%</div>
              <div className="text-[10px] font-medium" style={{ color: '#6E5C50' }}>تحسن التشققات</div>
            </div>

            {/* Floating chip: reviews */}
            <div
              className="absolute -bottom-2 -end-2 rounded-2xl px-3.5 py-2.5 border shadow-luxury"
              style={{ background: '#fff', borderColor: '#EFE4D4' }}
            >
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-current" style={{ color: '#C4943E' }} />
                ))}
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#6E5C50' }}>+٣٤٠٠ عميلة</div>
            </div>

            {/* Floating chip: oils */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -end-6 rounded-2xl px-3 py-2 border shadow-luxury text-center"
              style={{ background: '#fff', borderColor: '#EFE4D4' }}
            >
              <div className="text-xl">🌰🌿</div>
              <div className="text-[9px] font-bold leading-tight" style={{ color: '#3D2B1F' }}>لوز<br />وأرجان</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#problem"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-colors"
        style={{ color: '#C9AF97' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#C4943E')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#C9AF97')}
      >
        <span className="text-xs font-medium">اكتشفي</span>
        <ArrowDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
