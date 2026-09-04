import { Star, BadgeCheck } from 'lucide-react';

const REVIEWS = [
  { name: 'سارة م.',        city: 'الرياض',  rating: 5, date: 'قبل أسبوعين',  verified: true, text: 'والله جربت كل شيء وما كنت أصدق. بعد أسبوعين التشققات خفّت وبشرتي أصبحت أكثر إشراقاً. مستحيل أرجع لأي منتج ثاني.',           highlight: 'التشققات خفّت في أسبوعين' },
  { name: 'نورة الغامدي',  city: 'جدة',     rating: 5, date: 'قبل ٣ أسابيع', verified: true, text: 'اليدين كانت مشكلتي الأكبر من كثرة القيادة. بعد شهر واحد لون الاسمرار تحسن بشكل واضح والتجاعيد خفت.',                          highlight: 'اسمرار اليدين تحسّن بشهر' },
  { name: 'منى الشمري',    city: 'الدمام',  rating: 5, date: 'قبل شهر',      verified: true, text: 'التشققات اللي كانت تزعجني بعد الحمل بدأت تخف بشكل واضح. الشحن وصل بسرعة والتغليف فخم جداً.',                                highlight: 'تشققات ما بعد الحمل خفت' },
  { name: 'ريم العتيبي',   city: 'مكة',     rating: 5, date: 'قبل أسبوع',   verified: true, text: 'أول مرة أجرب دفع عند الاستلام وأنا خايفة، بس المنتج أكثر من ممتاز. كل صديقاتي يسألونني عن سري.',                             highlight: 'صديقاتها يسألن عن السر' },
  { name: 'هيفاء القحطاني', city: 'الرياض', rating: 5, date: 'قبل ٥ أيام',  verified: true, text: 'من أفضل ما جربت. بشرتي أصبحت أملس وأكثر توحداً. الخامة خفيفة جداً وما تخلي الوجه دهني.',                                   highlight: 'يستاهل ضعف سعره' },
  { name: 'عبير المالكي',  city: 'جدة',     rating: 5, date: 'قبل أسبوعين', verified: true, text: 'جربت الريتينول قبل كذا وأعطاني تقشر. سيروم سيلورا مختلف تماماً — ناعم على بشرتي وفعال في نفس الوقت.',                       highlight: 'ناعم وفعال في آن واحد' },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < count ? 'fill-current' : ''}
          style={{ color: i < count ? '#C4943E' : '#EFE4D4' }}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const breakdown = [
    { s: 5, pct: 91 }, { s: 4, pct: 6 }, { s: 3, pct: 2 }, { s: 2, pct: 1 }, { s: 1, pct: 0 },
  ];

  return (
    <section id="reviews" className="py-24" style={{ backgroundColor: '#F8F2EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-14">
          <h2 className="section-heading">ماذا تقول عملاؤنا؟</h2>
          <p className="section-sub">+٢٤٠٠ امرأة في المملكة يثقن بسيلورا</p>
        </div>

        {/* Aggregate */}
        <div className="max-w-lg mx-auto mb-12 card grid grid-cols-2 gap-6 items-center">
          <div className="text-center">
            <div className="text-6xl font-bold" style={{ color: '#1A0F08' }}>4.9</div>
            <div className="flex justify-center mt-1.5"><Stars count={5} /></div>
            <div className="text-sm mt-1.5" style={{ color: '#8C7B6E' }}>٢٤٣١ تقييم موثق</div>
          </div>
          <div className="space-y-1.5">
            {breakdown.map((row) => (
              <div key={row.s} className="flex items-center gap-2">
                <span className="text-xs w-3 text-end" style={{ color: '#8C7B6E' }}>{row.s}</span>
                <Star size={10} className="fill-current flex-shrink-0" style={{ color: '#C4943E' }} />
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#EFE4D4' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, background: '#C4943E' }}
                  />
                </div>
                <span className="text-xs w-6" style={{ color: '#8C7B6E' }}>{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="card flex flex-col gap-3 hover:shadow-luxury transition-shadow">
              <div className="badge-gold text-xs self-start">✨ {r.highlight}</div>
              <div className="flex items-center gap-2">
                <Stars count={r.rating} />
                {r.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#2D6B41' }}>
                    <BadgeCheck size={12} /> شراء موثق
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#3D2B1F' }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F8F2EA' }}>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#1A0F08' }}>{r.name} — {r.city}</div>
                  <div className="text-xs" style={{ color: '#8C7B6E' }}>{r.date}</div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shadow"
                  style={{ background: 'linear-gradient(135deg, #C4943E, #D4A96A)' }}
                >
                  {r.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
