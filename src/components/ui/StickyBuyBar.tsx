'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';
import { trackAddToCart } from '@/lib/pixels';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-duo')!;

export default function StickyBuyBar() {
  const { setMainSet, openCheckout } = useCartStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    trackAddToCart({ id: completeSet.id, sku: completeSet.sku, name: completeSet.label, price: completeSet.totalPrice });
    setMainSet({
      id: completeSet.id,
      name: completeSet.label,
      price: completeSet.totalPrice,
      originalPrice: completeSet.originalTotal,
      imageBg: 'from-amber-900 to-stone-950',
      includes: ['سيروم ببتيدات النحاس الأزرق 100ml', 'ديرما رولر التيتانيوم 0.5mm'],
      sku: completeSet.sku,
    });
    openCheckout();
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-md border-t"
      style={{ background: 'rgba(253,250,246,0.98)', borderColor: '#EBD9B4', boxShadow: '0 -4px 32px rgba(15,23,42,0.12)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <div className="font-bold text-sm" style={{ color: '#1A0F08' }}>{completeSet.label}</div>
          <div className="text-xs font-semibold" style={{ color: '#16A34A' }}>{completeSet.totalPrice} ر.س · فحص المنتج متاح قبل الدفع عند الاستلام</div>
        </div>
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          <span className="text-xs font-bold hidden md:flex items-center gap-1 text-[#DC2626]">
            <span>⚡ شحن سريع ١-٣ أيام من الرياض</span>
          </span>
          <button onClick={handleClick} className="btn-gold flex items-center gap-2 py-3.5 px-6 shadow-xl animate-cta-pulse text-white font-black text-sm">
            <ShoppingBag size={17} />
            اطلبي الآن — الدفع عند الاستلام
          </button>
        </div>
      </div>
    </div>
  );
}
