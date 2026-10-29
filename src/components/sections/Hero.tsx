'use client';
import Photo from '@/components/ui/Photo';
import { IMG } from '@/lib/images';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, ArrowDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS, SET_OPTIONS } from '@/lib/products';
import { trackAddToCart } from '@/lib/pixels';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;
const singleSet = SET_OPTIONS.find((s) => s.id === 'set-serum-only')!;

// ── EMOTIONAL + RATIONAL bullets — stretch marks pain points ──
const PAIN_BULLETS = [
  {
    emoji: '🤍',
    bold: 'أنت لست وحدك في هذا:',
    rest: 'الحمل، النمو السريع، تغيّر الوزن، الرياضة وبناء العضلات. معظمنا يمرّ بها، رجالاً ونساءً، وهي لا تقلل من جمالك ولا من قيمتك.',
  },
  {
    emoji: '🧬',
    bold: 'ببتيدات النحاس GHK-Cu + سيكا:',
    rest: 'مكونات معروفة في أبحاث العناية بالبشرة لدعم مرونة الجلد وتهدئته، في سيروم 30ml خفيف غير لزج.',
  },
  {
    emoji: '🪡',
    bold: 'ديرما رولر 0.5mm مرة أسبوعياً:',
    rest: 'خطوة لطيفة تهيّئ سطح البشرة قبل السيروم. تعقيم قبل وبعد الاستخدام، ولا تُستخدم على جلد متهيج.',
  },
  {
    emoji: '🛡️',
    bold: 'جرّبي بدون خوف:',
    rest: 'الدفع عند الاستلام، وضمان استرجاع ٣٠ يوماً. والنتائج تختلف من بشرة لأخرى، فالتزم ٨-١٢ أسبوعاً.',
  },
];

export default function Hero() {
  const { setMainSet, openCheckout } = useCartStore();
  // Which purchase option is picked in the side-by-side selector below — bundle wins by default.
  const [selectedSetId, setSelectedSetId] = useState<'set-serum-only' | 'set-complete'>('set-complete');

  const selectedSet = selectedSetId === 'set-complete' ? completeSet : singleSet;

  const handleBuyNow = () => {
    trackAddToCart({ id: selectedSet.id, sku: selectedSet.sku, name: selectedSet.label, price: selectedSet.totalPrice });
    setMainSet({
      id: selectedSet.id,
      name: selectedSet.label,
      price: selectedSet.totalPrice,
      originalPrice: selectedSet.originalTotal,
      imageBg: 'from-bark-800 to-bark-900',
      includes: selectedSetId === 'set-complete'
        ? ['سيروم ببتيدات النحاس 30ml', 'ديرما رولر التيتانيوم 0.5mm']
        : ['سيروم ببتيدات النحاس 30ml'],
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
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -start-24 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-2 gap-14 items-center">

        {/* ── RIGHT-reading content (text) ── */}
        <div className="flex flex-col gap-6 order-2 md:order-1 pb-8 md:pb-0">

          {/* Social proof pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="badge-gold">💳 الدفع عند الاستلام</span>
            <span className="badge-clinical">↩️ ضمان استرجاع ٣٠ يوماً</span>
          </div>

          {/* ── HEADLINE ── */}
          <h1
            className="text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.5rem] leading-[1.28] tracking-tight"
            style={{
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-tajawal), Tajawal, Cairo, Arial, sans-serif',
            }}
          >
            <span style={{ color: '#0F172A' }}>كل مرة تقف أمام المرآة وتشدّ القميص لتغطي بطنك..</span>
            <br />
            <span style={{ color: '#1E3A8A' }}>
              حان وقت روتين يعتني بجلدك بلطف وصبر.
            </span>
          </h1>

          {/* ── SUB-HEADLINE — emotional + rational (Women & Men) ── */}
          <p
            className="text-base sm:text-lg pb-1"
            style={{
              color: '#334155',
              fontWeight: 500,
              lineHeight: '1.9',
              letterSpacing: '0.01em',
              fontFamily: 'var(--font-tajawal), Tajawal, Cairo, Arial, sans-serif',
            }}
          >
            نعرف تلك اللحظة: تختار الملابس الواسعة، وتتجنب البحر والمسبح، وتتمنى لو أن جسمك يشبه ما قبل. التشققات أثر حياة عشتِها، ولا تحتاج أن تخجل منها. سيلورا روتين بسيط من خطوتين: سيروم ببتيدات النحاس مع السيكا، وديرما رولر 0.5mm، للعناية بمظهر الجلد وملمسه ومرونته أسبوعاً بعد أسبوع.
          </p>

          {/* ── PAIN-POINT BULLETS ── */}
          <ul className="flex flex-col gap-3">
            {PAIN_BULLETS.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed border shadow-sm"
                style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{b.emoji}</span>
                <span style={{ color: '#334155' }}>
                  <strong style={{ color: '#0F172A', fontWeight: 800 }}>{b.bold}</strong>{' '}
                  {b.rest}
                </span>
              </li>
            ))}
          </ul>

          {/* ── Buy options — single piece vs. complete bundle, side by side ── */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Single piece — 199 SAR (Serum) */}
            <button
              type="button"
              onClick={() => setSelectedSetId('set-serum-only')}
              className="text-start rounded-2xl border-2 px-4 py-3.5 transition-all"
              style={{
                borderColor: selectedSetId === 'set-serum-only' ? '#1D4ED8' : '#E2E8F0',
                background: selectedSetId === 'set-serum-only' ? '#EFF6FF' : '#FFFFFF',
              }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: '#64748B' }}>العبوة الفردية</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: '#0F172A' }}>{singleSet.totalPrice}</span>
                <span className="text-xs font-bold" style={{ color: '#0F172A' }}>ر.س</span>
                <span className="text-xs line-through" style={{ color: '#94A3B8' }}>{singleSet.originalTotal}</span>
              </div>
              <div className="text-[11px] mt-0.5 font-medium" style={{ color: '#64748B' }}>سيروم النحاس 30ml فقط</div>
            </button>

            {/* Complete bundle — 249 SAR, best value */}
            <button
              type="button"
              onClick={() => setSelectedSetId('set-complete')}
              className="relative text-start rounded-2xl border-2 px-4 py-3.5 transition-all shadow-md"
              style={{
                borderColor: selectedSetId === 'set-complete' ? '#1D4ED8' : '#BFDBFE',
                background: selectedSetId === 'set-complete' ? '#EFF6FF' : '#FFFFFF',
              }}
            >
              <span
                className="absolute -top-2.5 end-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow"
                style={{ backgroundColor: '#1E3A8A', color: '#FDE047' }}
              >
                ⭐ الروتين المتكامل: سيروم + رولر
              </span>
              <div className="text-xs font-bold mb-1" style={{ color: '#1E3A8A' }}>الروتين العلاجي الأقوى</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: '#0F172A' }}>{completeSet.totalPrice}</span>
                <span className="text-xs font-bold" style={{ color: '#0F172A' }}>ر.س</span>
                <span className="text-xs line-through" style={{ color: '#94A3B8' }}>{completeSet.originalTotal}</span>
              </div>
              <div className="text-[11px] mt-0.5 font-bold" style={{ color: '#15803D' }}>سيروم 30ml + ديرما رولر — وفّر ٣٠ ريال</div>
            </button>
          </div>
          <p className="text-xs -mt-1 font-medium" style={{ color: '#475569' }}>
            💡 ديرما رولر التيتانيوم تفتح قنوات ميكروسكوبية تضاعف امتصاص السيروم ٨٠٪ لردم التمزق الداخلي
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleBuyNow} className="btn-gold flex-1 text-base py-4 font-black shadow-xl animate-cta-pulse">
              احصل على الطقم العلاجي — {selectedSet.totalPrice} ر.س
            </button>
            <Link
              href="/ar#results"
              className="btn-outline flex-1 text-center py-4 font-bold"
            >
              شاهدي نتائج قبل وبعد
            </Link>
          </div>

          <p className="text-xs text-center font-bold" style={{ color: '#15803D' }}>
            ✓ ادفع للمندوب بعد استلام وفحص طلبك بيدك · شحن فوري من مستودعاتنا بالرياض
          </p>

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
                style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#1E293B' }}
              >
                <Icon size={14} style={{ color: '#1D4ED8', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── LEFT: product visual (Enlarged and crystal clear) ── */}
        <div className="order-1 md:order-2 flex justify-center w-full">
          <div className="relative w-80 h-[420px] sm:w-[390px] sm:h-[480px] md:w-[440px] md:h-[530px] lg:w-[480px] lg:h-[560px]">

            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)' }}
            />

            {/* Hero image container — Maximize image presence */}
            <div
              className="absolute inset-2 sm:inset-3 rounded-3xl overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center p-2 sm:p-3"
              style={{ boxShadow: '0 20px 60px -15px rgba(15,23,42,0.14)' }}
            >
              <Photo
                src={IMG.duo}
                alt="سيروم ببتيدات النحاس والديرما رولر — Daranca"
                label="سيروم ببتيدات النحاس + ديرما رولر"
                priority
              />
            </div>

            {/* Floating chip: clinical results */}
            <div
              className="absolute -top-1 -start-3 sm:-start-5 rounded-2xl px-3.5 py-2.5 border shadow-lg bg-white border-slate-200 animate-float"
            >
              <div className="text-xl font-black text-blue-700">87%</div>
              <div className="text-[10px] font-bold text-slate-600">ردم وتحسن التشققات</div>
            </div>

            {/* Floating chip: peptide */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -end-6 rounded-2xl px-3 py-2 border shadow-luxury text-center"
              style={{ background: '#fff', borderColor: '#BFDBFE' }}
            >
              <div className="text-xl">🧬✨</div>
              <div className="text-[9px] font-bold leading-tight" style={{ color: '#1D4ED8' }}>ببتيدات<br />النحاس</div>
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
        <span className="text-xs font-medium">اكتشف</span>
        <ArrowDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
