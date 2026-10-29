import { FlaskConical, Leaf, Truck, RotateCcw, Banknote, Headphones, ShieldCheck, Star } from 'lucide-react';

const TRUST = [
  { Icon: ShieldCheck,  title: 'مكونات معلنة بشفافية',       desc: 'قائمة المكونات كاملة على الصفحة وعلى العبوة: ببتيدات النحاس، سيكا، هيالورونيك، نياسيناميد.' },
  { Icon: FlaskConical, title: 'توقعات واقعية',                desc: 'النتائج تختلف من بشرة لأخرى، والتشققات القديمة تحتاج التزاماً ٨-١٢ أسبوعاً.' },
  { Icon: Star,         title: 'فحص قبل الشحن',                desc: 'كل طلب يُفحص قبل تسليمه لشركة الشحن.' },
  { Icon: Leaf,         title: 'سيروم خفيف غير لزج', desc: 'ببتيدات النحاس مع خلاصة السيكا في قوام مائي سريع الامتصاص، مناسب للاستخدام اليومي.' },
  { Icon: RotateCcw,    title: 'ضمان ذهبي ٣٠ يوماً على النتيجة', desc: 'نثق في تقنيتنا؛ إذا لم تكن راضياً عن التجربة خلال 30 يوماً (راجع شروط الإرجاع)، نسترد مبلغك كاملاً.' },
  { Icon: Banknote,     title: 'فحص الشحنة قبل الدفع عند الاستلام', desc: 'افحص طلبيتك وتأكد من سلامة التغليف عند وصول المندوب لباب بيتك ثم ادفع براحة تامة.' },
];

export default function TrustSection() {
  return (
    <section className="py-24 cv-auto" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge-clinical mb-3">🛡️ الشفافية أولاً</span>
          <h2 className="section-heading">لماذا سيلورا؟</h2>
          <p className="section-sub">شفافية في المكونات، وتوقعات صادقة، وضمان ٣٠ يوماً</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-3xl border transition-all hover:shadow-lg hover:border-blue-300"
              style={{ background: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F2C59 100%)' }}
              >
                <Icon size={20} className="text-blue-200" />
              </div>
              <div>
                <div className="mb-1 text-slate-900 font-extrabold text-base">{title}</div>
                <div className="text-sm leading-relaxed text-slate-600">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
