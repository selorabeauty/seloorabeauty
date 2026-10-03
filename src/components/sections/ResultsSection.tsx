'use client';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;

const TIMELINE = [
  { period: 'الأسبوع ١', result: 'ترطيب عميق ونعومة ملحوظة في منطقة التشققات من الاستخدام الأول',    dot: '#EFE4D4' },
  { period: 'الأسبوع ٢', result: 'بداية تحسن ملحوظ في لون التشققات الحمراء والبنفسجية',             dot: '#D4A96A' },
  { period: 'الأسبوع ٤', result: 'تشققات أفتح وأقل بروزاً، ومرونة أعلى في البشرة المحيطة',           dot: '#C4943E' },
  { period: 'الأسبوع ٨', result: 'تحول حقيقي — تشققات باهتة وشبه غير ملحوظة، بشرة موحدة وواثقة',    dot: '#1A0F08' },
];

const STATS = [
  { label: 'تحسن مظهر التشققات',        pct: '+87%', sub: 'في ٤ أسابيع',       img: '/images/before-after-1.webp' },
  { label: 'تفتيح لون التشققات الحمراء', pct: '+82%', sub: 'خلال أسبوعين',      img: '/images/before-after-2.webp' },
  { label: 'مرونة البشرة العامة',        pct: '+94%', sub: 'تحسن ملحوظ',        img: '/images/before-after-3.webp' },
];

export default function ResultsSection() {
  const { setMainSet, openCheckout } = useCartStore();

  const handleBuyNow = () => {
    setMainSet({
      id: completeSet.id,
      name: completeSet.label,
      price: completeSet.totalPrice,
      originalPrice: completeSet.originalTotal,
      imageBg: 'from-bark-800 to-bark-900',
      includes: ['سيروم علاج تشققات الجسم', 'كريم علاج تشققات الجسم'],
      sku: completeSet.sku,
    });
    openCheckout();
  };

  return (
    <section id="results" className="py-24" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <h2 className="section-heading">النتائج تتكلم عن نفسها</h2>
          <p className="section-sub">تشققات الجسم — قبل وبعد حقيقي من عميلات المملكة</p>
        </div>

        {/* ── Before / After stat cards ── */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {STATS.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border overflow-hidden"
              style={{ borderColor: '#EFE4D4', boxShadow: '0 2px 16px -2px rgba(58,40,24,0.07)' }}
            >
              {/* Visual: real before/after photo or fallback pair */}
              {item.img ? (
                <img
                  src={item.img}
                  alt={`قبل وبعد — ${item.label}`}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid grid-cols-2 gap-px" style={{ background: '#EFE4D4' }}>
                  {['قبل', 'بعد'].map((label, j) => (
                    <div
                      key={j}
                      className="flex flex-col items-center justify-center gap-3 py-6 px-3"
                      style={{ background: '#F8F2EA' }}
                    >
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md"
                        style={{
                          background: j === 0
                            ? 'radial-gradient(circle, #D5C0AA 0%, #B89880 100%)'
                            : 'radial-gradient(circle, #FBF3E3 0%, #D4A96A 100%)',
                        }}
                      />
                      <span className="text-sm font-bold" style={{ color: '#1A0F08' }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stat info */}
              <div className="p-4 text-center" style={{ background: '#fff' }}>
                {/* Bold dark label */}
                <div className="font-bold text-sm leading-snug" style={{ color: '#1A0F08' }}>
                  {item.label}
                </div>
                {/* Large gold percentage */}
                <div
                  className="font-bold text-3xl my-1"
                  style={{
                    background: 'linear-gradient(90deg, #C4943E, #D4A96A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {item.pct}
                </div>
                {/* Darkened sub — was #8C7B6E */}
                <div className="text-xs font-semibold" style={{ color: '#2B1E16' }}>
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Timeline ── */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-center mb-8" style={{ color: '#1A0F08' }}>
            رحلة بشرتكِ مع سيلورا
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE.map((step, i) => (
              <div key={i} className="card relative">
                <div className="w-3 h-3 rounded-full mb-3" style={{ background: step.dot }} />
                <div className="font-bold text-sm mb-2" style={{ color: '#1A0F08' }}>{step.period}</div>
                {/* Darkened timeline text — was #5A4A3F */}
                <p className="text-sm leading-relaxed" style={{ color: '#2B1E16' }}>{step.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <button onClick={handleBuyNow} className="btn-gold text-lg px-10 py-5 animate-shimmer">
            ابدئي رحلتكِ — اطلبي الآن
          </button>
          {/* Darkened CTA sub note */}
          <p className="text-sm mt-3 font-medium" style={{ color: '#2B1E16' }}>
            دفع عند الاستلام · ضمان استرداد ٣٠ يوماً
          </p>
        </div>
      </div>
    </section>
  );
}
