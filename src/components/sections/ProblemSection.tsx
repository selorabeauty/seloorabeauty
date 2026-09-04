import { X, ArrowDown } from 'lucide-react';

const PROBLEMS = [
  'تشققات لا تختفي رغم كل كريم جربتِه',
  'يدانِ تُخبران عمرك قبل وجهك — اسمرار وتجاعيد من القيادة اليومية',
  'بشرة متعبة، باهتة، بلا إشراق رغم كل ما تنفقينه',
  'بقع داكنة وتفاوت في اللون لا يستجيب للعلاج',
  'جربتِ كل شيء — ولا منتج أعطاكِ نتيجة حقيقية',
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20" style={{ backgroundColor: '#1A0F08' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#FDFAF6' }}>
          هل تشعرين بهذا؟
        </h2>
        <p className="text-base mb-10" style={{ color: '#8C7B6E' }}>
          إذا كنتِ تعانين من واحدة أو أكثر، فأنتِ لستِ وحدكِ — وهذا ليس ذنبكِ.
        </p>

        <div className="flex flex-col gap-3 mb-10">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 text-start transition-colors"
              style={{ background: 'rgba(253,250,246,0.04)', border: '1px solid rgba(253,250,246,0.07)' }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(192,57,43,0.15)' }}
              >
                <X size={14} style={{ color: '#e07060' }} />
              </div>
              <span className="text-base" style={{ color: '#EFE4D4' }}>{p}</span>
            </div>
          ))}
        </div>

        <ArrowDown size={26} className="mx-auto mb-6 animate-bounce" style={{ color: '#C4943E' }} />

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
              المنتجات التي جربتِها هي المشكلة.
            </span>
            <br />
            البشرة الجميلة تحتاج علماً حقيقياً — وهذا بالضبط ما صنعناه.
          </p>
        </div>
      </div>
    </section>
  );
}
