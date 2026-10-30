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
import AssetPlaceholder from '@/components/ui/AssetPlaceholder';
import { Gift } from 'lucide-react';

export const metadata = {
  title: 'سيلورا بيوتي | طقم العناية بالتشققات — سيروم ببتيدات النحاس + ديرما رولر هدية',
  description: 'طقم سيلورا بيوتي للعناية بتشققات الجسم — سيروم ببتيدات النحاس الزرقاء (GHK-Cu) 100ml مع ديرما رولر التيتانيوم هدية مجانية، بسعر 199 ر.س بدلاً من 279. دفع عند الاستلام وضمان استرجاع ٣٠ يوماً.',
};

export default function HomePage() {
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

        {/* ── What's inside the bundle ── */}
        <section className="py-24 cv-auto" style={{ background: '#FDFAF6' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="section-heading">داخل كل طقم سيلورا</h2>
              <p className="section-sub">
                عبوة سيروم كاملة + ديرما رولر التيتانيوم هدية — كل ما تحتاجينه في صندوق واحد بسعر 199 ر.س
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Serum — the paid hero */}
              <div className="product-card p-5">
                <div className="rounded-2xl overflow-hidden mb-4">
                  {/* TODO(asset): serum close-up — replace with the real photo described below */}
                  <AssetPlaceholder
                    label="Serum Close-Up"
                    note="لقطة قريبة لعبوة السيروم الزرقاء 100ml فقط على خلفية بيج فاتحة مع قطرات سيروم/لمعة زجاجية خفيفة — تبين لون الببتيدات الأزرق الحقيقي. أفقية 4:3 بدون نص."
                    ratio="aspect-[4/3]"
                  />
                </div>
                <div className="font-extrabold text-lg" style={{ color: '#1A0F08' }}>
                  سيروم ببتيدات النحاس الزرقاء 100ml
                </div>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: '#6E5C50' }}>
                  بملمس حريري خفيف وسريع الامتصاص — العنصر الأساسي في طقمكِ.
                </p>
              </div>

              {/* Roller — the free gift */}
              <div className="product-card p-5 relative">
                <span
                  className="absolute top-4 start-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black text-white shadow"
                  style={{ background: 'linear-gradient(135deg, #C4943E, #A87830)' }}
                >
                  <Gift size={12} /> هدية مجانية
                </span>
                <div className="rounded-2xl overflow-hidden mb-4">
                  {/* TODO(asset): gift shot — replace with the real photo described below */}
                  <AssetPlaceholder
                    label="Free Gift Shot"
                    note="صورة ديرما رولر التيتانيوم داخل كبسولتها أو بجوار شريط هدية/فيونكة ذهبية صغيرة — توصّل إحساس «هدية» فوراً. أفقية 4:3، نفس خلفية صورة السيروم للتناسق."
                    ratio="aspect-[4/3]"
                  />
                </div>
                <div className="font-extrabold text-lg" style={{ color: '#1A0F08' }}>
                  ديرما رولر التيتانيوم 0.5mm
                </div>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: '#6E5C50' }}>
                  ٥٤٠ إبرة دقيقة — تضاف مجاناً لكل طلب لتحصلي على أفضل امتصاص للسيروم.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Conversion asset slots ──
            Placeholders for the creative team: swap each block for the real
            asset described inside it. They are intentionally visible. */}
        <section className="py-16 bg-white cv-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <AssetPlaceholder
                label="Social Proof"
                note="فيديو UGC قصير (١٥-٣٠ ث) لعميلة حقيقية تفتح الطقم وتتحدث عن تجربتها — يصوَّر بالجوال بإضاءة طبيعية."
              />
              <AssetPlaceholder
                label="Before / After"
                note="صورة قبل وبعد حقيقية (٤-٦ أسابيع استخدام) لمنطقة تشققات واضحة — نفس الزاوية والإضاءة."
              />
              <AssetPlaceholder
                label="COD Delivery"
                note="صورة/جرافيك للطرد الفاخر أثناء استلامه من المندوب مع شارة «الدفع عند الاستلام — افحصي أولاً»."
              />
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
