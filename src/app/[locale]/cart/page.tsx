'use client';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { PRODUCTS } from '@/lib/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, openCheckout } = useCartStore();
  const total = subtotal();

  const crossSells = PRODUCTS.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-black text-stone-900 mb-8">سلة التسوق</h1>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag size={64} className="mx-auto text-stone-200 mb-5" />
              <p className="text-stone-400 text-lg mb-6 font-medium">السلة فارغة</p>
              <Link href="/ar/products" className="btn-primary">
                تصفحي المنتجات
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">

              {/* Items list */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="card flex items-center gap-5">
                    <div className={`w-16 h-16 bg-gradient-to-b ${item.imageBg} rounded-xl flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-white text-[7px] font-black text-center leading-tight">SLR</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-stone-900 text-base truncate">{item.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {item.includes && item.includes.length > 0 ? item.includes.join(' + ') : `الكمية: ${item.quantity}`}
                      </div>
                    </div>
                    <div className="font-black text-amber-600 text-lg w-24 text-end">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Cross-sell in cart */}
                {crossSells.length > 0 && (
                  <div className="mt-4">
                    <p className="font-black text-stone-700 mb-4 text-sm">أكملي روتينك مع هذه المنتجات:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {crossSells.map((p) => (
                        <ProductCard key={p.id} product={p} locale="ar" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="card">
                  <h3 className="font-black text-stone-900 mb-5">ملخص الطلب</h3>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between font-black text-lg text-stone-900 pt-1 border-t border-stone-100">
                      <span>الإجمالي</span>
                      <span className="text-amber-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button onClick={openCheckout} className="btn-gold w-full text-lg py-5">
                    أكملي الطلب — الدفع عند الاستلام
                  </button>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { i: <ShieldCheck size={12} />, t: 'آمن ١٠٠٪' },
                      { i: <Truck size={12} />, t: 'شحن سريع' },
                      { i: <RotateCcw size={12} />, t: 'ضمان ٣٠ يوم' },
                    ].map((x, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 text-center text-[10px] font-bold text-stone-400">
                        <span className="text-amber-500">{x.i}</span>
                        {x.t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CheckoutPopup />
    </>
  );
}
