import { ShieldCheck, RotateCcw, Banknote, MessageCircle } from 'lucide-react';
import { REAL_REVIEWS } from '@/lib/reviews';

const PROMISES = [
  { Icon: Banknote, title: 'ادفعي بعد أن تري الطلب', desc: 'افحصي العبوة عند وصول المندوب ثم ادفعي نقداً.' },
  { Icon: RotateCcw, title: 'ضمان استرجاع ٣٠ يوماً', desc: 'إن لم ترتاحي للتجربة تواصلي معنا وراجعي شروط الإرجاع.' },
  { Icon: ShieldCheck, title: 'مكونات معلنة وتوقعات صادقة', desc: 'نخبركِ بالمدة الواقعية: ٨-١٢ أسبوعاً مع الالتزام، والنتائج تختلف من بشرة لأخرى.' },
  { Icon: MessageCircle, title: 'نردّ عليكِ شخصياً', desc: 'أي سؤال عن الاستخدام أو البشرة الحساسة؟ راسلينا قبل الطلب.' },
];

export default function ReviewsSection() {
  const hasReviews = REAL_REVIEWS.length > 0;

  return (
    <section id="reviews" className="py-24 cv-auto" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge-clinical mb-3">💬 {hasReviews ? 'تجارب عميلاتنا' : 'وعدنا لكِ'}</span>
          <h2 className="section-heading">
            {hasReviews ? 'ماذا قالت عميلاتنا؟' : 'نحن جدد، ولن نطلب منكِ أن تثقي بنا بالكلام'}
          </h2>
          <p className="section-sub">
            {hasReviews
              ? 'آراء حقيقية وصلتنا من عميلات استلمن طلباتهن'
              : 'بدل تقييمات مصطنعة، نعطيكِ ما يحميكِ فعلاً: الدفع عند الاستلام، وضمان ٣٠ يوماً، ومكونات واضحة.'}
          </p>
        </div>

        {hasReviews && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {REAL_REVIEWS.map((r, i) => (
              <div key={i} className="card flex flex-col gap-3 border border-slate-200 bg-white">
                <p className="text-sm leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">{r.name} — {r.city}</div>
                  <div className="text-xs text-slate-400">{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROMISES.map(({ Icon, title, desc }, i) => (
            <div key={i} className="card flex flex-col gap-2 border border-slate-200 bg-white">
              <Icon size={22} className="text-blue-700" />
              <div className="font-bold text-sm text-slate-900">{title}</div>
              <p className="text-xs leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
