'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'هل يناسب المنتج التشققات البيضاء القديمة أم الحمراء فقط؟', a: 'يعمل الطقم على النوعين بكفاءة عالية. التشققات الحديثة (الحمراء والبنفسجية) تستجيب سريعاً خلال ٢-٤ أسابيع بتفتيح لونها وتوحيد البشرة، بينما التشققات القديمة (البيضاء الغائرة) تحتاج تحفيز إبر التيتانيوم مع سيروم ببتيدات النحاس المركز لردم التمزق النسيجي واستعادة مرونة الجلد خلال ٦-٨ أسابيع.' },
  { q: 'هل استخدام الديرما رولر 0.5mm يسبب ألماً أو نزيفاً؟', a: 'إطلاقاً! مقاس 0.5mm هو المعيار الطبي العالمي المعتمد للاستخدام المنزلي الآمن. إبر التيتانيوم الدقيقة تفتح قنوات ميكروسكوبية سطحية لطيفة لتحفيز الكولاجين ومضاعفة امتصاص السيروم ٨٠٪ بدون أي جروح أو نزيف أو ألم حاد.' },
  { q: 'لماذا أحتاج السيروم والديرما رولر معاً في طقم واحد؟', a: 'لأن التمزق يقع في طبقة الأدمة العميقة تحت سطح الجلد. عند دهن السيروم لوحده، يمتص جزء سطحي منه فقط، لكن عند تمرير الديرما رولر أولاً، تفتح مسارات مباشرة تسمح لجزيئات ببتيدات النحاس الزرقاء والسيكا بالوصول الفوري لمصدر التمزق، مما يعطيكِ نتائج مضاعفة وسريعة تماثل جلسات العيادات.' },
  { q: 'هل الطقم مناسب للرجال ولتشققات النادي وبناء العضلات؟', a: 'نعم وبشدة! الطقم فعال جداً لتشققات التضخيم العضلي السريع في الكتف، البايسبس، الظهر، والأرداف. قوام السيروم مائي سريع الامتصاص يختفي في ثوانٍ دون ترك أي ملمس دهني على الجلد أو الملابس.' },
  { q: 'كيف يتم الدفع؟ وهل يمكنني فحص الطلب؟', a: 'نعم بالتأكيد! نوفر خيار الدفع عند الاستلام — افحصي طلبيتكِ وتأكدي من سلامة التغليف بيدكِ عند وصول المندوب لباب بيتكِ، ثم ادفعي براحة وثقة تامة.' },
  { q: 'ما هو الضمان الذهبي للنتيجة؟', a: 'نثق في تركيبة ببتيدات النحاس وإبر التيتانيوم؛ التزمي بالروتين لمدة ٣٠ يوماً، وإذا لم تلاحظي فرقاً ملموساً في مظهر ولون التشققات، تواصلي مع خدمة عملائنا وفلوسكِ ترجع لكِ كاملة بدون تعقيد.' },
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
