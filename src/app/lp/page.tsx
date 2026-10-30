'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Heart,
  Leaf,
  Clock,
  Banknote,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ResultsSection from '@/components/sections/ResultsSection';
import { validateKSAPhone, formatPrice } from '@/lib/utils';
import { getLandingUrl, identifyUser, trackPurchase, captureClickIds, getClickIds } from '@/lib/pixels';

const CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الطائف',
  'تبوك',
  'أبها',
  'حائل',
  'القصيم',
  'نجران',
  'جازان',
  'الجوف',
  'مدينة أخرى',
];

const FEATURES = [
  {
    icon: <Sparkles size={22} className="text-[#C4943E]" />,
    title: 'ببتيدات النحاس الزرقاء GHK-Cu',
    desc: 'سيروم تركيبة معملية متقدمة يحتوي على ببتيدات النحاس الفعالة التي تساعد في تحسين مظهر الجلد وتنعيمه.',
  },
  {
    icon: <ShieldCheck size={22} className="text-[#2D6B41]" />,
    title: 'ديرما رولر تيتانيوم احترافي',
    desc: 'ديرما رولر تيتانيوم 0.5mm. اتبع تعليمات الشركة المصنّعة للاستخدام والتنظيف.',
  },
  {
    icon: <Leaf size={22} className="text-[#C4943E]" />,
    title: 'طقم ترميم متكامل',
    desc: 'مزيج متزامن من السيروم والديرما رولer للعناية التجميلية ببشرة الجسم ومظهرها العام.',
  },
  {
    icon: <Heart size={22} className="text-[#C4943E]" />,
    title: 'روتين العناية',
    desc: 'اتبع تعليمات الاستخدام المرفقة مع المنتج.',
  },
];

export default function SoftLandingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Capture ad click IDs on page load for attribution
  useEffect(() => {
    captureClickIds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('الاسم الكامل مطلوب');
      return;
    }
    if (!validateKSAPhone(phone)) {
      setErrorMsg('رقم الجوال غير صحيح — يجب أن يبدأ بـ 0 ويكون ١٠ أرقام (مثال: 0501234567)');
      return;
    }
    if (!city) {
      setErrorMsg('يرجى اختيار المدينة');
      return;
    }

    setSubmitting(true);

    const landingUrl = getLandingUrl() || (typeof window !== 'undefined' ? window.location.href : '');
    const eventId = crypto.randomUUID(); // shared browser+CAPI dedup id
    const clickIds = getClickIds();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city,
          payment_method: 'cod',
          quantity: 1,
          total: 249,
          items: [{ sku: 'SD-COPPER-ROLLER-SET', name: 'طقم سيروم ببتيدات النحاس والديرما رولر', quantity: 1, price: 249 }],
          page_url: landingUrl,
          landing_url: landingUrl,
          event_id: eventId,
          ...clickIds,
        }),
      });

      if (!res.ok) {
        throw new Error('تعذر إرسال الطلب، يرجى المحاولة مرة أخرى');
      }

      const data = await res.json();
      if (!data.order_id) throw new Error('Order response did not contain an order ID');
      const confirmedId = data.order_id;
      setOrderNumber(confirmedId);

      // Advanced Matching & Purchase Event for Snap and TikTok
      await identifyUser({ phone: phone.trim(), name: name.trim() });
      trackPurchase(249, confirmedId, eventId, [
        { sku: 'SD-COPPER-ROLLER-SET', name: 'طقم سيروم ببتيدات النحاس والديرما رولر', quantity: 1, price: 249 },
      ]);

      setSubmitted(true);
    } catch (error) {
      console.error('Order failed:', error);
      setErrorMsg('تعذر إرسال الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('order-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f2f6fa] text-[#0B1B3D] font-sans selection:bg-[#C4943E] selection:text-white pb-24 md:pb-0">
      {/* Top Banner */}
      <div className="bg-[#0B1B3D] text-[#F5E6C8] text-xs py-2 px-4 text-center font-medium border-b border-[#C4943E]/20 flex items-center justify-center gap-2">
        <Truck size={14} className="text-[#C4943E]" />
        <span>توصيل سريع لجميع مناطق المملكة · الدفع عند الاستلام متاح</span>
      </div>

      {/* Clean Header */}
      <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between border-b border-[#EFE4D4]/60">
        <div className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, #1E3A8A, #0F2C59)' }}
          >
            SB
          </span>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">Selora Beauty</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#2563EB] uppercase block">
              SELORA BEAUTY
            </span>
          </div>
        </div>

        <button
          onClick={scrollToForm}
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md hover:opacity-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
        >
          اطلبي الآن
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center md:text-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE]/60 text-[#1E3A8A] text-xs font-bold border border-[#2563EB]/30">
            <Sparkles size={14} className="text-[#2563EB]" />
            <span>طقم ترميم التشققات المجهري · ببتيدات النحاس + ديرما رولر</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#1A0F08]">
            Micro-Repair Clinical Protocol for Deep Stretch Marks &amp; Skin Textures.
          </h1>

          <p className="text-base text-[#8C7B6E] leading-relaxed max-w-lg">
            طقم Daranca للعناية بالبشرة: سيروم ببتيدات النحاس 30ml وديرما رولر تيتانيوم 0.5mm.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:scale-[1.02] active:scale-98 transition-all"
              style={{ background: '#ea580c' }}
            >
              اطلب الطقم الآن — 249 ر.س · الدفع عند الاستلام
            </button>
            <div className="text-xs text-[#8C7B6E] flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-[#2D6B41]" />
              <span>دفع عند الاستلام · ضمان ٣٠ يوماً</span>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#EFE4D4] max-w-md mx-auto md:mx-0">
            <div className="text-center md:text-start">
              <div className="text-lg font-black text-[#1A0F08]">٣٠ مل</div>
              <div className="text-[11px] text-[#8C7B6E]">سيروم ببتيدات النحاس</div>
            </div>
            <div className="text-center md:text-start">
              <div className="text-lg font-black text-[#1A0F08]">0.5mm</div>
              <div className="text-[11px] text-[#8C7B6E]">ديرما رولر</div>
            </div>
            <div className="text-center md:text-start">
              <div className="text-lg font-black text-[#1A0F08]">١-٣ أيام</div>
              <div className="text-[11px] text-[#8C7B6E]">توصيل سريع للمنزل</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#EFE4D4] bg-[#F8F2EA] relative aspect-[4/5]">
            <Image
              src="/images/daranca-duo.webp"
              alt="سيروم Daranca بببتيدات النحاس وديرما رولر"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EFE4D4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A0F08]">طقم ترميم متكامل</div>
              <div className="text-[10px] text-[#8C7B6E]">سيروم ببتيدات النحاس + ديرما رولر</div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Botanical Features */}
      <section className="bg-[#F8F2EA] py-16 px-4 border-y border-[#EFE4D4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              مميزات الطقم
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A0F08]">
              طقم متكامل للعناية ببشرة الجسم
            </h2>
            <p className="text-xs text-[#8C7B6E]">
              سيروم ببتيدات النحاس الزرقاء مع ديرما رولer تيتانيوم طبية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((item, i) => (
              <div
                key={i}
                className="bg-[#FDFAF6] p-6 rounded-2xl border border-[#EFE4D4] shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8F2EA] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm text-[#1A0F08]">{item.title}</h3>
                <p className="text-xs text-[#8C7B6E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResultsSection />
      <ReviewsSection />

      {/* Order / Registration Section */}
      <section id="order-section" className="bg-[#1A0F08] text-[#FDFAF6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              طلب سريع ومباشر
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              احصلي على طقم سيروم ببتيدات النحاس والديرما رولر الآن
            </h2>
            <p className="text-xs text-[#F5E6C8]/80 leading-relaxed">
              سجلي بيانات التوصيل وسيصلكِ مندوبنا حتى باب منزلكِ مع إمكانية الدفع عند الاستلام
            </p>
          </div>

          <div className="bg-[#FDFAF6] text-[#1A0F08] p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#EFE4D4]">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-[#1A0F08]">تم استلام طلبكِ بنجاح!</h3>
                <p className="text-sm text-[#8C7B6E]">
                  شكراً لثقتكِ بسيلورا بيوتي. رقم طلبكِ هو:{' '}
                  <span className="font-mono font-bold text-[#1A0F08]">{orderNumber}</span>
                </p>
                <p className="text-xs text-[#8C7B6E]">
                  سيتواصل معكِ المندوب قريباً لتأكيد موعد التوصيل. الدفع عند الاستلام.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#C4943E] font-bold underline underline-offset-4"
                  >
                    تقديم طلب آخر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Summary mini card */}
                <div className="p-3.5 rounded-2xl bg-[#F8F2EA] border border-[#EFE4D4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white overflow-hidden relative border border-[#EFE4D4] flex-shrink-0">
                      <Image
                        src="/images/daranca-duo.webp"
                        alt="طقم سيروم ببتيدات النحاس والديرما رولر"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A0F08]">طقم سيروم ببتيدات النحاس + ديرما رولر</div>
                      <div className="text-[11px] text-[#8C7B6E]">سيروم Daranca 30ml + ديرما رولر تيتانيوم 0.5mm</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-[#999] line-through">٢٧٩ ر.س</span>
                      <span className="text-sm font-black text-[#2563EB]">٢٤٩ ر.س</span>
                    </div>
                    <div className="text-[10px] text-[#2D6B41] font-bold">شحن سريع مجاني</div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#1A0F08] mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارة الأحمد"
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4D4] bg-white text-sm focus:outline-none focus:border-[#C4943E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A0F08] mb-1.5">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhone(val);
                      if (val.replace(/\D/g, '').length >= 10) {
                        identifyUser(val, name);
                      }
                    }}
                    onBlur={() => {
                      if (phone.replace(/\D/g, '').length >= 10) {
                        identifyUser(phone, name);
                      }
                    }}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4D4] bg-white text-sm focus:outline-none focus:border-[#C4943E] text-start"
                    required
                  />
                  <p className="text-[11px] text-[#8C7B6E] mt-1">
                    رقم سعودي يبدأ بـ 05 ومكوّن من ١٠ أرقام
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A0F08] mb-1.5">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4D4] bg-white text-sm focus:outline-none focus:border-[#C4943E]"
                    required
                  >
                    <option value="">-- اختاري مدينتكِ --</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COD badge */}
                <div className="p-3 rounded-xl bg-[#EAF5EE] border border-[#A8D8B8] flex items-center gap-2.5 text-[#1A4A2A]">
                  <Banknote size={18} className="text-[#2D6B41]" />
                  <span className="text-xs font-bold">الدفع عند الاستلام — ادفعي للمندوب عند وصول طلبكِ</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-xl flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-60"
                  style={{ background: '#ea580c' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>تأكيدي طلبي الآن — الدفع عند الاستلام</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#8C7B6E] pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#2D6B41]" /> آمن ١٠٠٪
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck size={13} className="text-[#C4943E]" /> شحن سريع
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCcw size={13} className="text-[#C4943E]" /> ضمان ٣٠ يوم
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Compliance-safe Footer without medical / health claims */}
      <Footer />
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0B1B3D] border-t border-amber-400/40 px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-white text-sm font-bold">طقم Daranca<br /><span className="text-amber-300">249 ر.س</span></div>
        <button type="button" onClick={scrollToForm} className="bg-orange-600 text-white font-bold text-xs rounded-xl px-4 py-3">
          اطلب الآن — الدفع عند الاستلام
        </button>
      </div>
    </div>
  );
}
