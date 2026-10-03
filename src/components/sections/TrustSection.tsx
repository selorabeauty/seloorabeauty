import { FlaskConical, Leaf, Truck, RotateCcw, Banknote, Headphones, ShieldCheck, Star } from 'lucide-react';

const TRUST = [
  { Icon: ShieldCheck,  title: 'معتمد من هيئة الغذاء والدواء', desc: 'تركيبة آمنة ومسجلة رسمياً لدى SFDA لضمان أعلى مستويات الأمان والجودة.' },
  { Icon: FlaskConical, title: 'مطابق لمعايير ISO العالمية',   desc: 'صُنع في منشآت مطابقة لمعايير ISO 22716 لضمان دقة التركيب والتعقيم.' },
  { Icon: Star,         title: 'نتائج سريرية موثقة',          desc: 'دراسات سريرية أثبتت تحسناً بنسبة 87% في مظهر التشققات و94% في المرونة.' },
  { Icon: Leaf,         title: 'آمن خلال الحمل والرضاعة',  desc: 'ثلاثية الشيا والأرجان واللوز طبيعية 100% — خالية من المواد الكيميائية الضارة.' },
  { Icon: RotateCcw,    title: 'ضمان استرداد ٣٠ يوماً',    desc: 'نثق في نتائجنا؛ إذا لم ترَي فرقاً واضحاً خلال 30 يوماً، نسترد مبلغكِ كاملاً.' },
  { Icon: Banknote,     title: 'دفع عند الاستلام',         desc: 'ادفعي فقط حين يصلكِ المنتج لباب البيت — ثقتكِ هي رأس مالنا.' },
];

export default function TrustSection() {
  return (
    <section className="py-24 cv-auto" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="section-heading">لماذا سيلورا؟</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-2xl border transition-all hover:shadow-luxury hover:border-gold-400"
              style={{ background: '#F8F2EA', borderColor: '#EFE4D4' }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#1A0F08' }}
              >
                <Icon size={18} style={{ color: '#D4A96A' }} />
              </div>
              <div>
                <div className="mb-1" style={{ color: '#1A0F08', fontWeight: 800, fontSize: '0.95rem' }}>{title}</div>
                {/* Darkened from #5A4A3F → #2B1E16 */}
                <div className="text-sm leading-relaxed" style={{ color: '#2B1E16' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
