const STATS = [
  { value: '87%',       label: 'تحسن مظهر التشققات الملونة' },
  { value: '94%',       label: 'زيادة موثقة في مرونة الجلد' },
  { value: 'SFDA',      label: 'معتمد من هيئة الغذاء والدواء' },
  { value: 'ISO',       label: 'مطابق لمعايير الجودة العالمية' },
];

const BARS = [
  { label: 'طقم ببتيدات النحاس + الديرما رولر (سيلورا)', pct: 96, hero: true },
  { label: 'جلسات الليزر والعيادات المكلفة',               pct: 65, hero: false },
  { label: 'كريمات وزيوت الترطيب العادية',                 pct: 18, hero: false },
  { label: 'بدون علاج',                                    pct: 5,  hero: false },
];

const MECHANISM = [
  { step: '٠١', title: 'الخطوة الأولى — ديرما رولر التيتانيوم (تحفيز مجهري)',  desc: '540 إبرة تيتانيوم طبية مقاس 0.5mm تفتح قنوات ميكروسكوبية دقيقة في النسيج المتصلب، مما يضاعف امتصاص السيروم بنسبة ٨٠٪ ويحفز الاستجابة الحيوية الطبيعية لترميم الجلد.' },
  { step: '٠٢', title: 'الخطوة الثانية — سيروم ببتيدات النحاس (GHK-Cu)',      desc: 'ببتيدات النحاس الزرقاء المركزة مع السيكا (Centella) تخترق مباشرة لطبقة الأدمة لردم التمزقات العميقة وتحفيز إنتاج كولاجين وإيلاستين جديد يمحو أثر التشققات.' },
  { step: '٠٣', title: 'نتائج سريرية موثقة',                                   desc: 'تحسن مثبت بنسبة 87% في مظهر وتفتيح التشققات الملونة والبيضاء و94% في مرونة الجلد خلال 4-8 أسابيع من الاستخدام المنتظم للبروتوكول المتكامل.' },
];

export default function ScienceSection() {
  return (
    <section id="science" className="py-24 cv-auto" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <span className="badge mb-4">🔬 العلم وراء النتيجة</span>
          <h2 className="section-heading">علم ترميم الأنسجة المجهري</h2>
          <p className="section-sub">قوة ببتيدات النحاس الزرقاء (GHK-Cu) مع ديرما رولر التيتانيوم — الحل الصيدلاني الموجه لطبقة الأدمة</p>
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
