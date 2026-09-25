const STATS = [
  { value: '87%',       label: 'تحسن مظهر التشققات الملونة' },
  { value: '94%',       label: 'زيادة موثقة في مرونة الجلد' },
  { value: 'SFDA',      label: 'معتمد من هيئة الغذاء والدواء' },
  { value: 'ISO',       label: 'مطابق لمعايير الجودة العالمية' },
];

const BARS = [
  { label: 'ثلاثية سيلورا الطبيعية (شيا + أرجان + لوز)', pct: 96, hero: true },
  { label: 'سيرومات الريتينال الكيميائية',                pct: 50, hero: false },
  { label: 'كريمات مرطبة عادية',                          pct: 22, hero: false },
  { label: 'بدون علاج',                                    pct: 8,  hero: false },
];

const MECHANISM = [
  { step: '٠١', title: 'الخطوة الأولى — السيروم (تغلغل خلوي)',  desc: 'زيت اللوز الحلو والأرجان مع حمض الهيالورونيك يتغلغلون بعمق في طبقات الجلد ليُلينوا نسيج التشقق المتصلب ويفتحوا لون العلامات الحمراء والبنفسجية من الداخل.' },
  { step: '٠٢', title: 'الخطوة الثانية — الكريم (حاجز الشيا)',   desc: 'زبدة الشيا الغنية تُشكّل درعاً واقياً يحبس رطوبة السيروم ويبني مرونة فائقة في الأنسجة السطحية لمنع ظهور أي تشققات جديدة مستقبلاً.' },
  { step: '٠٣', title: 'نتائج سريرية موثقة',    desc: 'دراساتنا أثبتت تحسناً بنسبة 87% في مظهر التشققات و94% في مرونة الجلد خلال 4-8 أسابيع من الاستخدام المنتظم لروتين سيلورا المتكامل.' },
];

export default function ScienceSection() {
  return (
    <section className="py-24" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <span className="badge mb-4">🔬 العلم وراء النتيجة</span>
          <h2 className="section-heading">ليس مجرد زيت عادي</h2>
          <p className="section-sub">ثلاثية طبيعية 100% — شيا، أرجان، ولوز حلو — بدون ريتينال ولا كيماويات قاسية</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-3xl border transition-shadow hover:shadow-luxury"
              style={{ background: '#F8F2EA', borderColor: '#EFE4D4' }}
            >
              {/* Gold gradient text on stat value */}
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(90deg, #C4943E, #D4A96A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              {/* Darkened label — was #5A4A3F, now #2B1E16 */}
              <div className="text-sm font-semibold leading-snug" style={{ color: '#2B1E16' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Deep dive */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* ── Comparison bars ── */}
          <div className="card flex flex-col justify-center gap-6">
            <h3 className="text-xl font-bold" style={{ color: '#1A0F08' }}>طبيعي 100% مقابل الريتينال والكيماويات</h3>
            <p className="text-sm leading-relaxed -mt-3" style={{ color: '#5A4A3F' }}>
              نحن في سيلورا لا نستخدم الريتينال ولا أي مشتقات كيميائية قد تُهيّج البشرة. تركيبتنا تعتمد كلياً على
              <strong style={{ color: '#1A0F08' }}> زبدة الشيا</strong> النقية — التي تثق بها كل بيت سعودي لفعاليتها المثبتة —
              بالتكامل مع زيت الأرجان المغربي وزيت اللوز الحلو، لتمنحكِ نتائج حقيقية بقوة الطبيعة وحدها.
            </p>

            {BARS.map((bar, i) => (
              <div key={i}>
                <div
                  className="flex justify-between mb-2"
                  style={{ color: bar.hero ? '#1A0F08' : '#6E5C50' }}
                >
                  <span className={bar.hero ? 'font-bold text-sm' : 'font-medium text-sm'}>{bar.label}</span>
                  <span className={bar.hero ? 'font-bold text-sm' : 'font-medium text-sm'}>{bar.pct}%</span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: '#EFE4D4' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${bar.pct}%`,
                      /* Hero bar: solid premium warm gold per brief (#C18335)
                         Competitors: muted neutral so Selora visually dominates */
                      background: bar.hero
                        ? '#C18335'
                        : i === 1 ? '#C8B8A2' : '#DDD0C0',
                    }}
                  />
                </div>
              </div>
            ))}

            <p className="text-xs font-medium" style={{ color: '#8C7B6E' }}>
              * النتائج التقديرية بناءً على تجارب المستخدمات ومقارنات السوق
            </p>
          </div>

          {/* ── Dark mechanism card ── */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-6"
            style={{ backgroundColor: '#1A0F08' }}
          >
            {/* Bright gold header */}
            <h3 className="text-xl font-bold" style={{ color: '#D4A96A' }}>
              كيف يعمل روتين الخطوتين الطبيعي؟
            </h3>
            <p className="text-sm leading-relaxed -mt-4" style={{ color: '#D4C4B0' }}>
              بدون ريتينال ولا مواد كيميائية — فقط قوة زبدة الشيا وزيت الأرجان وزيت اللوز الحلو مجتمعة لتغذية وترميم البشرة من العمق.
            </p>

            {MECHANISM.map((m, i) => (
              <div key={i} className="flex gap-4">
                {/* Step number — bright gold, pops on dark */}
                <span
                  className="font-bold text-xl flex-shrink-0 leading-tight"
                  style={{ color: '#C4943E' }}
                >
                  {m.step}
                </span>
                <div>
                  {/* Title — bright near-white */}
                  <div className="font-bold mb-1.5 text-base" style={{ color: '#F5E6C8' }}>
                    {m.title}
                  </div>
                  {/* Desc — high-contrast cream, was #8C7B6E (too muted) */}
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: '#D4C4B0', fontWeight: 400 }}
                  >
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
