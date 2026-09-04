import PolicyLayout from '@/components/layout/PolicyLayout';
import Link from 'next/link';

export const metadata = { title: 'سياسة الاسترجاع والاستبدال | سيلورا بيوتي' };

export default function ReturnsPage() {
  return (
    <PolicyLayout title="سياسة الاسترجاع والاستبدال" lastUpdated="يناير ٢٠٢٦">
      <div className="space-y-6 text-stone-600 text-sm leading-relaxed">
        {/* Guarantee highlight */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-800">
          <div className="font-black text-base mb-1">🔄 ضمان ٣٠ يوماً — بلا أسئلة</div>
          <p>إذا جربتِ منتجنا لمدة ٣٠ يوماً ولم تلاحظي أي فرق، تواصلي معنا وسنسترد مبلغكِ كاملاً.</p>
        </div>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">١. شروط الاسترجاع</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>مضى أقل من ٣٠ يوماً على استلام الطلب</li>
            <li>المنتج استُخدم بانتظام حسب التعليمات</li>
            <li>لديكِ رقم الطلب</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٢. كيفية التقديم</h2>
          <p>
            تواصلي معنا عبر{' '}
            <Link href="/ar/contact" className="text-amber-600 hover:underline font-bold">صفحة التواصل</Link>
            {' '}مع ذكر رقم طلبك وسبب الاسترجاع. سيرد فريقنا خلال ٢٤ ساعة.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٣. الحالات غير المشمولة</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>مضى أكثر من ٣٠ يوماً على الاستلام</li>
            <li>المنتج تعرض لأضرار ناتجة عن سوء الاستخدام</li>
            <li>المنتج مفتوح وُطلب استرجاعه فور الاستلام دون استخدام (نرفض الطلبات الوهمية)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٤. طريقة الاسترداد</h2>
          <p>يتم الاسترداد نقداً عند إعادة المنتج للمندوب، أو بتحويل مباشر لحسابكِ البنكي خلال ٥-٧ أيام عمل.</p>
        </section>
      </div>
    </PolicyLayout>
  );
}
