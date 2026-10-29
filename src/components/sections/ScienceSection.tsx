const STATS = [
  { value: '30ml',      label: 'سيروم بقطّارة' },
  { value: '540',       label: 'إبرة تيتانيوم بالرولر' },
  { value: '0.5mm',     label: 'مقاس لطيف للمنزل' },
  { value: '٨-١٢ أسبوعاً', label: 'التزام موصى به' },
];

const TIMELINE = [
  { when: 'أسبوع ١-٢', what: 'ترطيب ونعومة وملمس أكثر راحة.' },
  { when: 'أسبوع ٤-٨', what: 'كثير من المستخدمات يلاحظن تحسناً في ملمس ومظهر البشرة.' },
  { when: 'أسبوع ٨-١٢', what: 'التشققات القديمة تحتاج التزاماً أطول؛ صوّري المنطقة كل أسبوعين.' },
];

const MECHANISM = [
  { step: '٠١', title: 'الخطوة الأولى — ديرما رولر 0.5mm (مرة إلى مرتين أسبوعياً)',  desc: '540 إبرة تيتانيوم بمقاس لطيف للمنزل تهيّئ سطح البشرة قبل السيروم. عقّميه قبل وبعد كل استخدام ولا تستخدميه على جلد متهيج.' },
  { step: '٠٢', title: 'الخطوة الثانية — سيروم ببتيدات النحاس (GHK-Cu) + سيكا',      desc: 'ببتيدات النحاس وخلاصة السيكا وحمض الهيالورونيك مكونات معروفة في أبحاث العناية بالبشرة لدعم مرونة الجلد وتهدئته وترطيبه.' },
  { step: '٠٣', title: 'الالتزام هو السر',                                   desc: 'النتائج تختلف من بشرة لأخرى. التزمي ٨-١٢ أسبوعاً وصوّري المنطقة كل أسبوعين لتتابعي التقدم بنفسكِ.' },
];

export default function ScienceSection() {
  return (
    <section id="science" className="py-24 cv-auto" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <span className="badge mb-4">🔬 العلم وراء النتيجة</span>
          <h2 className="section-heading">كيف يعمل الروتين؟</h2>
          <p className="section-sub">خطوتان بسيطتان: رولر لطيف يهيّئ بشرتكِ، وسيروم ببتيدات النحاس (GHK-Cu) يعتني بها كل يوم</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-3xl border transition-all hover:shadow-md"
              style={{ background: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}
            >
              {/* Cobalt gradient text on stat value */}
              <div
                className="text-4xl md:text-5xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div className="text-sm font-bold leading-snug" style={{ color: '#0F172A' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Deep dive */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* ── Realistic timeline ── */}
          <div className="card flex flex-col justify-center gap-6" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold" style={{ color: '#0F172A' }}>ماذا تتوقعين مع الالتزام؟</h3>
            <p className="text-sm leading-relaxed -mt-3" style={{ color: '#475569' }}>
              ببتيدات النحاس (GHK-Cu) مكوّن معروف في أبحاث العناية بالبشرة. لا نعدكِ بنتيجة سحرية، بل بروتين واضح وصادق:
            </p>
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="font-black text-sm whitespace-nowrap" style={{ color: '#1D4ED8' }}>{t.when}</span>
                <span className="text-sm" style={{ color: '#475569' }}>{t.what}</span>
              </div>
            ))}
            <p className="text-xs font-semibold" style={{ color: '#64748B' }}>
              * النتائج تختلف من بشرة لأخرى. منتج تجميلي وليس علاجاً طبياً.
            </p>
          </div>

          {/* ── Dark mechanism card ── */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-6 border"
            style={{ backgroundColor: '#0B132B', borderColor: '#1E293B' }}
          >
            {/* Header */}
            <h3 className="text-xl font-bold" style={{ color: '#93C5FD' }}>
              كيف يعمل الروتين خطوة بخطوة؟
            </h3>
            <p className="text-sm leading-relaxed -mt-4" style={{ color: '#CBD5E1' }}>
              روتين من خطوتين — رولر 0.5mm بإبر التيتانيوم يتبعه سيروم ببتيدات النحاس والسيكا للعناية بمظهر الجلد ومرونته.
            </p>

            {MECHANISM.map((m, i) => (
              <div key={i} className="flex gap-4">
                {/* Step number */}
                <span
                  className="font-black text-xl flex-shrink-0 leading-tight"
                  style={{ color: '#38BDF8' }}
                >
                  {m.step}
                </span>
                <div>
                  <div className="font-bold mb-1.5 text-base" style={{ color: '#F8FAFC' }}>
                    {m.title}
                  </div>
                  {/* Desc */}
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: '#94A3B8', fontWeight: 400 }}
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
