import { ArrowDown } from 'lucide-react';

// ── EMOTIONAL + RATIONAL pain points — stretch marks deeply felt ──
const PROBLEMS = [
  { emoji: '💔', bold: 'الإحراج المستمر وتجنب المرايا:', text: 'تفضّل اللبس الواسع وتتردد قبل ارتداء أي قطعة مفضلة بسبب خطوط التمدد على البطن أو الفخذين أو الظهر أو الأكتاف.' },
  { emoji: '😔', bold: 'خيبة الأمل من زيوت وكريمات الصيدلية:', text: 'صرفت مئات الريالات على بايو أويل وزبدة الكاكاو بدون أي نتيجة... لأن الزيوت العادية تقف عند سطح الجلد ولا تصل لطبقة التمزق الداخلي.' },
  { emoji: '🤰', bold: 'صدمة ما بعد الحمل أو تضخيم العضلات:', text: 'تمدد الجلد السريع — سواء بالحمل أو ببناء العضل في النادي — مزّق شبكة الإيلاستين وترك ندبات حمراء وبيضاء تسرق ثقتك بجسمك.' },
  { emoji: '💸', bold: 'أسعار العيادات الخيالية بدون ضمان:', text: 'جلسات الفراكشنال ليزر تكلف من ٢٠٠٠ إلى ٥٠٠٠ ريال مع حروق مؤلمة ومخاطر تصبغات دون نتيجة مضمونة.' },
  { emoji: '⏳', bold: 'سباق الوقت مع تحول لون الخطوط:', text: 'كل أسبوع تأخير يجعل الخطوط الملونة تتصلب لتصبح ندبات بيضاء باهتة أصعب وأبطأ بكثير في الترميم.' },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 cv-auto" style={{ backgroundColor: '#1A0F08' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* ── Emotional headline ── */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border" style={{ backgroundColor: '#3D2B1F', borderColor: '#D4A96A', color: '#E8C98F' }}>
          <span>صوت العقل والقلب أمام المرآة</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: '#FBF7F1' }}>
          نعرف تماماً ما تشعر به..
        </h2>
        <p className="text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#B0998A' }}>
          علامات التمدد ليست مجرد جفاف سطحي، بل هي تمزق عميق في نسيج الكولاجين يسرق ثقتك يومياً — سواء بعد الحمل والولادة، أو بعد شهور التعب في الجيم وبناء العضلات.
        </p>

        {/* ── Real problem photos — women & men ── */}
        <div className="grid grid-cols-2 gap-4 mb-10 mx-auto max-w-2xl">
          <figure className="rounded-3xl overflow-hidden border relative" style={{ borderColor: '#3D2B1F', boxShadow: '0 16px 48px -12px rgba(0,0,0,0.6)' }}>
            <img
              src="/images/problem-postpartum.webp"
              alt="تشققات البطن بعد الحمل وتقلبات الوزن"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute bottom-0 inset-x-0 text-xs font-bold py-2 px-3 text-center" style={{ background: 'linear-gradient(to top, rgba(11,19,43,0.9), transparent)', color: '#EBD9B4' }}>
              بعد الحمل وتقلبات الوزن
            </figcaption>
          </figure>
          <figure className="rounded-3xl overflow-hidden border relative" style={{ borderColor: '#3D2B1F', boxShadow: '0 16px 48px -12px rgba(0,0,0,0.6)' }}>
            <img
              src="/images/problem-gym.webp"
              alt="تشققات الذراع والكتف بعد تضخيم العضلات في الجيم"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute bottom-0 inset-x-0 text-xs font-bold py-2 px-3 text-center" style={{ background: 'linear-gradient(to top, rgba(11,19,43,0.9), transparent)', color: '#EBD9B4' }}>
              بعد التضخيم والجيم
            </figcaption>
          </figure>
        </div>

        {/* ── Problem cards ── */}
        <div className="flex flex-col gap-3.5 mb-10 text-start">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded-2xl p-4 border transition-all"
              style={{ background: '#2A1C12', borderColor: '#3D2B1F' }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{p.emoji}</span>
              <div className="text-sm leading-relaxed">
                <strong className="block text-white font-bold mb-0.5">{p.bold}</strong>
                <span style={{ color: '#B0998A' }}>{p.text}</span>
              </div>
            </div>
          ))}
        </div>

        <ArrowDown size={26} className="mx-auto mb-6 animate-bounce" style={{ color: '#D4A96A' }} />

        {/* ── Rational reassurance ── */}
        <div
          className="rounded-3xl p-8 border"
          style={{
            background: 'linear-gradient(135deg, rgba(30,58,138,0.25) 0%, rgba(11,19,43,0.9) 100%)',
            borderColor: 'rgba(59,130,246,0.3)',
          }}
        >
          <p className="text-lg md:text-xl leading-relaxed font-medium" style={{ color: '#FBF7F1' }}>
            أنت لست المشكلة.{' '}
            <span className="font-bold text-[#D4A96A]">
              المنتجات والزيوت السطحية التي جربتها هي المشكلة.
            </span>
            <br />
            علاج التشققات الحقيقي يتطلب تغلغلاً مجهرياً يصل لطبقة الأدمة — طقم سيلورا (ببتيدات النحاس الزرقاء + ديرما رولر التيتانيوم) صُمم خصيصاً لردم التمزق وإعادة بناء شبكة الكولاجين من المصدر — للرجال والنساء على حد سواء.
          </p>
        </div>
      </div>
    </section>
  );
}
