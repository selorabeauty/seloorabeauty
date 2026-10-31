'use client';

import { SET_OPTIONS, setIncludesLabels } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { BadgeCheck, Gift } from 'lucide-react';

/**
 * Upsell pack chooser — 1 / 2 / 3 serums (+ free derma roller each).
 * Renders the three SET_OPTIONS as offer cards; clicking one loads it
 * into the cart and opens the COD checkout.
 */
export default function PackSelector() {
  const { setMainSet, openCheckout } = useCartStore();

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {SET_OPTIONS.map((set) => (
        <button
          key={set.id}
          onClick={() => {
            setMainSet({
              id: set.id,
              name: set.label,
              price: set.totalPrice,
              originalPrice: set.originalTotal,
              imageBg: 'from-amber-100 to-stone-200',
              sku: set.sku,
              includes: setIncludesLabels(set),
            });
            openCheckout();
          }}
          className={`relative flex flex-col gap-3 rounded-3xl border-2 p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            set.highlight
              ? 'border-amber-500 bg-gradient-to-b from-amber-50 to-white shadow-lg'
              : 'border-stone-200 bg-white hover:border-amber-300'
          }`}
        >
          {set.badge && (
            <span
              className={`absolute -top-3 start-4 rounded-full px-3 py-1 text-[11px] font-black text-white shadow ${
                set.highlight ? 'bg-amber-600' : 'bg-stone-600'
              }`}
            >
              {set.badge}
            </span>
          )}

          <div className="rounded-2xl overflow-hidden border border-stone-100">
            <img
              src={set.image}
              alt={set.label}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="font-black text-base leading-snug" style={{ color: '#1A0F08' }}>
            {set.label}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#A87830' }}>
            <Gift size={13} /> {set.perUnitLabel}
          </div>

          <div className="mt-auto flex items-end justify-between pt-2 border-t border-stone-100">
            <div>
              <div className="text-2xl font-black" style={{ color: '#1A0F08' }}>
                {set.totalPrice} <span className="text-sm">ر.س</span>
              </div>
              <div className="text-sm line-through" style={{ color: '#B0998A' }}>
                {set.originalTotal} ر.س
              </div>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: '#1E8A5A' }}>
              {set.savingsLabel}
            </span>
          </div>

          <span
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black text-white"
            style={{ background: set.highlight ? 'linear-gradient(135deg, #C4943E, #A87830)' : '#2A1C12' }}
          >
            <BadgeCheck size={15} /> اطلبي الآن — الدفع عند الاستلام
          </span>
        </button>
      ))}
    </div>
  );
}
