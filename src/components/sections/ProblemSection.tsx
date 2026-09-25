import { ArrowDown } from 'lucide-react';

// ── EMOTIONAL problems — stretch marks pain points ──
const PROBLEMS = [
  { emoji: '💔', text: 'تتجنبين المايوه والملابس الكاشفة بسبب تشققات جسمكِ' },
  { emoji: '🤰', text: 'تشققات الحمل ظهرت بسرعة ولم تختفِ بعد الولادة' },
  { emoji: '😔', text: 'جربتِ زيوتاً وكريمات لا تُعدّ — ولا شيء أثّر في التشققات' },
  { emoji: '⚖️', text: 'تشققات النحافة أو زيادة الوزن غيّرت شكل بشرتكِ' },
  { emoji: '🪞', text: 'تنظرين للمرآة وتتمنين لو عادت بشرتكِ لما كانت عليه' },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20" style={{ backgroundColor: '#1A0F08' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* ── Emotional headline ── */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#FDFAF6' }}>
          نعرف بالضبط كيف تشعرين..
        </h2>
        <p className="text-base mb-10" style={{ color: '#C9AF97' }}>
          تشققات الجسم — مشكلة حقيقية تؤثر على ثقتكِ كل يوم، ونحن هنا لحلّها من جذورها.
        </p>

        {/* ── Problem cards ── */}
        <div className="flex flex-col gap-3 mb-10">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 text-start transition-colors"
              style={{ background: 'rgba(253,250,246,0.04)', border: '1px solid rgba(253,250,246,0.07)' }}
            >
              <span className="text-2xl flex-shrink-0">{p.emoji}</span>
              <span className="text-base" style={{ color: '#EFE4D4' }}>{p.text}</span>
            </div>
          ))}
        </div>

        <ArrowDown size={26} className="mx-auto mb-6 animate-bounce" style={{ color: '#C4943E' }} />

        {/* ── Rational reassurance ── */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(196,148,62,0.10) 0%, rgba(42,28,18,0.8) 100%)',
            border: '1px solid rgba(196,148,62,0.18)',
          }}
        >
          <p className="text-lg md:text-xl leading-relaxed font-medium" style={{ color: '#FDFAF6' }}>
            أنتِ لستِ المشكلة.{' '}
            <span className="font-bold" style={{ color: '#D4A96A' }}>
              المنتجات العادية التي جربتِها هي المشكلة.
            </span>
            <br />
            علاج التشققات يتطلب علماً حقيقياً وتغلغلاً خلوياً عميقاً يصل لتمزقات الأنسجة — ثلاثية سيلورا (شيا، أرجان، لوز) هي العلم في صفكِ لاستعادة بشرتكِ.
          </p>
        </div>
      </div>
    </section>
  );
}
