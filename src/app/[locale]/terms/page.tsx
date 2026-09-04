import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata = { title: 'شروط الاستخدام | سيلورا بيوتي' };

export default function TermsPage() {
  return (
    <PolicyLayout title="شروط الاستخدام" lastUpdated="يناير ٢٠٢٦">
      <div className="space-y-6 text-stone-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">١. القبول بالشروط</h2>
          <p>باستخدامك لموقع سيلورا بيوتي أو تقديم أي طلب، فإنك توافقين على هذه الشروط والأحكام.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٢. الطلبات والأسعار</h2>
          <p>جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة ١٥٪. نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق. تأكيد طلبك لا يعني التزامنا به إذا كان المنتج غير متاح.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٣. الدفع</h2>
          <p>نقبل الدفع عند الاستلام (كاش) فقط. ادفعي للمندوب مباشرةً عند استلام طلبك.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٤. الملكية الفكرية</h2>
          <p>جميع محتويات الموقع من نصوص وصور وتصاميم هي ملكية حصرية لسيلورا بيوتي ومحمية بحقوق الملكية الفكرية.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٥. تحديد المسؤولية</h2>
          <p>منتجاتنا مصنفة كمستحضرات تجميلية. لا نتحمل المسؤولية عن أي رد فعل تحسسي ناتج عن عدم اتباع تعليمات الاستخدام أو الحساسية الفردية لأي مكوّن.</p>
        </section>
      </div>
    </PolicyLayout>
  );
}
