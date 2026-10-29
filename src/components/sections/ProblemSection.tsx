import { ArrowDown } from 'lucide-react';

// ── EMOTIONAL + RATIONAL pain points — stretch marks deeply felt ──
const PROBLEMS = [
  { emoji: '💔', bold: 'تتجنبين المرآة:', text: 'تلمح بطنك أو فخذيك فتشعر بانقباض صغير، ثم تسحب القميص وتكمل يومك كأن شيئاً لم يكن.' },
  { emoji: '👗', bold: 'تتخلى عن ما تحب:', text: 'قميص المناسبة، ملابس السباحة، لبس البيت أمام الأهل. تختار الأوسع والأغمق حتى لا يلاحظ أحد.' },
  { emoji: '🤰', bold: 'جسمك فعل شيئاً عظيماً:', text: 'حمل، ولادة، رضاعة، أو تغيّر وزن. الجلد تمدّد ليحتضن حياتك، والتشققات أثر ذلك، ولا تعني أنك قصّرت في العناية.' },
  { emoji: '😔', bold: 'جرّبت ولم ترتاح:', text: 'كريمات وزيوت كثيرة وأمل يتجدد ثم يخيب. التعب من التجربة يجعل كل منتج جديد يبدو كوعد آخر لا يتحقق.' },
  { emoji: '⏳', bold: 'وتسأل نفسك: هل فات الأوان؟', text: 'الخطوط القديمة تحتاج صبراً وروتيناً منتظماً أكثر من الجديدة، لكن العناية المنتظمة تظل أفضل من الانتظار.' },
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
          نعرف تماماً ما تشعر به..
        </h2>
        <p className="text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
          لسنا هنا لنقول لك إن جسمك مشكلة. نحن هنا لأن كثيرين، رجالاً ونساءً، يشاركوننا الشعور نفسه أمام المرآة، ولأنك تستحق روتين عناية تثق به.
        </p>

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
            أنت لست المشكلة.{' '}
            <span className="font-bold text-[#60A5FA]">
              التشققات جزء من قصتك، ومن حقك أن تعتني بها.
            </span>
            <br />
            لن نعدك بنتيجة سحرية أو بتاريخ محدد. نعدك بروتين بسيط (سيروم ببتيدات النحاس + السيكا وديرما رولر 0.5mm)، وبمتابعة صادقة، وبأن تدفع عند الاستلام وتجرّب بضمان ٣٠ يوماً. النتائج تختلف من بشرة لأخرى، والاستمرار هو السر.
          </p>
        </div>
      </div>
    </section>
  );
}
