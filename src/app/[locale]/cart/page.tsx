'use client';
import Photo from '@/components/ui/Photo';
import Link from 'next/link';
import { Trash2, ShoppingBag, ShieldCheck, Truck, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { PRODUCTS, SET_OPTIONS, getSetProducts, itemImages } from '@/lib/products';

export default function CartPage() {
  const { items, removeItem, setMainSet, subtotal, openCheckout } = useCartStore();
  const total = subtotal();

  const currentItem = items[0];
  const isSingle = currentItem && currentItem.price === 199;
  const isComplete = currentItem && currentItem.id === 'set-complete';

  const upgradeTarget = isSingle
    ? SET_OPTIONS.find((s) => s.id === 'set-complete')
    : isComplete
    ? SET_OPTIONS.find((s) => s.id === 'set-double')
    : null;

  const handleApplyUpsell = () => {
    if (!upgradeTarget) return;
    const included = getSetProducts(upgradeTarget);
    setMainSet({
      id: upgradeTarget.id,
      name: upgradeTarget.label,
      price: upgradeTarget.totalPrice,
      originalPrice: upgradeTarget.originalTotal,
      imageBg: 'from-blue-900 to-slate-950',
      includes: included.map((p) => p.name),
      sku: upgradeTarget.sku,
    });
  };

  const crossSells = PRODUCTS.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black text-slate-900">سلة المشتريات</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">🇸🇦 شحن سريع لكافة مدن المملكة · الدفع عند الاستلام متاح</p>
            </div>
            <span className="badge-clinical text-xs">
              <CheckCircle2 size={13} /> ضمان تجربة ٣٠ يوماً
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto p-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <ShoppingBag size={36} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">سلتكِ فارغة حالياً</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                ابدأ/ي باختيار الطقم المناسب لكِ للعناية بمظهر التشققات ومرونة الجلد.
              </p>
              <Link href="/ar" className="btn-gold inline-flex px-8 py-4 text-base font-bold shadow-md">
                تصفح الطقم العلاجي
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

              {/* Items list */}
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 sm:gap-5">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden p-2">
                      <Photo src={itemImages(item)[0]} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">
                        {item.includes && item.includes.length > 0 ? item.includes.join(' + ') : `الكمية: ${item.quantity}`}
                      </div>
                      <div className="text-xs text-emerald-600 font-bold mt-1">
                        ✓ متوفر وجاهز للشحن الفوري
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-black text-slate-900 text-xl">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.originalPrice && (
                        <div className="text-xs line-through text-slate-400">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {/* ── High-Converting AOV Upsell Box ── */}
                {upgradeTarget && (
                  <div className="rounded-3xl p-5 border-2 border-blue-500 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 shadow-md">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow">
                          <Sparkles size={15} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-blue-700">
                          {isSingle ? 'ترقية ذكية موصى بها — وفر ٥٠ ريال' : 'عرض الكورس المكثف — توفير ٥١ ريال'}
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">
                        عرض حصري بالسلة
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 pt-3 border-t border-blue-200/60">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {isSingle ? 'رقّي إلى طقم الترميم المجهري المتكامل' : 'رقّي إلى باقة الكورس المكثف (٣ أشهر)'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {isSingle
                            ? 'أضف ديرما رولر التيتانيوم الطبية مع السيروم لمضاعفة امتصاص الكولاجين ٨٠٪ وسرعة النتائج.'
                            : 'احصل على عبوتين سيروم 30ml + ديرما رولر لكورس أطول ومساحات أكبر.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyUpsell}
                        className="btn-gold whitespace-nowrap text-sm py-3 px-5 shadow-lg active:scale-95"
                      >
                        رقّي طلبي الآن ← ({upgradeTarget.totalPrice} ر.س)
                      </button>
                    </div>
                  </div>
                )}

                {/* Cross-sell in cart */}
                {crossSells.length > 0 && (
                  <div className="mt-6">
                    <p className="font-black text-slate-800 mb-4 text-base">عناصر علاجية مكملة لروتينك:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {crossSells.map((p) => (
                        <ProductCard key={p.id} product={p} locale="ar" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary & COD Checkout Box */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
                  <h3 className="font-black text-slate-900 text-lg mb-4 pb-3 border-b border-slate-100">ملخص الطلب</h3>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>قيمة المنتجات</span>
                      <span className="font-bold text-slate-900">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>رسوم الشحن والتوصيل</span>
                      <span className="font-bold text-emerald-600">مجاناً بالكامل 🚚</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>طريقة الدفع</span>
                      <span className="font-bold text-slate-900">الدفع عند الاستلام (COD)</span>
                    </div>

                    <div className="flex justify-between font-black text-xl text-slate-900 pt-3 border-t border-slate-200">
                      <span>الإجمالي النهائي</span>
                      <span className="text-blue-700">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button onClick={openCheckout} className="btn-gold w-full text-lg py-5 shadow-xl font-black animate-cta-pulse">
                    أكمل/ي الطلب — الدفع عند الاستلام
                  </button>

                  <p className="text-xs text-center font-bold text-emerald-700 mt-3">
                    🔒 ادفع/ي للمندوب بعد استلام وفحص الطرد في منزلكِ
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
                    {[
                      { i: <ShieldCheck size={14} />, t: 'دفع عند الاستلام' },
                      { i: <Truck size={14} />, t: 'شحن ١-٣ أيام' },
                      { i: <RotateCcw size={14} />, t: 'ضمان ٣٠ يوماً' },
                    ].map((x, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 text-center text-[10px] font-bold text-slate-500">
                        <span className="text-blue-600">{x.i}</span>
                        {x.t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-blue-50/80 border border-blue-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-blue-900 font-extrabold mb-1">ملاحظة الشحن والتأكيد:</strong>
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
