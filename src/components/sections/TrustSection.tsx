import { FlaskConical, Leaf, Truck, RotateCcw, Banknote, Headphones, ShieldCheck, Star } from 'lucide-react';

const TRUST = [
  { Icon: ShieldCheck,  title: 'معتمد من هيئة الغذاء والدواء', desc: 'تركيبة آمنة ومسجلة رسمياً لدى SFDA لضمان أعلى مستويات الأمان والجودة.' },
  { Icon: FlaskConical, title: 'مطابق لمعايير ISO العالمية',   desc: 'صُنع في منشآت مطابقة لمعايير ISO 22716 لضمان دقة التركيب والتعقيم.' },
  { Icon: Star,         title: 'نتائج سريرية موثقة',          desc: 'دراسات سريرية أثبتت تحسناً بنسبة 87% في مظهر التشققات و94% في المرونة.' },
  { Icon: Leaf,         title: 'تركيبة نقية ولطيفة على البشرة', desc: 'ببتيدات النحاس الزرقاء وخلاصة السيكا وخلايا النمو — خالية من الكحول والبارابين والمواد المهيجة.' },
  { Icon: RotateCcw,    title: 'ضمان ذهبي ٣٠ يوماً على النتيجة', desc: 'نثق في تقنيتنا؛ إذا لم تلحظي تحسناً حقيقياً في عمق ولون التشققات خلال 30 يوماً، نسترد مبلغكِ كاملاً.' },
  { Icon: Banknote,     title: 'فحص الشحنة قبل الدفع عند الاستلام', desc: 'افحصي طلبيتكِ وتأكدي من سلامة التغليف عند وصول المندوب لباب بيتكِ ثم ادفعي براحة تامة.' },
];

export default function TrustSection() {
  return (
    <section className="py-24 cv-auto" style={{ backgroundColor: '#FBF7F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge-clinical mb-3">🛡️ أعلى معايير الأمان والمصداقية</span>
          <h2 className="section-heading">لماذا يثق الآلاف بسيلورا بيوتي؟</h2>
          <p className="section-sub">التزام صارم بمعايير الجودة لضمان نتائج حقيقية وأمان تام لك ولعائلتكِ</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-3xl border transition-all hover:shadow-lg hover:border-amber-300"
              style={{ background: '#FFFFFF', borderColor: '#EFE4D4', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #8A611E 0%, #8A611E 100%)' }}
              >
                <Icon size={20} className="text-amber-200" />
              </div>
              <div>
                <div className="mb-1 text-stone-900 font-extrabold text-base">{title}</div>
                <div className="text-sm leading-relaxed text-stone-600">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
