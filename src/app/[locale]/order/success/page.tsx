'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, Phone, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { identifyUser, trackPurchase } from '@/lib/pixels';

const DELIVERY_STEPS = [
  { icon: <CheckCircle2 size={20} />, title: 'تم استلام طلبك', desc: 'طلبك في نظامنا وجاري المعالجة', done: true },
  { icon: <Package size={20} />, title: 'يُعبَّأ طلبك', desc: 'سيتم التعبئة والتجهيز خلال ٢٤ ساعة', done: false },
  { icon: <Truck size={20} />, title: 'في الطريق إليكِ', desc: 'يصلكِ خلال ١-٣ أيام عمل', done: false },
  { icon: <Phone size={20} />, title: 'اتصال قبل التوصيل', desc: 'سيتصل بكِ المندوب قبل الوصول', done: false },
];

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('id') ?? 'SLR-XXXX';
  const customerName = params.get('name') ?? '';
  const total = params.get('total') ? Number(params.get('total')) : null;

  // Fire Purchase event with full details & Advanced Matching on thank you page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedData: {
      orderId?: string;
      total?: number;
      eventId?: string;
      name?: string;
      phone?: string;
      items?: Array<{ id?: string; sku?: string; name?: string; price?: number; quantity?: number }>;
    } = {};

    try {
      const raw = sessionStorage.getItem('slr_last_order');
      if (raw) savedData = JSON.parse(raw);
    } catch {}

    // Only count a purchase that checkout confirmed and stored; direct visits/reloads of a fake URL never fire
    const currentOrderId = savedData.orderId;
    if (!currentOrderId || (orderId !== 'SLR-XXXX' && orderId !== currentOrderId)) return;
    const finalTotal = total || savedData.total || 249;
    const finalName = customerName || savedData.name || '';
    const finalPhone = savedData.phone || '';
    const finalEventId = params.get('ev') || savedData.eventId || crypto.randomUUID();
    const finalItems = savedData.items || [
      { sku: 'SLR-SET-COMPLETE', name: 'الروتين الكامل — سيروم + ديرما رولر', quantity: 1, price: finalTotal },
    ];

    // Session deduplication guard so page reloads don't duplicate events
    const dedupKey = `slr_tracked_success_${currentOrderId}`;
    if (sessionStorage.getItem(dedupKey)) {
      return;
    }
    sessionStorage.setItem(dedupKey, 'true');

    // 1. Advanced Matching: identify buyer
    if (finalPhone || finalName) {
      identifyUser({ phone: finalPhone, name: finalName });
    }

    // 2. Fire PURCHASE event with full details (price, currency, transaction_id, item_ids, number_items, client_dedup_id)
    trackPurchase(finalTotal, currentOrderId, finalEventId, finalItems);
  }, [orderId, customerName, total, params]);

  // Suggest the other 2 products as upsells
  const upsells = PRODUCTS.slice(1, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Confirmation hero */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle2 size={48} className="text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              {customerName ? `مرحباً ${customerName}! تم استلام طلبك بنجاح 🎉` : 'تم استلام طلبك بنجاح! 🎉'}
            </h1>
            <p className="text-base text-slate-600 mb-5">
              شكراً لثقتك بنا — طلبك مسجل بنظامنا وسيصلك اتصال أو رسالة واتساب لتأكيد موعد التوصيل.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm text-sm">
              <span className="text-slate-500 font-bold">رقم الطلب:</span>
              <span className="font-black text-blue-700 font-mono text-base">{orderId}</span>
              {total && <span className="text-slate-900 font-black">· {formatPrice(total)}</span>}
            </div>
          </div>

          {/* Delivery timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
            <h2 className="font-black text-xl text-slate-900 mb-6 text-center">خطوات تجهيز وتوصيل طلبك</h2>
            <div className="space-y-5">
              {DELIVERY_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className={`font-bold text-sm ${step.done ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {step.title}
                      {step.done && <span className="mr-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">مكتمل</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery promise */}
            <div className="mt-6 bg-blue-50/90 border border-blue-200 rounded-2xl px-5 py-4 text-center">
              <div className="font-black text-blue-900 mb-1">🚚 موعد التوصيل: خلال ١-٣ أيام عمل لباب منزلك</div>
              <div className="text-sm text-slate-700">
                فحص الطرد متاح بالكامل عند وصول المندوب قبل الدفع عند الاستلام.
              </div>
            </div>
          </div>

          {/* Social proof strip */}
          <div className="card mb-8 text-center">
            <div className="flex justify-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-stone-700 font-medium text-sm">
              انضممتِ لأكثر من{' '}
              <strong className="text-stone-900">٣٤٠٠ امرأة سعودية</strong>{' '}
              يثقن بسيلورا بيوتي — أهلاً بكِ في العائلة!
            </p>
          </div>

          {/* Upsell */}
          <div className="mb-8">
            <h2 className="text-xl font-black text-stone-900 mb-2 text-center">أكملي روتينك</h2>
            <p className="text-sm text-stone-400 mb-6 text-center">
              العملاء اللواتي يجمعن هذه المنتجات يحصلن على نتائج أسرع
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {upsells.map((p) => (
                <ProductCard key={p.id} product={p} locale="ar" />
              ))}
            </div>
          </div>

          {/* Back home */}
          <div className="text-center">
            <Link href="/ar" className="btn-outline">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <CheckoutPopup />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-400">تحميل...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
