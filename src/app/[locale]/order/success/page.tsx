'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, Phone, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import { PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

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

  // Suggest the other 2 products as upsells
  const upsells = PRODUCTS.slice(1, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Confirmation hero */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 size={48} className="text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-3">
              {customerName ? `مرحباً ${customerName}!` : 'تم استلام طلبك! 🎉'}
            </h1>
            <p className="text-lg text-stone-500 mb-5">
              شكراً لكِ — طلبك في يدينا وسنوصله في أقرب وقت ممكن.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-stone-100 rounded-2xl px-5 py-3 shadow-sm text-sm">
              <span className="text-stone-400">رقم الطلب:</span>
              <span className="font-black text-stone-900 font-mono">{orderId}</span>
              {total && <span className="text-amber-600 font-black">· {formatPrice(total)}</span>}
            </div>
          </div>

          {/* Delivery timeline */}
          <div className="card mb-8">
            <h2 className="font-black text-xl text-stone-900 mb-6 text-center">ماذا بعد؟</h2>
            <div className="space-y-5">
              {DELIVERY_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.done ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-400'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className={`font-bold text-sm ${step.done ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {step.title}
                      {step.done && <span className="mr-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">مكتمل</span>}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">{step.desc}</div>
                  </div>
                  {i < DELIVERY_STEPS.length - 1 && (
                    <div className="hidden" />
                  )}
                </div>
              ))}
            </div>

            {/* Delivery promise */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-center">
              <div className="font-black text-amber-800 mb-1">🚚 وعدنا: التوصيل خلال ١-٣ أيام</div>
              <div className="text-sm text-amber-700">
                إذا تأخر طلبك لأي سبب، تواصلي معنا فوراً وسنحله لكِ.
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
              <strong className="text-stone-900">٢٤٠٠ امرأة سعودية</strong>{' '}
              يثقن بسيلورا — أهلاً بكِ في العائلة!
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
