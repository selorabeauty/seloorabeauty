import { FlaskConical, Leaf, Truck, RotateCcw, Banknote, Headphones } from 'lucide-react';

const TRUST = [
  { Icon: FlaskConical, title: 'مكونات مُختبرة علمياً',  desc: 'كل مكوّن اخترناه بناءً على أبحاث محكّمة — لا تسويق فارغ ولا وعود بلا دليل.' },
  { Icon: Leaf,         title: 'آمن للبشرة الحساسة',     desc: 'خالٍ من العطور القسرية والمواد الضارة — مناسب حتى لبشرة ما بعد الحمل.' },
  { Icon: Truck,        title: 'شحن سريع ١‑٣ أيام',      desc: 'نوصلكِ داخل المملكة بتغليف فاخر يستحق أن يُهدى.' },
  { Icon: RotateCcw,    title: 'ضمان استرداد ٣٠ يوماً',  desc: 'إذا لم ترَي نتيجة خلال ٣٠ يوماً، نسترد مبلغكِ كاملاً — بلا أسئلة.' },
  { Icon: Banknote,     title: 'دفع عند الاستلام',        desc: 'ادفعي فقط حين تستلمين — لأن ثقتكِ تهمنا أكثر من أي شيء.' },
  { Icon: Headphones,   title: 'دعم عملاء ٧ أيام',        desc: 'فريقنا متاح لأي استفسار عبر البريد الإلكتروني أو نموذج التواصل.' },
];

export default function TrustSection() {
  return (
    <section className="py-24" style={{ backgroundColor: '#fff' }}>
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
