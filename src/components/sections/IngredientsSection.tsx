import { PRODUCTS } from '@/lib/products';

// Combine unique ingredients from both the serum and the cream
const ALL_INGREDIENTS = [...PRODUCTS[0].ingredients, ...PRODUCTS[1].ingredients];
const INGREDIENTS = ALL_INGREDIENTS.filter(
  (ing, i) => ALL_INGREDIENTS.findIndex((x) => x.name === ing.name) === i
);

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="py-24 cv-auto" style={{ backgroundColor: '#F8F2EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <h2 className="section-heading">مكونات لا تتنازل عنها بشرتكِ</h2>
          <p className="section-sub">كل مكوّن اخترناه بعناية — ولكل واحد دور علمي واضح</p>
        </div>

        {/* ── Real ingredients flat-lay ── */}
        <div className="mb-14 rounded-3xl overflow-hidden mx-auto max-w-3xl" style={{ boxShadow: '0 16px 48px -12px rgba(58,40,24,0.20)' }}>
          <img
            src="/images/ingredients-flatlay.webp"
            alt="زبدة الشيا والأرجان واللوز الحلو وسنتيلا أسياتيكا"
            className="w-full aspect-[16/9] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 transition-all hover:shadow-luxury"
              style={{
                background: '#fff',
                border: '1.5px solid #E0CEBA',
                /* Subtle elevation so cards float off the beige bg */
                boxShadow: '0 2px 16px -2px rgba(58,40,24,0.07)',
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="text-2xl w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#F8F2EA', border: '1px solid #EFE4D4' }}
                >
                  {ing.icon}
                </div>
                <div>
                  {/* Bold dark title — was missing font-weight */}
                  <div
                    className="text-base leading-snug"
                    style={{ color: '#1A0F08', fontWeight: 800 }}
                  >
                    {ing.name}
                  </div>
                  <span className="badge text-xs mt-1">{ing.role}</span>
                </div>
              </div>
              {/* Darkened benefit description — was #5A4A3F, now #2B1E16 */}
              <p className="text-sm leading-relaxed" style={{ color: '#2B1E16', fontWeight: 400 }}>
                {ing.benefit}
              </p>
              <div
                className="h-0.5 mt-4 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(193,131,53,0.45), transparent)' }}
              />
            </div>
          ))}
        </div>

        {/* Clean formula strip */}
        <div
          className="mt-12 rounded-3xl px-8 py-7 grid sm:grid-cols-3 gap-6 text-center"
          style={{ backgroundColor: '#1A0F08' }}
        >
          {[
            { e: '🚫', t: 'خالٍ من العطور القسرية', d: 'آمن للبشرة الحساسة وبشرة ما بعد الحمل' },
            { e: '✅', t: 'وفق معايير ISO 22716',    d: 'كل تشغيلة تمر بفحص جودة صارم' },
            { e: '🌿', t: 'بلا باراب ولا كبريتات',   d: 'مكونات نقية — لا مواد مُضرّة' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{item.e}</div>
              {/* Bright white title */}
              <div className="font-bold mb-1" style={{ color: '#FDFAF6' }}>{item.t}</div>
              {/* High-contrast cream desc — was #8C7B6E */}
              <div className="text-sm" style={{ color: '#D4C4B0' }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
