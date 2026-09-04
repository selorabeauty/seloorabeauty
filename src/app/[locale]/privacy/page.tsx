import PolicyLayout from '@/components/layout/PolicyLayout';

export const metadata = { title: 'سياسة الخصوصية | سيلورا بيوتي' };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="سياسة الخصوصية" lastUpdated="يناير ٢٠٢٦">
      <div className="space-y-6 text-stone-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">١. المعلومات التي نجمعها</h2>
          <p>عند تقديم طلبك، نجمع الاسم ورقم الجوال فقط — وذلك لغرض التوصيل والتواصل معكِ بخصوص طلبك. لا نجمع بيانات بطاقات ائتمانية أو بيانات مالية من أي نوع.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٢. كيف نستخدم معلوماتك</h2>
          <p>تُستخدم بياناتك حصراً لـ: تأكيد الطلب وتنسيق التوصيل، والتواصل معكِ في حال وجود أي مشكلة في طلبك. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تسويقية.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٣. الكوكيز</h2>
          <p>يستخدم موقعنا ملفات تعريف الارتباط (cookies) لحفظ محتويات سلة التسوق وتحسين تجربة التصفح. يمكنكِ تعطيلها من إعدادات المتصفح.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٤. حقوقك</h2>
          <p>يحق لكِ في أي وقت طلب حذف بياناتك الشخصية. تواصلي معنا عبر صفحة التواصل وسنحذف بياناتك خلال ٧ أيام عمل.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-stone-900 mb-2">٥. التواصل</h2>
          <p>لأي استفسار حول خصوصيتك: hello@selorabeauty.com</p>
        </section>
      </div>
    </PolicyLayout>
  );
}
