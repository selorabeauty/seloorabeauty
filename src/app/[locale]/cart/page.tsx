'use client';
import Link from 'next/link';
import { Trash2, ShoppingBag, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { itemImages } from '@/lib/products';

export default function CartPage() {
  const { items, removeItem, subtotal, openCheckout } = useCartStore();
  const total = subtotal();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <div>
              <h1 className="text-3xl font-black text-stone-900">سلة المشتريات</h1>
              <p className="text-xs font-semibold text-stone-500 mt-1">🇸🇦 شحن سريع لكافة مدن المملكة · الدفع عند الاستلام متاح</p>
            </div>
            <span className="badge-clinical text-xs">
              <CheckCircle2 size={13} /> ضمان تجربة ٣٠ يوماً
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto p-8">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <ShoppingBag size={36} />
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 mb-2">سلتكِ فارغة حالياً</h2>
              <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
                ابدأ/ي باختيار طقم سيلورا لترميم التشققات واستعادة نعومة ومرونة الجلد.
              </p>
              <Link href="/ar" className="btn-gold inline-flex px-8 py-4 text-base font-bold shadow-md">
                تصفح طقم سيلورا
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

              {/* Items list */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center gap-4 sm:gap-5">
                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-stone-100 overflow-hidden p-2">
                      {itemImages(item).map((src) => (
                        <img key={src} src={src} alt={item.name} className="w-full h-full object-contain" decoding="async" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-stone-900 text-base leading-snug">{item.name}</div>
                      <div className="text-xs text-stone-500 mt-1 font-medium">
                        {item.includes && item.includes.length > 0 ? item.includes.join(' + ') : `الكمية: ${item.quantity}`}
                      </div>
                      <div className="text-xs text-emerald-600 font-bold mt-1">
                        ✓ متوفر وجاهز للشحن الفوري
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-black text-stone-900 text-xl">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.originalPrice && (
                        <div className="text-xs line-through text-stone-400">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors p-2" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}


              </div>

              {/* Order Summary & COD Checkout Box */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md">
                  <h3 className="font-black text-stone-900 text-lg mb-4 pb-3 border-b border-stone-100">ملخص الطلب</h3>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-stone-600">
                      <span>قيمة المنتجات</span>
                      <span className="font-bold text-stone-900">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>رسوم الشحن والتوصيل</span>
                      <span className="font-bold text-emerald-600">مجاناً بالكامل 🚚</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>طريقة الدفع</span>
                      <span className="font-bold text-stone-900">الدفع عند الاستلام (COD)</span>
                    </div>

                    <div className="flex justify-between font-black text-xl text-stone-900 pt-3 border-t border-stone-200">
                      <span>الإجمالي النهائي</span>
                      <span className="text-amber-700">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button onClick={openCheckout} className="btn-gold w-full text-lg py-5 shadow-xl font-black animate-cta-pulse">
                    أكمل/ي الطلب — الدفع عند الاستلام
                  </button>

                  <p className="text-xs text-center font-bold text-emerald-700 mt-3">
                    🔒 ادفع/ي للمندوب بعد استلام وفحص الطرد في منزلكِ
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-stone-100">
                    {[
                      { i: <ShieldCheck size={14} />, t: 'دفع عند الاستلام' },
                      { i: <Truck size={14} />, t: 'شحن ١-٣ أيام' },
                      { i: <RotateCcw size={14} />, t: 'ضمان ٣٠ يوماً' },
                    ].map((x, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 text-center text-[10px] font-bold text-stone-500">
                        <span className="text-amber-600">{x.i}</span>
                        {x.t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-amber-50/80 border border-amber-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="block text-amber-900 font-extrabold mb-1">ملاحظة الشحن والتأكيد:</strong>
                  سيقوم فريق المستودع بتجهيز الشحنة وشحنها مباشرة عبر أرامكس/سمسا، وسيتواصل معك المندوب قبل التوصيل للتنسيق.
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
