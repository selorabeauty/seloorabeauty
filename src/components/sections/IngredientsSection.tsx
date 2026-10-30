import { PRODUCTS } from '@/lib/products';

// Combine unique ingredients from both the serum and the cream
const ALL_INGREDIENTS = [...PRODUCTS[0].ingredients, ...PRODUCTS[1].ingredients];
const INGREDIENTS = ALL_INGREDIENTS.filter(
  (ing, i) => ALL_INGREDIENTS.findIndex((x) => x.name === ing.name) === i
);

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="py-24 cv-auto" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <span className="badge-clinical mb-3">🔬 تركيبة معملية متقدمة</span>
          <h2 className="section-heading">مكونات نشطة مدروسة سريرياً</h2>
          <p className="section-sub">كل عنصر في طقم سيلورا الصيدلاني له وظيفة بيولوجية محددة لردم التمزق وتجديد الخلايا</p>
        </div>

        {/* ── Real ingredients & system showcase ── */}
        <div className="mb-14 rounded-3xl overflow-hidden mx-auto max-w-2xl bg-white border border-slate-200 p-6 flex items-center justify-center shadow-md">
          <img
            src="/images/copper-roller-duo.webp"
            alt="تركيبة ببتيدات النحاس الزرقاء وديرما رولر التيتانيوم — سيلورا ديرما"
            className="w-full max-h-80 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 transition-all hover:shadow-lg"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)',
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="text-2xl w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
                >
                  {ing.icon}
                </div>
                <div>
                  <div
                    className="text-base leading-snug"
                    style={{ color: '#0F172A', fontWeight: 800 }}
                  >
                    {ing.name}
                  </div>
                  <span className="badge text-xs mt-1">{ing.role}</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#475569', fontWeight: 400 }}>
                {ing.benefit}
              </p>
              <div
                className="h-0.5 mt-4 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.4), transparent)' }}
              />
            </div>
          ))}
        </div>

        {/* Clean formula strip */}
        <div
          className="mt-12 rounded-3xl px-8 py-7 grid sm:grid-cols-3 gap-6 text-center border"
          style={{ backgroundColor: '#0B132B', borderColor: '#1E293B' }}
        >
          {[
            { e: '🚫', t: 'خالٍ من الكحول والعطور المهيجة', d: 'آمن للبشرة الحساسة وبشرة ما بعد الحمل والجيم' },
            { e: '✅', t: 'مطابق لمعايير ISO 22716',    d: 'كل تشغيلة تمر بفحص تعقيم وجودة صيدلانية صارم' },
            { e: '🌿', t: 'تركيبة نقية معتمدة',        d: 'ببتيدات وسيكا عالية النقاء بدون بارابين أو كبريتات' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">{item.e}</span>
              <div className="font-bold text-sm text-white">{item.t}</div>
              <div className="text-xs text-slate-400">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
