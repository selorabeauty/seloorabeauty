import { PRODUCTS } from '@/lib/products';
import AssetPlaceholder from '@/components/ui/AssetPlaceholder';

// Combine unique ingredients from both the serum and the cream
const ALL_INGREDIENTS = [...PRODUCTS[0].ingredients, ...PRODUCTS[1].ingredients];
const INGREDIENTS = ALL_INGREDIENTS.filter(
  (ing, i) => ALL_INGREDIENTS.findIndex((x) => x.name === ing.name) === i
);

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="py-24 cv-auto" style={{ backgroundColor: '#FBF7F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <span className="badge-clinical mb-3">تركيبة فاخرة مدروسة</span>
          <h2 className="section-heading">مكونات نشطة مدروسة سريرياً</h2>
          <p className="section-sub">كل عنصر في طقم سيلورا له وظيفة بيولوجية محددة لردم التمزق وتجديد الخلايا</p>
        </div>

        {/* ── Real ingredients & system showcase ── */}
        <div className="mb-14 mx-auto max-w-2xl">
          {/* TODO(asset): ingredients visual — replace with the real photo described below */}
          <AssetPlaceholder
            label="Ingredients Flat-Lay"
            note="صورة flat-lay أنيقة: عبوة السيروم + ديرما رولر على سطح رخامي/قماشي مع قطرة سيروم زرقاء ولمسة خضراء (ورقة سيكا) — توصّل «مكونات فاخرة طبيعية». أفقية 4:3."
            ratio="aspect-[4/3]"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 transition-all hover:shadow-lg"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EFE4D4',
                boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)',
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="text-2xl w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#FBF3E4', border: '1px solid #EBD9B4' }}
                >
                  {ing.icon}
                </div>
                <div>
                  <div
                    className="text-base leading-snug"
                    style={{ color: '#1A0F08', fontWeight: 800 }}
                  >
                    {ing.name}
                  </div>
                  <span className="badge text-xs mt-1">{ing.role}</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#6E5C50', fontWeight: 400 }}>
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
          style={{ backgroundColor: '#1A0F08', borderColor: '#3D2B1F' }}
        >
          {[
            { e: '🚫', t: 'خالٍ من الكحول والعطور المهيجة', d: 'آمن للبشرة الحساسة وبشرة ما بعد الحمل والجيم' },
            { e: '✅', t: 'مطابق لمعايير ISO 22716',    d: 'كل تشغيلة تمر بفحص جودة صارم لكل تشغيلة' },
            { e: '🌿', t: 'تركيبة نقية معتمدة',        d: 'ببتيدات وسيكا عالية النقاء بدون بارابين أو كبريتات' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">{item.e}</span>
              <div className="font-bold text-sm text-white">{item.t}</div>
              <div className="text-xs text-stone-400">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
