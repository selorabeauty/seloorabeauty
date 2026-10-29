'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'هل يناسب المنتج تشققات الحمل الحديثة أم القديمة فقط؟', a: 'يعمل الطقم على النوعين. التشققات الحديثة (الحمراء والبنفسجية) تستجيب بشكل أسرع خلال ٢-٤ أسابيع، بينما التشققات القديمة (البيضاء) تحتاج استخداماً منتظماً لمدة ٨-١٢ أسبوعاً لنتائج ملحوظة.' },
  { q: 'هل يمكن استخدامه أثناء الحمل والرضاعة؟', a: 'نعم. تركيبتنا من زيت اللوز الحلو والأرجان المغربي آمنة تماماً خلال الحمل والرضاعة — خالية من أي مواد ضارة أو عطور قسرية.' },
  { q: 'ما الفرق بين السيروم والكريم — هل أحتاجهما معاً؟', a: 'السيروم خفيف ويتغلغل بسرعة لتحضير الأنسجة العميقة، بينما الكريم كثيف ويغلق الرطوبة ويبني المرونة. نُنصح دائماً باستخدامهما معاً لمضاعفة النتيجة — لهذا الطقم الكامل هو الأكثر مبيعاً.' },
  { q: 'متى أبدأ أشوف النتائج؟', a: 'في الأسبوع الأول ستلاحظين ترطيباً عميقاً ونعومة فورية. الأسبوع الثاني يبدأ تفتيح لون التشققات. التحول الكامل يظهر خلال ٤-٨ أسابيع من الاستخدام المنتظم صباحاً ومساءً.' },
  { q: 'كيف يتم الدفع؟', a: 'نقبل الدفع عند الاستلام، أو التقسيط بدون فوائد مع Tabby وTamara، أو الدفع الفوري عبر Apple Pay ومدى — اختاري ما يناسبكِ عند إتمام الطلب.' },
  { q: 'ما هي سياسة الاسترجاع؟', a: 'إذا لم ترَي أي نتيجة خلال ٣٠ يوماً من الاستخدام المنتظم، تواصلي معنا وسنسترد مبلغكِ كاملاً — بلا أي شروط.' },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 cv-auto" style={{ backgroundColor: '#F8F2EA' }}>
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
