'use client';

import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';
import { trackAddToCart } from '@/lib/pixels';

const kit = SET_OPTIONS.find((set) => set.id === 'set-complete')!;

export default function Hero() {
  const { setMainSet, openCheckout } = useCartStore();
  const order = () => {
    trackAddToCart({ id: kit.id, sku: kit.sku, name: kit.label, price: kit.totalPrice });
    setMainSet({
      id: kit.id, name: kit.label, price: kit.totalPrice, originalPrice: kit.originalTotal,
      imageBg: 'from-blue-900 to-slate-950',
      includes: ['سيروم ببتيدات النحاس 30ml', 'ديرما رولر 0.5mm'], sku: kit.sku,
    });
    openCheckout();
  };

  return (
    <section className="bg-gradient-to-br from-[#081934] via-[#102e58] to-[#1d4370] text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-block text-amber-300 text-sm font-bold tracking-wide">SELORA BEAUTY · العناية ببشرة الجسم</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Micro-Repair Clinical Protocol for Deep Stretch Marks &amp; Skin Textures.
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            روتين للعناية بمظهر البشرة للجميع: سيروم ببتيدات النحاس الأزرق 30ml وديرما رولر تيتانيوم 0.5mm.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-blue-100">
            <span className="rounded-full border border-blue-300/30 px-4 py-2">30ml سيروم</span>
            <span className="rounded-full border border-blue-300/30 px-4 py-2">ديرما رولر 0.5mm</span>
            <span className="rounded-full border border-amber-300/40 px-4 py-2">الدفع عند الاستلام</span>
          </div>
          <button type="button" onClick={order} className="w-full sm:w-auto rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-base font-black px-8 py-4 shadow-xl transition-colors">
            اطلب الطقم الآن — {kit.totalPrice} ر.س · الدفع عند الاستلام
          </button>
        </div>
        <div className="rounded-3xl border border-white/20 p-3 bg-white/10 shadow-2xl">
          <img src="/images/daranca-duo.webp" alt="سيروم Daranca بببتيدات النحاس وديرما رولر" className="w-full rounded-2xl" fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}
