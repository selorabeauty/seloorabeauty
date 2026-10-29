import { ArrowDown } from 'lucide-react';

// ── EMOTIONAL + RATIONAL pain points — stretch marks deeply felt ──
const PROBLEMS = [
  { emoji: '💔', bold: 'الإحراج المستمر وتجنب المرايا:', text: 'تفضلين اللبس الواسع وتترددين قبل ارتداء أي فستان أو ملابس مفضلة بسبب خطوط التمدد على البطن أو الفخذين أو الظهر.' },
  { emoji: '😔', bold: 'خيبة الأمل من زيوت وكريمات الصيدلية:', text: 'صرفتِ مئات الريالات على بايو أويل وزبدة الكاكاو بدون أي نتيجة... لأن الزيوت العادية تقف عند سطح الجلد ولا تصل لطبقة التمزق الداخلي.' },
  { emoji: '🤰', bold: 'صدمة ما بعد الحمل أو تقلبات الوزن:', text: 'تمدد الجلد السريع مزّق شبكة الإيلاستين وترك ندبات حمراء وبيضاء تسرق ثقتكِ بجسمكِ في كل لحظة تنظرين فيها لنفسكِ.' },
  { emoji: '💸', bold: 'أسعار العيادات الخيالية بدون ضمان:', text: 'جلسات الفراكشنال ليزر تكلف من ٢٠٠٠ إلى ٥٠٠٠ ريال مع حروق مؤلمة ومخاطر تصبغات دون نتيجة مضمونة.' },
  { emoji: '⏳', bold: 'سباق الوقت مع تحول لون الخطوط:', text: 'كل أسبوع تأخير يجعل الخطوط الملونة تتصلب لتصبح ندبات بيضاء باهتة أصعب وأبطأ بكثير في الترميم.' },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 cv-auto" style={{ backgroundColor: '#0B132B' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* ── Emotional headline ── */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border" style={{ backgroundColor: '#1C2541', borderColor: '#3B82F6', color: '#93C5FD' }}>
          <span>صوت العقل والقلب أمام المرآة</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#F8FAFC' }}>
          نعرف تماماً ما تشعرين به..
        </h2>
        <p className="text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
          علامات التمدد ليست مجرد جفاف سطحي، بل هي تمزق عميق في نسيج الكولاجين يسرق ثقتكِ يومياً.. والحل الحقيقي يبدأ بالوصول لمصدر المشكلة.
        </p>

        {/* ── Real problem photo ── */}
        <div className="mb-10 rounded-3xl overflow-hidden mx-auto max-w-lg border" style={{ borderColor: '#1E293B', boxShadow: '0 16px 48px -12px rgba(0,0,0,0.6)' }}>
          <img
            src="/images/problem-belly.webp"
            alt="تشققات الحمل على البطن"
            className="w-full aspect-[4/5] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ── Problem cards ── */}
        <div className="flex flex-col gap-3.5 mb-10 text-start">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded-2xl p-4 border transition-all"
              style={{ background: '#111D3B', borderColor: '#1E293B' }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{p.emoji}</span>
              <div className="text-sm leading-relaxed">
                <strong className="block text-white font-bold mb-0.5">{p.bold}</strong>
                <span style={{ color: '#94A3B8' }}>{p.text}</span>
              </div>
            </div>
          ))}
        </div>

        <ArrowDown size={26} className="mx-auto mb-6 animate-bounce" style={{ color: '#60A5FA' }} />

        {/* ── Rational reassurance ── */}
        <div
          className="rounded-3xl p-8 border"
          style={{
            background: 'linear-gradient(135deg, rgba(30,58,138,0.25) 0%, rgba(11,19,43,0.9) 100%)',
            borderColor: 'rgba(59,130,246,0.3)',
          }}
        >
          <p className="text-lg md:text-xl leading-relaxed font-medium" style={{ color: '#F8FAFC' }}>
            أنتِ لستِ المشكلة.{' '}
            <span className="font-bold text-[#60A5FA]">
              المنتجات والزيوت السطحية التي جربتِها هي المشكلة.
            </span>
            <br />
            علاج التشققات الحقيقي يتطلب تغلغلاً مجهرياً يصل لطبقة الأدمة — طقم سيلورا الصيدلاني (ببتيدات النحاس الزرقاء + ديرما رولر التيتانيوم) صُمم خصيصاً لردم التمزق وإعادة بناء شبكة الكولاجين من المصدر.
          </p>
        </div>
      </div>
    </section>
  );
}
