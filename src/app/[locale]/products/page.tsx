import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import { PRODUCTS } from '@/lib/products';

export const metadata = {
  title: 'المنتجات | سيلورا بيوتي',
  description: 'اكتشفي طقم سيلورا الكامل لعلاج تشققات الجسم — سيروم وكريم بزيت اللوز والأرجان. الدفع عند الاستلام.',
};

export default function CollectionPage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-heading mb-3">روتين علاج التشققات</h1>
            <p className="section-sub">
              سيروم + كريم بزيت اللوز والأرجان — روتين خطوتين مدروس لنتيجة حقيقية
            </p>
            <div className="flex items-center justify-center gap-6 mt-5 text-sm font-bold text-stone-500">
              <span>✅ دفع عند الاستلام</span>
              <span>🚚 شحن ١-٣ أيام</span>
              <span>🔄 ضمان ٣٠ يوم</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} locale={params.locale} />
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-16 bg-stone-900 text-white rounded-3xl px-8 py-7 text-center">
            <p className="text-lg font-bold text-amber-300 mb-2">لماذا سيلورا؟</p>
            <p className="text-stone-300 leading-relaxed max-w-xl mx-auto">
              كل منتجاتنا تُصنَّع بمعايير ISO 22716 وتمر بفحص دقيق قبل الشحن.
              نؤمن بالنتيجة — لذلك نضمنها.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <CheckoutPopup />
    </>
  );
}
