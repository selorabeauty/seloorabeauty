'use client';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { getProduct, getCrossSells, PRODUCTS } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

const REVIEWS = [
  { name: 'سارة م. — الرياض', rating: 5, text: 'بعد أسبوعين المسامات تصغرت وبشرتي أصبحت أكثر إشراقاً. مستحيل أرجع لأي منتج ثاني.' },
  { name: 'نورة الغامدي — جدة', rating: 5, text: 'ما أعطى تهيج أبداً. بشرتي نعمت وبدأت أشوف فرق في الخطوط الدقيقة.' },
  { name: 'منى الشمري — الدمام', rating: 5, text: 'البقع الداكنة بدأت تخف بشكل واضح. الشحن وصل بسرعة والتغليف فخم.' },
];

export default function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const crossSells = getCrossSells(params.slug);
  const { addItem, openCheckout } = useCartStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howto'>('benefits');
  const [added, setAdded] = useState(false);

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, originalPrice: product.originalPrice, imageBg: product.imageBg });
    }
    openCheckout();
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, originalPrice: product.originalPrice, imageBg: product.imageBg });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-24 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="text-xs text-stone-400 mb-6 flex items-center gap-2">
            <a href="/ar" className="hover:text-stone-700 transition-colors">الرئيسية</a>
            <span>/</span>
            <a href="/ar/products" className="hover:text-stone-700 transition-colors">المنتجات</a>
            <span>/</span>
            <span className="text-stone-600 font-medium">{product.name}</span>
          </nav>

          {/* ── Main grid ── */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

            {/* Image */}
            <div className="md:sticky md:top-24">
              <div className="relative bg-white rounded-3xl shadow-sm border border-stone-100 aspect-square flex items-center justify-center overflow-hidden">
                <div className={`w-40 h-56 bg-gradient-to-b ${product.imageBg} rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-2 px-3`}>
                  <span className="text-white text-sm font-black tracking-widest">SELORA</span>
                  <span className="text-amber-300 text-[10px] font-bold tracking-wider text-center leading-relaxed">
                    {product.subtitle.toUpperCase()}
                  </span>
                  <span className="text-white/30 text-[9px] mt-1">30 ml</span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 start-4 flex flex-col gap-1.5">
                  {product.isBestseller && <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">{product.badge}</span>}
                  {product.isNew && <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">{product.badge}</span>}
                </div>
                <div className="absolute top-4 end-4 bg-red-500 text-white text-sm font-black px-2.5 py-1.5 rounded-xl shadow">
                  -{discount}%
                </div>
              </div>

              {/* Mini thumbs */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.benefits.slice(0, 4).map((b, i) => (
                  <div key={i} className="bg-white rounded-xl border border-stone-100 aspect-square flex items-center justify-center p-2 hover:border-amber-300 transition-colors cursor-pointer">
                    <span className="text-[8px] text-stone-500 text-center font-medium leading-tight">{b.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold text-amber-600 mb-2">{product.tagline}</p>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight">{product.name}</h1>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={17} className={i < Math.floor(product.rating) ? 'star fill-amber-400' : 'text-stone-200'} />)}
                </div>
                <span className="font-black text-stone-900">{product.rating}</span>
                <span className="text-sm text-stone-400">({product.reviewCount.toLocaleString('ar-SA')} تقييم)</span>
              </div>

              {/* Description */}
              <p className="text-base text-stone-600 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-stone-900">{product.price} <span className="text-2xl">ر.س</span></span>
                  <span className="text-xl text-stone-400 line-through">{product.originalPrice}</span>
                  <span className="badge-gold">وفري {discount}%</span>
                </div>
                <p className="text-sm text-stone-400">شامل ضريبة القيمة المضافة ١٥٪</p>
                <p className="text-sm text-stone-500 font-medium mt-1">💳 الدفع عند الاستلام — لا بطاقة مطلوبة</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-bold text-stone-900">الكمية:</span>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-stone-50 transition-colors"><Minus size={15} /></button>
                  <span className="px-4 font-black text-lg w-12 text-center">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="px-4 py-2.5 hover:bg-stone-50 transition-colors"><Plus size={15} /></button>
                </div>
                {qty >= 2 && (
                  <span className="text-sm text-emerald-600 font-bold">
                    🎁 وفري {formatPrice((product.originalPrice - product.price) * qty)}
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button onClick={handleBuyNow} className="btn-gold w-full text-lg py-5 animate-cta-pulse">
                  اطلبي الآن — الدفع عند الاستلام
                </button>
                <button
                  onClick={handleAddToCart}
                  className={cn('btn-outline w-full', added && 'bg-stone-900 text-white border-stone-900')}
                >
                  {added ? '✓ تمت الإضافة للسلة' : 'أضيفي للسلة'}
                </button>
              </div>

              {/* Guarantee */}
              <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                <RotateCcw size={14} />
                ضمان استرداد كامل خلال ٣٠ يوماً إذا لم ترَي نتيجة
              </p>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { i: <ShieldCheck size={13} />, t: 'دفع عند الاستلام' },
                  { i: <Truck size={13} />, t: 'شحن ١-٣ أيام' },
                  { i: <RotateCcw size={13} />, t: 'ضمان ٣٠ يوم' },
                ].map((x, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-2 border border-stone-100 text-xs font-bold text-stone-600">
                    <span className="text-amber-500">{x.i}</span>{x.t}
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="border-t border-stone-100 pt-5">
                <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1">
                  {[
                    { key: 'benefits', label: 'الفوائد' },
                    { key: 'ingredients', label: 'المكونات' },
                    { key: 'howto', label: 'طريقة الاستخدام' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all',
                        activeTab === tab.key
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-500 hover:text-stone-700'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'benefits' && (
                  <ul className="space-y-2.5">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                        <span className="text-amber-500 font-black mt-0.5">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <div className="grid gap-3">
                    {product.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                        <span className="text-xl flex-shrink-0">{ing.icon}</span>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{ing.name}</div>
                          <div className="text-xs text-stone-400">{ing.benefit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'howto' && (
                  <ol className="space-y-3">
                    {product.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>

          {/* ── Product Reviews ── */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-stone-900 mb-6">آراء العملاء</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <div key={i} className="card">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className={j < r.rating ? 'star fill-amber-400' : 'text-stone-200'} />)}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                  <div className="font-bold text-sm text-stone-900">{r.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cross-sells ── */}
          <div>
            <h2 className="text-2xl font-black text-stone-900 mb-2">قد يعجبكِ أيضاً</h2>
            <p className="text-stone-400 text-sm mb-8">منتجات تعمل بشكل مثالي مع {product.name}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl">
              {crossSells.map((p) => (
                <ProductCard key={p.id} product={p} locale={params.locale} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CheckoutPopup />
    </>
  );
}
