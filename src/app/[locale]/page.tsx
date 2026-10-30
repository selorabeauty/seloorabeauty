import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import IngredientsSection from '@/components/sections/IngredientsSection';
import ResultsSection from '@/components/sections/ResultsSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import TrustSection from '@/components/sections/TrustSection';
import FaqSection from '@/components/sections/FaqSection';
import StickyBuyBar from '@/components/ui/StickyBuyBar';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { PRODUCTS } from '@/lib/products';

export const metadata = {
  title: 'Selora Beauty | طقم Daranca للعناية بالبشرة',
  description: 'سيروم Daranca بببتيدات النحاس 30ml وديرما رولر تيتانيوم 0.5mm. الطقم 249 ر.س والدفع عند الاستلام.',
};

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <IngredientsSection />
        <ResultsSection />
        <ReviewsSection />
        <TrustSection />

        {/* Featured products section */}
        <section className="py-24 bg-white cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="section-heading">اكتشف عناصر الطقم</h2>
              <p className="section-sub">سيروم Daranca بببتيدات النحاس وديرما رولر للعناية بالبشرة.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} locale={params.locale} />
              ))}
            </div>
          </div>
        </section>

        <FaqSection />
      </main>
      <Footer />
      <StickyBuyBar />
      <CheckoutPopup />
    </>
  );
}
