'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'هل يساعد على التشققات الجسم وليس فقط الوجه؟', a: 'نعم. السيروم مصمم للاستخدام على الوجه، اليدين، وأي منطقة تحتاج ترميماً — بما فيها تشققات الجسم. تقنية الريتينال المُغلَّف تجعله آمناً وفعالاً حتى على البشرة الحساسة.' },
  { q: 'كم من الوقت يستغرق لتحسين اسمرار اليدين من القيادة؟', a: 'معظم عملاؤنا يلاحظن تحسناً في لون اليدين خلال ٣-٤ أسابيع من الاستخدام الليلي المنتظم. لأفضل النتائج: ضعيه على ظهر اليدين قبل النوم وارتدي قفازات قطنية خفيفة.' },
  { q: 'هل الريتينال مناسب للبشرة الحساسة؟', a: 'نعم. تقنية التغليف النانوي تجعل الريتينال يتحرر تدريجياً مما يقلل التهيج بشكل كبير. ننصح بالبدء باستخدامه مرة كل يومين ثم الزيادة تدريجياً.' },
  { q: 'متى أبدأ أشوف النتائج؟', a: 'في الأسبوع الأول ستلاحظين ترطيباً عميقاً ونضارة. الأسبوع الثاني يبدأ التحسن في التشققات واسمرار اليدين. التحول الكامل يظهر خلال ٤-٨ أسابيع.' },
  { q: 'كيف يتم الدفع؟', a: 'نقبل الدفع عند الاستلام فقط حالياً. لا تحتاجين لبطاقة بنكية — ادفعي للمندوب حين يصلكِ الطلب.' },
  { q: 'ما هي سياسة الاسترجاع؟', a: 'إذا لم ترَي أي نتيجة خلال ٣٠ يوماً من الاستخدام المنتظم، تواصلي معنا وسنسترد مبلغكِ كاملاً — بلا أي شروط.' },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24" style={{ backgroundColor: '#F8F2EA' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-heading">أسئلة شائعة</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border"
              style={{ background: '#fff', borderColor: '#EFE4D4' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start transition-colors"
                style={{ background: open === i ? '#F8F2EA' : 'transparent' }}
              >
                {/* Bold dark brown question */}
                <span style={{ color: '#1A0F08', fontWeight: 800, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {f.q}
                </span>
                {/* Gold chevron, properly sized for tap targets */}
                <ChevronDown
                  size={20}
                  className={cn('flex-shrink-0 transition-transform duration-200', open === i && 'rotate-180')}
                  style={{ color: '#C4943E' }}
                />
              </button>
              {open === i && (
                <div
                  className="px-6 pb-6 text-sm leading-[1.95] border-t pt-4"
                  /* High-contrast dark charcoal answer — was #3D2B1F (too close to bg) */
                  style={{ color: '#2B1E16', borderColor: '#EFE4D4', fontWeight: 500 }}
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
