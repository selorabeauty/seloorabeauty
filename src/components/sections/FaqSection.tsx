'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'عندي تشققات قديمة بيضاء.. هل لا يزال الأمل موجوداً؟', a: 'نفهم هذا السؤال جيداً. التشققات القديمة أبطأ استجابة من الحديثة، لكن العناية المنتظمة تظل خطوة تستحقينها. التزمي ٨-١٢ أسبوعاً وصوّري المنطقة كل أسبوعين لتري تقدمكِ بنفسكِ. النتائج تختلف من بشرة لأخرى.' },
  { q: 'هل الديرما رولر 0.5mm مؤلم؟', a: 'مقاس 0.5mm مخصص للاستخدام المنزلي اللطيف، ومعظم المستخدمات يصفنه بإحساس خفيف. مرريه دون ضغط قوي مرة إلى مرتين أسبوعياً، وعقّميه قبل وبعد كل استخدام، ولا تستخدميه على جلد متهيج أو جروح.' },
  { q: 'لماذا روتين من خطوتين؟', a: 'الرولر يهيّئ سطح البشرة، والسيروم ببتيدات النحاس والسيكا والهيالورونيك يعتني بها يومياً. الخطوتان تكمّلان بعضهما، وكل واحدة تُشترى منفردة إن أحببتِ.' },
  { q: 'هل يناسب الرجال أيضاً؟', a: 'نعم، يستخدمه كثيرون للعناية بمظهر تشققات الكتف والذراع والظهر بعد الرياضة أو تغيّر الوزن، بالروتين نفسه.' },
  { q: 'كيف أدفع؟ وهل أستطيع فحص الطلب؟', a: 'الدفع عند الاستلام. افحصي طلبكِ وتأكدي من سلامة التغليف عند وصول المندوب ثم ادفعي، فلا مخاطرة عليكِ.' },
  { q: 'ماذا لو لم أرتح للتجربة؟', a: 'لكِ ضمان استرجاع ٣٠ يوماً. تواصلي معنا وراجعي صفحة الإرجاع لمعرفة الشروط، ولن نتركِ بلا حل.' },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 cv-auto" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="badge-clinical mb-3">❓ إجابات شفافة ومباشرة</span>
          <h2 className="section-heading">الأسئلة الشائعة والضمان</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border transition-all"
              style={{ background: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start transition-colors"
                style={{ background: open === i ? '#EFF6FF' : 'transparent' }}
              >
                <span className="font-extrabold text-base leading-snug text-slate-900">
                  {f.q}
                </span>
                <ChevronDown
                  size={20}
                  className={cn('flex-shrink-0 transition-transform duration-200 text-blue-600', open === i && 'rotate-180')}
                />
              </button>
              {open === i && (
                <div
                  className="px-6 pb-6 text-sm leading-[1.95] border-t pt-4 text-slate-700 border-slate-100 font-medium"
                >
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
