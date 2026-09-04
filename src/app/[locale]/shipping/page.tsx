import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata = { title: 'سياسة الشحن والتوصيل | سيلورا بيوتي' };

export default function ShippingPage() {
  return (
    <PolicyLayout title="سياسة الشحن والتوصيل" lastUpdated="يناير ٢٠٢٦">
      <div className="space-y-6 text-stone-600 text-sm leading-relaxed">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800">
          <div className="font-black text-base mb-1">🚚 شحن سريع ١-٣ أيام داخل المملكة</div>
          <p>نشحن لجميع مناطق المملكة العربية السعودية عبر شركاء الشحن المعتمدين.</p>
        </div>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-3">مناطق التوصيل والمدة</h2>
          <div className="overflow-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-start p-3 font-black text-stone-700 rounded-s-xl">المنطقة</th>
                  <th className="text-start p-3 font-black text-stone-700">مدة التوصيل</th>
                  <th className="text-start p-3 font-black text-stone-700 rounded-e-xl">رسوم الشحن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ['الرياض وضواحيها', '١-٢ أيام عمل', 'مجاني'],
                  ['جدة والمدينة المنورة', '١-٢ أيام عمل', 'مجاني'],
                  ['الدمام والخبر والقطيف', '١-٢ أيام عمل', 'مجاني'],
                  ['مكة المكرمة', '١-٢ أيام عمل', 'مجاني'],
                  ['باقي مناطق المملكة', '٢-٤ أيام عمل', 'مجاني'],
                ].map(([area, time, cost], i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="p-3">{area}</td>
                    <td className="p-3">{time}</td>
                    <td className="p-3 font-bold text-emerald-600">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-400 mt-2">* رسوم الدفع عند الاستلام ٢٠ ر.س تضاف عند الاختيار</p>
        </section>

        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">ملاحظات مهمة</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>يُعالَج الطلب خلال ٢٤ ساعة من وقت التأكيد</li>
            <li>ستصلكِ رسالة تأكيد عند شحن طلبك</li>
            <li>سيتصل المندوب قبل التوصيل للتنسيق</li>
            <li>في حالة الغياب، يُعاد التوصيل مرة أخرى مجاناً</li>
          </ul>
        </section>
      </div>
    </PolicyLayout>
  );
}
