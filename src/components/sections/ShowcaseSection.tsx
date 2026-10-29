import { SHOWCASE } from '@/lib/images';
import Photo from '@/components/ui/Photo';

export default function ShowcaseSection({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <div className="mb-14">
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">كيف قد يبدو الفرق؟ للنساء والرجال</h3>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
          تشققات الجسم تظهر على البطن والفخذ والكتف والذراع، عند الجميع. هذه تصورات توضيحية لنوع التحسن في مظهر الجلد الذي يتطلع إليه كثيرون مع الالتزام بالروتين.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SHOWCASE.map((item) => (
          <figure key={item.src} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[1200/670] bg-slate-100">
              <Photo src={item.src} alt={item.alt} label={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 start-2 text-[11px] font-bold bg-white/90 text-slate-700 rounded-full px-2 py-0.5">قبل</span>
              <span className="absolute top-2 end-2 text-[11px] font-bold bg-white/90 text-slate-700 rounded-full px-2 py-0.5">بعد</span>
            </div>
            <figcaption className="px-4 py-3 text-sm font-bold text-slate-800 text-center">{item.title}</figcaption>
          </figure>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
        صور توضيحية للتصور فقط، وليست صور عملاء حقيقيين. تختلف النتائج من شخص لآخر ولا نضمن نتيجة محددة. تحتاج التشققات القديمة صبراً والتزاماً أطول.
      </p>
    </div>
  );

  if (embedded) return content;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}
