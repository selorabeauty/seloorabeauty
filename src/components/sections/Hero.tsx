'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Star, Gift, Sparkles, Leaf, PhoneCall, PackageCheck, Banknote } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';
import { trackAddToCart } from '@/lib/pixels';

const duo = SET_OPTIONS[0];

// ── Value bullets — soft, benefit-led, no lab phrasing ──
const VALUE_BULLETS = [
  {
    Icon: Sparkles,
    bold: 'ببتيدات النحاس الزرقاء (GHK-Cu):',
    rest: 'تخترق لعمق البشرة لتحفز تجديد الكولاجين وتردم الخطوط من الداخل — بلمسة حريرية خفيفة.',
  },
  {
    Icon: Gift,
    bold: 'ديرما رولر التيتانيوم هدية مجانية:',
    rest: '٥٤٠ إبرة دقيقة تفتح مسارات لطيفة تضاعف امتصاص السيروم — تأتيكِ مجاناً داخل كل طقم.',
  },
  {
    Icon: Leaf,
    bold: 'نتائج نراها وتحبينها — وضمان ٣٠ يوماً:',
    rest: 'تحسّن ملحوظ في مظهر التشققات خلال أسابيع، مع دفع عند الاستلام وضمان استرجاع كامل.',
  },
];

// ── COD journey — what happens after they tap order ──
const COD_STEPS = [
  { Icon: PhoneCall,    text: 'نتواصل معكِ للتأكيد' },
  { Icon: Truck,        text: 'شحن ١‑٣ أيام لباب بيتكِ' },
  { Icon: PackageCheck, text: 'افحصي الطلب ثم ادفعي' },
];

export default function Hero() {
  const { setMainSet, openCheckout } = useCartStore();
  const [ordersToday, setOrdersToday] = useState(63);

  useEffect(() => {
    const t = setInterval(() => setOrdersToday((n) => n + 1), 11000);
    return () => clearInterval(t);
  }, []);

  const handleBuyNow = () => {
    trackAddToCart({ id: duo.id, sku: duo.sku, name: duo.label, price: duo.totalPrice });
    setMainSet({
      id: duo.id,
      name: duo.label,
      price: duo.totalPrice,
      originalPrice: duo.originalTotal,
      imageBg: 'from-amber-100 to-stone-200',
      includes: ['سيروم ببتيدات النحاس الأزرق 100ml', 'ديرما رولر التيتانيوم — هدية مجانية'],
      sku: duo.sku,
    });
    openCheckout();
  };

  return (
    <section className="relative bg-hero pt-24 pb-10 md:pt-28 md:pb-14 overflow-hidden">

      {/* Soft decorative warmth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -end-40 w-[560px] h-[560px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(196,148,62,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -start-24 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,169,106,0.10) 0%, transparent 70%)' }} />
      </div>

      {/* ── Stacked flow: image → headline → copy → offer → CTA ── */}
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

        {/* 1 · Product image first */}
        <div className="animate-reveal relative w-full max-w-sm sm:max-w-md" style={{ ['--reveal-delay' as string]: '60ms' }}>
          <div
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(196,148,62,0.20) 0%, transparent 70%)' }}
          />
          <div
            className="relative rounded-[2rem] overflow-hidden p-3 sm:p-4"
            style={{ border: '1px solid #EFE4D4', boxShadow: '0 24px 64px -16px rgba(58,40,24,0.20)', background: '#FDFAF6' }}
          >
            <img
              src="/images/hero-duo.webp"
              alt="طقم سيلورا — سيروم ببتيدات النحاس 100ml وديرما رولر التيتانيوم هدية"
              className="w-full aspect-[4/5] object-cover"
              width={1080}
              height={1350}
              fetchPriority="high"
              decoding="async"
            />
          </div>

          {/* Floating proof chip */}
          <div
            className="absolute -bottom-3 -end-2 sm:-end-5 rounded-2xl px-3.5 py-2.5 shadow-lg bg-white animate-float"
            style={{ border: '1px solid #EFE4D4' }}
          >
            <div className="flex gap-0.5 mb-0.5 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-current" style={{ color: '#C4943E' }} />
              ))}
            </div>
            <div className="text-[10px] font-bold" style={{ color: '#3D2B1F' }}>+٣٤٠٠ عميلة سعيدة</div>
          </div>
        </div>

        {/* 2 · Headline */}
        <h1
          className="animate-rise mt-8 text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.3] tracking-tight font-black"
          style={{ color: '#1A0F08', ['--rise-delay' as string]: '160ms' }}
        >
          ودّعي علامات التمدد الحمراء والبيضاء..
          <br />
          <span className="text-gold">واستعيدي نقاء وصفاء بشرتكِ بكورس سيلورا.</span>
        </h1>

        {/* 3 · Persuasive copy */}
        <p
          className="animate-rise mt-4 text-base sm:text-lg leading-[1.95] font-medium max-w-xl"
          style={{ color: '#5A4A3F', ['--rise-delay' as string]: '260ms' }}
        >
          سيروم ببتيدات النحاس الأزرق 100ml مع ديرما رولر التيتانيوم هدية — روتين لطيف يعتني بخطوط التمدد بعد الحمل وتقلبات الوزن، ويمنح بشرتكِ مرونة ونعومة تلاحظينها.
        </p>

        {/* Social proof pills + free-gift ribbon (kept off the headline) */}
        <div className="animate-rise mt-5 flex items-center gap-2.5 flex-wrap justify-center" style={{ ['--rise-delay' as string]: '320ms' }}>
          <span className="badge-gold"><Star size={12} className="fill-current" /> 4.9 · ٣٤١٨ تقييم</span>
          <span className="badge">{ordersToday} طلب اليوم في المملكة</span>
          <span
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #C4943E, #A87830)' }}
          >
            <Gift size={13} /> + ديرما رولر هدية مجانية
          </span>
        </div>

        {/* Value bullets */}
        <ul className="animate-rise mt-6 flex flex-col gap-3 w-full text-start" style={{ ['--rise-delay' as string]: '380ms' }}>
          {VALUE_BULLETS.map(({ Icon, bold, rest }, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed"
              style={{ background: '#FFFFFF', border: '1px solid #EFE4D4', boxShadow: '0 2px 12px -4px rgba(58,40,24,0.06)' }}
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#FBF3E4', color: '#A87830' }}
              >
                <Icon size={17} />
              </span>
              <span style={{ color: '#5A4A3F' }}>
                <strong style={{ color: '#1A0F08', fontWeight: 800 }}>{bold}</strong>{' '}
                {rest}
              </span>
            </li>
          ))}
        </ul>

        {/* ── The offer — one bundle, gift framing ── */}
        <div
          className="animate-rise mt-6 w-full rounded-3xl p-5 text-start relative"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FBF3E4 100%)',
            border: '1.5px solid #EBD9B4',
            boxShadow: '0 12px 40px -8px rgba(196,148,62,0.25)',
            ['--rise-delay' as string]: '440ms',
          }}
        >
          <span
            className="absolute -top-3 end-5 text-[11px] font-black px-3 py-1 rounded-full text-white shadow"
            style={{ background: 'linear-gradient(135deg, #C4943E, #A87830)' }}
          >
            ⭐ العرض الأفضل — وفري ٨٠ ريال
          </span>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm font-black" style={{ color: '#1A0F08' }}>طقم سيلورا الكامل</div>
              <div className="text-xs mt-1 font-semibold" style={{ color: '#6E5C50' }}>
                سيروم ببتيدات النحاس 100ml <span style={{ color: '#A87830' }}>+ ديرما رولر هدية</span>
              </div>
            </div>
            <div className="text-end">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black" style={{ color: '#1A0F08' }}>199</span>
                <span className="text-sm font-bold" style={{ color: '#1A0F08' }}>ر.س</span>
                <span className="text-sm line-through" style={{ color: '#B0998A' }}>279</span>
              </div>
              <div className="text-[11px] font-bold" style={{ color: '#2D6B41' }}>شامل الضريبة والشحن السريع</div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="animate-rise mt-6 w-full flex flex-col sm:flex-row gap-3" style={{ ['--rise-delay' as string]: '500ms' }}>
          <button onClick={handleBuyNow} className="btn-gold animate-shimmer flex-1 text-base py-4 font-black">
            اطلبي الطقم — 199 ر.س + هدية مجانية
          </button>
          <Link href="/ar#results" className="btn-outline flex-1 text-center py-4 font-bold">
            شاهدي نتائج قبل وبعد
          </Link>
        </div>

        <p className="animate-rise mt-3 text-xs font-bold" style={{ color: '#2D6B41', ['--rise-delay' as string]: '540ms' }}>
          ✓ ادفعي للمندوب بعد استلام وفحص طلبكِ بيدكِ · شحن فوري من مستودعاتنا بالرياض
        </p>

        {/* COD journey strip */}
        <div className="animate-rise mt-5 w-full grid grid-cols-3 gap-2" style={{ ['--rise-delay' as string]: '580ms' }}>
          {COD_STEPS.map(({ Icon, text }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[11px] font-bold"
              style={{ background: '#FFFFFF', border: '1px solid #EFE4D4', color: '#3D2B1F' }}
            >
              <Icon size={17} style={{ color: '#A87830' }} />
              {text}
            </div>
          ))}
        </div>

        {/* Trust micro-row */}
        <div className="animate-rise mt-3 w-full grid grid-cols-3 gap-2" style={{ ['--rise-delay' as string]: '620ms' }}>
          {[
            { Icon: Banknote,    text: 'دفع عند الاستلام' },
            { Icon: RotateCcw,   text: 'ضمان ٣٠ يوم' },
            { Icon: ShieldCheck, text: 'منتج أصلي معتمد' },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-center justify-center gap-1.5 text-[11px] font-bold" style={{ color: '#8C7B6E' }}>
              <Icon size={13} style={{ color: '#C4943E', flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
