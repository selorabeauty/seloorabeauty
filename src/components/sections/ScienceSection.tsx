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
          <span className="badge mb-4">✨ العلم وراء النتيجة</span>
          <h2 className="section-heading">علم ترميم الأنسجة المجهري</h2>
          <p className="section-sub">قوة ببتيدات النحاس الزرقاء (GHK-Cu) مع ديرما رولر التيتانيوم — حل العناية المخصص للتشققات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-3xl border transition-all hover:shadow-md"
              style={{ background: '#FFFFFF', borderColor: '#EFE4D4', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}
            >
              {/* Cobalt gradient text on stat value */}
              <div
                className="text-4xl md:text-5xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #A87830 0%, #C4943E 50%, #D4A96A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div className="text-sm font-bold leading-snug" style={{ color: '#1A0F08' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Deep dive */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* ── Comparison bars ── */}
          <div className="card flex flex-col justify-center gap-6" style={{ background: '#FBF7F1', borderColor: '#EFE4D4' }}>
            <h3 className="text-xl font-bold" style={{ color: '#1A0F08' }}>القوة البيولوجية لببتيدات النحاس (GHK-Cu) مثبتة سريرياً</h3>
            <p className="text-sm leading-relaxed -mt-3" style={{ color: '#6E5C50' }}>
              أثبتت الدراسات المتخصصة في العناية بالبشرة أن <strong style={{ color: '#A87830' }}>ببتيدات النحاس الزرقاء (GHK-Cu)</strong> تتفوق على علاجات الليزر والريتينول في تحفيز خلايا الفايبروبلاست لإنتاج الكولاجين والإيلاستين لردم التمزق بنسبة تفوق ٧٠٪ دون أي تهيج، بينما تفتح ديرما رولر التيتانيوم مسارات تضاعف الامتصاص للأدمة.
            </p>

            {BARS.map((bar, i) => (
              <div key={i}>
                <div
                  className="flex justify-between mb-2"
                  style={{ color: bar.hero ? '#A87830' : '#8C7B6E' }}
                >
                  <span className={bar.hero ? 'font-black text-sm' : 'font-medium text-sm'}>{bar.label}</span>
                  <span className={bar.hero ? 'font-black text-sm' : 'font-medium text-sm'}>{bar.pct}%</span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: '#EFE4D4' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${bar.pct}%`,
                      background: bar.hero
                        ? 'linear-gradient(90deg, #A87830 0%, #D4A96A 100%)'
                        : i === 1 ? '#B0998A' : '#E0CEBA',
                    }}
                  />
                </div>
              </div>
            ))}

            <p className="text-xs font-semibold" style={{ color: '#8C7B6E' }}>
              * موثق سريرياً بناءً على دراسات تجديد ألياف الأدمة وتجارب المستخدمين المعتمدة
            </p>
          </div>

          {/* ── Dark mechanism card ── */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-6 border"
            style={{ backgroundColor: '#1A0F08', borderColor: '#3D2B1F' }}
          >
            {/* Macro needle visual */}
            <div className="rounded-2xl overflow-hidden border -mt-2" style={{ borderColor: '#3D2B1F' }}>
              <img
                src="/images/roller-macro.webp"
                alt="لقطة مقربة لإبر التيتانيوم الدقيقة 0.5mm في ديرما رولر سيلورا"
                className="w-full aspect-[16/9] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Header */}
            <h3 className="text-xl font-bold" style={{ color: '#E8C98F' }}>
              كيف يعمل طقم سيلورا للعناية بالتشققات؟
            </h3>
            <p className="text-sm leading-relaxed -mt-4" style={{ color: '#E0CEBA' }}>
              مزيج سريري دقيق — تحفيز مجهري بإبر التيتانيوم 0.5mm يتبعه تغلغل فوري لببتيدات النحاس الزرقاء والسيكا لترميم طبقة الأدمة من الداخل.
            </p>

            {MECHANISM.map((m, i) => (
              <div key={i} className="flex gap-4">
                {/* Step number */}
                <span
                  className="font-black text-xl flex-shrink-0 leading-tight"
                  style={{ color: '#D4A96A' }}
                >
                  {m.step}
                </span>
                <div>
                  <div className="font-bold mb-1.5 text-base" style={{ color: '#FBF7F1' }}>
                    {m.title}
                  </div>
                  {/* Desc */}
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: '#B0998A', fontWeight: 400 }}
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
