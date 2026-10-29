'use client';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';
import ShowcaseSection from './ShowcaseSection';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;

const TIMELINE = [
  { period: 'الأسبوع ١-٢', result: 'ترطيب ونعومة، وملمس أريح للبشرة. هذه بداية العادة، لا النتيجة النهائية.', dot: '#BFDBFE' },
  { period: 'الأسبوع ٤', result: 'مع الالتزام اليومي وجلسة الرولر الأسبوعية، كثيرات يلاحظن بشرة أنعم وأكثر مرونة.', dot: '#60A5FA' },
  { period: 'الأسبوع ٨', result: 'قد يبدو لون التشققات أكثر توحداً مع لون بشرتك. الخطوط القديمة تحتاج صبراً أطول.', dot: '#1D4ED8' },
  { period: 'الأسبوع ١٢', result: 'صوّر بطنك كل أسبوعين بنفس الضوء، وقارن بنفسك. النتائج تختلف من بشرة لأخرى.', dot: '#0B1B3D' },
];

export default function ResultsSection() {
  const { setMainSet, openCheckout } = useCartStore();

  const handleBuyNow = () => {
    setMainSet({
      id: completeSet.id,
      name: completeSet.label,
      price: completeSet.totalPrice,
      originalPrice: completeSet.originalTotal,
      imageBg: 'from-blue-900 to-slate-950',
      includes: ['سيروم ببتيدات النحاس الأزرق 30ml', 'ديرما رولر التيتانيوم 0.5mm'],
      sku: completeSet.sku,
    });
    openCheckout();
  };

  return (
    <section id="results" className="py-24 cv-auto" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <h2 className="section-heading">ماذا تتوقع، بصدق؟</h2>
          <p className="section-sub">لا نعدك بجسم «بلا أثر». نعدك بروتين واضح وتوقعات واقعية، وبأن ترى تقدمك بعينك.</p>
        </div>

        {/* ── Timeline ── */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-center mb-8 text-slate-900">
            رحلتك مع الروتين
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE.map((step, i) => (
              <div key={i} className="card relative border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-3.5 h-3.5 rounded-full mb-3 shadow-sm" style={{ background: step.dot }} />
                <div className="font-extrabold text-sm mb-2 text-slate-900">{step.period}</div>
                <p className="text-sm leading-relaxed text-slate-600">{step.result}</p>
              </div>
            ))}
          </div>
        </div>

        <ShowcaseSection embedded />

        {/* ── CTA ── */}
        <div className="text-center">
          <button onClick={handleBuyNow} className="btn-gold text-lg px-10 py-5 font-black shadow-xl animate-cta-pulse">
            ابدأ روتينك — الدفع عند الاستلام
          </button>
          <p className="text-sm mt-3 font-bold text-emerald-600">
            ✓ شحن مجاني وسريع · فحص الشحنة متاح قبل الدفع · ضمان استرجاع ٣٠ يوماً
          </p>
        </div>
      </div>
    </section>
  );
}
