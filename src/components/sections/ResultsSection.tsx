'use client';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-duo')!;

const TIMELINE = [
  { period: 'الأسبوع ١', result: 'تنشيط الدورة الدموية الدقيقة وتغذية الأنسجة بقطرات ببتيدات النحاس الزرقاء (GHK-Cu).', dot: '#EBD9B4' },
  { period: 'الأسبوع ٢', result: 'تفتيح واضح وملموس في لون التشققات الحمراء والبنفسجية وتهدئة نسيج الجلد بالسيكا.',    dot: '#D4A96A' },
  { period: 'الأسبوع ٤', result: 'تحفيز الكولاجين الذاتي بواسطة الديرما رولر — ردم التمزقات ونعومة حريرية للجلد.',      dot: '#A87830' },
  { period: 'الأسبوع ٨', result: 'تحول كامل وموثق — تشققات باهتة ومسطحة وشبه غير ملحوظة، واستعادة تامة للثقة.',         dot: '#2A1C12' },
];

const STATS = [
  { label: 'ردم التشققات العميقة وتسطيح النسيج', pct: '+85%', sub: 'اليوم ١ ← اليوم ٢٨',   img: '/images/before-after-day28.webp' },
  { label: 'تفتيح لون الخطوط الملونة',            pct: '+82%', sub: 'خلال أسبوعين',         img: '/images/before-after-2.webp' },
  { label: 'مرونة وكثافة الجلد العامة',           pct: '+94%', sub: 'تحسن موثق بالاستخدام',  img: '/images/before-after-3.webp' },
];

export default function ResultsSection() {
  const { setMainSet, openCheckout } = useCartStore();

  const handleBuyNow = () => {
    setMainSet({
      id: completeSet.id,
      name: completeSet.label,
      price: completeSet.totalPrice,
      originalPrice: completeSet.originalTotal,
      imageBg: 'from-amber-900 to-stone-950',
      includes: ['سيروم ببتيدات النحاس الأزرق 100ml', 'ديرما رولر التيتانيوم 0.5mm'],
      sku: completeSet.sku,
    });
    openCheckout();
  };

  return (
    <section id="results" className="py-24 cv-auto" style={{ backgroundColor: '#fff' }}>
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
              className="rounded-3xl border overflow-hidden bg-white"
              style={{ borderColor: '#EFE4D4', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.06)' }}
            >
              {/* Visual: real before/after photo */}
              {item.img && (
                <img
                  src={item.img}
                  alt={`قبل وبعد — ${item.label}`}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {/* Stat info */}
              <div className="p-4 text-center bg-white">
                <div className="font-bold text-sm leading-snug text-stone-900">
                  {item.label}
                </div>
                {/* Large cobalt percentage */}
                <div
                  className="font-black text-3xl my-1"
                  style={{
                    background: 'linear-gradient(135deg, #A87830 0%, #D4A96A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {item.pct}
                </div>
                <div className="text-xs font-semibold text-stone-500">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Timeline ── */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-center mb-8 text-stone-900">
            الجدول الزمني للترميم الخلوي
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE.map((step, i) => (
              <div key={i} className="card relative border-stone-200 hover:shadow-md transition-shadow">
                <div className="w-3.5 h-3.5 rounded-full mb-3 shadow-sm" style={{ background: step.dot }} />
                <div className="font-extrabold text-sm mb-2 text-stone-900">{step.period}</div>
                <p className="text-sm leading-relaxed text-stone-600">{step.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <button onClick={handleBuyNow} className="btn-gold text-lg px-10 py-5 font-black shadow-xl animate-cta-pulse">
            احصلي على الطقم العلاجي — الدفع عند الاستلام
          </button>
          <p className="text-sm mt-3 font-bold text-emerald-600">
            ✓ شحن مجاني وسريع · فحص الشحنة متاح قبل الدفع · ضمان استرجاع ٣٠ يوماً
          </p>
        </div>
      </div>
    </section>
  );
}
