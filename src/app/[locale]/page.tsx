import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProblemSection from '@/components/sections/ProblemSection';
import ScienceSection from '@/components/sections/ScienceSection';
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
  title: 'سيلورا بيوتي | سيروم الريتينال المجدد للبشرة',
  description: 'سيروم الريتينال المتقدم من سيلورا — يقلص المسام، يوحد البشرة، ويمحو علامات التقدم في السن. دفع عند الاستلام. شحن سريع داخل المملكة.',
};

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ScienceSection />
        <IngredientsSection />
        <ResultsSection />
        <ReviewsSection />
        <TrustSection />

        {/* Featured products section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="section-heading">اكتشفي مجموعتنا</h2>
              <p className="section-sub">كل سيروم صُمم لنتيجة واحدة محددة — اختاري ما يناسب بشرتك</p>
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
