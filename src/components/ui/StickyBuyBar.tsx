'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SET_OPTIONS } from '@/lib/products';
import { track } from '@/lib/track';

const completeSet = SET_OPTIONS.find((s) => s.id === 'set-complete')!;

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
    track.addToCart();
    setMainSet({
      id: completeSet.id,
      name: completeSet.label,
      price: completeSet.totalPrice,
      originalPrice: completeSet.originalTotal,
      imageBg: 'from-bark-800 to-bark-900',
      includes: ['سيروم علاج تشققات الجسم', 'كريم علاج تشققات الجسم'],
      sku: completeSet.sku,
    });
    openCheckout();
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-sm border-t"
      style={{ background: 'rgba(253,250,246,0.97)', borderColor: '#EFE4D4', boxShadow: '0 -4px 32px rgba(58,40,24,0.10)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <div className="font-bold text-sm" style={{ color: '#1A0F08' }}>{completeSet.label}</div>
          <div className="text-xs" style={{ color: '#8C7B6E' }}>{completeSet.totalPrice} ر.س · الدفع عند الاستلام</div>
        </div>
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          <span className="text-sm font-bold hidden md:block animate-pulse" style={{ color: '#C0392B' }}>
            ⚡ الكمية محدودة
          </span>
          <button onClick={handleClick} className="btn-gold flex items-center gap-2 py-3 px-6 animate-cta-pulse"
            style={{ color: '#1A0F08', fontWeight: 800 }}>
            <ShoppingBag size={17} />
            اطلبي الآن — الدفع عند الاستلام
          </button>
        </div>
      </div>
    </div>
  );
}
