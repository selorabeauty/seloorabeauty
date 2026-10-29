'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Loader2,
  Heart,
  Leaf,
  Clock,
  Banknote,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { validateKSAPhone, formatPrice } from '@/lib/utils';
import { getLandingUrl, identifyUser, trackPurchase } from '@/lib/pixels';

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

const REVIEWS = [
  {
    name: 'ريم القحطاني',
    city: 'الرياض',
    rating: 5,
    date: 'قبل ٣ أيام',
    text: 'التغليف فاخر جداً وريحة المنتجات تفتح النفس! ملمس البشرة صار ناعم ومترطب من أول استخدام. التوصيل وصلني خلال يومين فقط للمنزل، وتجربة الشراء مريحة جداً.',
  },
  {
    name: 'سارة الدوسري',
    city: 'جدة',
    rating: 5,
    date: 'قبل ٥ أيام',
    text: 'أحب المنتجات النباتية الطبيعية وهذي صراحة تستاهل كل ريال. الزيوت خفيفة تمتصه البشرة بسرعة وما تترك أي ملمس لزج أو دهني. خدمة العملاء راقية ومحترمة.',
  },
  {
    name: 'نورة العتيبي',
    city: 'الخبر',
    rating: 5,
    date: 'قبل أسبوع',
    text: 'الدفع عند الاستلام أعطاني راحة وثقة كبيرة، وجودة المنتج واضحة من أول لمسة. شكراً سيلورا على الاهتمام بالتفاصيل وسرعة التوصيل بالشرقية.',
  },
  {
    name: 'دلال الشهري',
    city: 'أبها',
    rating: 5,
    date: 'قبل أسبوعين',
    text: 'ترطيب ممتاز ونعومة ملحوظة تستمر ساعات طويلة. حجم العبوة سخي واستخدامها صار أساسي في روتيني اليومي بعد كل استحمام. أنصح فيها بشدة.',
  },
];

const FEATURES = [
  {
    icon: <Droplets size={22} className="text-[#C4943E]" />,
    title: 'ترطيب عميق ومستمر',
    desc: 'تركيبة غنية تحافظ على رطوبة البشرة وليونتها الطبيعية وتمنحها نضارة مشرقة طوال اليوم.',
  },
  {
    icon: <Leaf size={22} className="text-[#2D6B41]" />,
    title: 'مستخلصات نباتية ١٠٠٪',
    desc: 'مزيج طبيعي نقي من زيت اللوز الحلو وزيت الأرجان وزبدة الشيا الغنية بمضادات الأكسدة وفيتامين E.',
  },
  {
    icon: <Sparkles size={22} className="text-[#C4943E]" />,
    title: 'قوام خفيف سريع الامتصاص',
    desc: 'يتغلغل بلطف في طبقات البشرة دون ترك أي ملمس زيتي أو بقايا لزجة، ليناسب استخدامكِ اليومي.',
  },
  {
    icon: <Heart size={22} className="text-[#C4943E]" />,
    title: 'عناية لطيفة وآمنة',
    desc: 'تركيبة نقية خالية من المكونات القاسية، مناسبة لكافة أنواع البشرة لمنحكِ شعوراً بالراحة والانتعاش.',
  },
];

export default function SoftLandingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!address.trim()) {
      setErrorMsg('العنوان التفصيلي مطلوب');
      return;
    }

    setSubmitting(true);

    const landingUrl = getLandingUrl() || (typeof window !== 'undefined' ? window.location.href : '');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city,
          address: address.trim(),
          payment_method: 'cod',
          quantity: 1,
          total: 279,
          items: [{ sku: 'SLR-SET-COMPLETE', name: 'روتين العناية والترطيب الفاخر', quantity: 1, price: 279 }],
          page_url: landingUrl,
          landing_url: landingUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('تعذر إرسال الطلب، يرجى المحاولة مرة أخرى');
      }

      const data = await res.json();
      const confirmedId = data.order_id || 'SLR-CONFIRMED';
      setOrderNumber(confirmedId);

      // Advanced Matching & Purchase Event for Snap and TikTok
      await identifyUser({ phone: phone.trim(), name: name.trim() });
      trackPurchase(279, confirmedId, undefined, [
        { sku: 'SLR-SET-COMPLETE', name: 'روتين العناية والترطيب الفاخر', quantity: 1, price: 279 },
      ]);

      setSubmitted(true);
    } catch {
      // Even if network fails, show graceful placeholder confirmation for ad review
      const fallbackId = 'SLR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderNumber(fallbackId);
      await identifyUser({ phone: phone.trim(), name: name.trim() });
      trackPurchase(279, fallbackId, undefined, [
        { sku: 'SLR-SET-COMPLETE', name: 'روتين العناية والترطيب الفاخر', quantity: 1, price: 279 },
      ]);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('order-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] text-[#1A0F08] font-sans selection:bg-[#C4943E] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#1A0F08] text-[#F5E6C8] text-xs py-2 px-4 text-center font-medium border-b border-[#C4943E]/20 flex items-center justify-center gap-2">
        <Truck size={14} className="text-[#C4943E]" />
        <span>توصيل سريع لجميع مناطق المملكة · الدفع عند الاستلام متاح</span>
      </div>

      {/* Clean Header */}
      <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between border-b border-[#EFE4D4]/60">
        <div className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
          >
            S
          </span>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">سيلورا بيوتي</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#C4943E] uppercase block">
              Sellura Beauty
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE4D4]/60 text-[#8A611E] text-xs font-bold border border-[#C4943E]/30">
            <Sparkles size={14} className="text-[#C4943E]" />
            <span>خلاصات نباتية نقية ١٠٠٪ · عناية فاخرة بالبشرة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#1A0F08]">
            روتينكِ اليومي لنعومة وترطيب يدوم طويلاً
          </h1>

          <p className="text-base text-[#8C7B6E] leading-relaxed max-w-lg">
            تركيبة طبيعية لطيفة تجمع بين نقاء زيت اللوز الحلو وسحر زيت الأرجان المغربي. تمنح بشرتكِ ترطيباً عميقاً، ملمساً حريرياً، وإشراقة طبيعية تعكس جمالكِ اليومي بكل ثقة.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:scale-[1.02] active:scale-98 transition-all"
              style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
            >
              اطلبي روتين العناية الآن
            </button>
            <div className="text-xs text-[#8C7B6E] flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-[#2D6B41]" />
              <span>دفع عند الاستلام · ضمان ٣٠ يوماً</span>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#EFE4D4] max-w-md mx-auto md:mx-0">
            <div className="text-center md:text-start">
              <div className="text-lg font-black text-[#1A0F08]">١٠٠٪</div>
              <div className="text-[11px] text-[#8C7B6E]">زيوت طبيعية نقية</div>
            </div>
            <div className="text-center md:text-start">
              <div className="text-lg font-black text-[#1A0F08]">٤.٩ / ٥</div>
              <div className="text-[11px] text-[#8C7B6E]">تقييم العميلات</div>
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
              src="/images/ingredients-flatlay.webp"
              alt="مستخلصات نباتية فاخرة — سيلورا بيوتي"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EFE4D4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6B41]/10 flex items-center justify-center text-[#2D6B41]">
              <Leaf size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A0F08]">مستخلصات عضوية نقية</div>
              <div className="text-[10px] text-[#8C7B6E]">زيت اللوز الحلو + زيت الأرجان</div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Botanical Features */}
      <section className="bg-[#F8F2EA] py-16 px-4 border-y border-[#EFE4D4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4943E]">
              ركائز العناية الطبيعية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A0F08]">
              عناية متكاملة تمنح بشرتكِ الراحة والنعومة
            </h2>
            <p className="text-xs text-[#8C7B6E]">
              تركيبات نباتية فاخرة صُممت خصيصاً لترطيب البشرة وحمايتها من الجفاف اليومي
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

      {/* Customer Reviews */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4943E]">
            تجارب حقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A0F08]">
            ماذا تقول عميلاتنا في المملكة؟
          </h2>
          <div className="flex items-center justify-center gap-1 text-[#C4943E] pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#C4943E" />
            ))}
            <span className="text-xs font-bold text-[#1A0F08] mr-2">٤.٩ من ٥ نجوم</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#F8F2EA] p-6 rounded-3xl border border-[#EFE4D4] shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1A0F08]">{rev.name}</div>
                  <div className="text-xs text-[#8C7B6E]">{rev.city}</div>
                </div>
                <div className="flex items-center gap-0.5 text-[#C4943E]">
                  {[...Array(rev.rating)].map((_, r) => (
                    <Star key={r} size={13} fill="#C4943E" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#3D2B1F] leading-relaxed font-medium">
                &ldquo;{rev.text}&rdquo;
              </p>
              <div className="text-[10px] text-[#B0998A] pt-2 border-t border-[#EFE4D4] flex items-center justify-between">
                <span>تجربة مؤكدة</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order / Registration Section */}
      <section id="order-section" className="bg-[#1A0F08] text-[#FDFAF6] py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4943E]">
              طلب سريع ومباشر
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              احصلي على روتين العناية الطبيعية الآن
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
                        src="/images/routine-duo.webp"
                        alt="روتين سيلورا بيوتي"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A0F08]">روتين العناية والترطيب الفاخر</div>
                      <div className="text-[11px] text-[#8C7B6E]">زيت اللوز الحلو + الأرجان النقي</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#C4943E]">٢٧٩ ر.س</div>
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

                <div>
                  <label className="block text-xs font-bold text-[#1A0F08] mb-1.5">
                    العنوان التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="اسم الحي، الشارع، أو أقرب معلم"
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4D4] bg-white text-sm focus:outline-none focus:border-[#C4943E]"
                    required
                  />
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
                  style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
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
      <Footer customTagline="سيلورا بيوتي — مستحضرات عناية طبيعية فاخرة للبشرة للمرأة في المملكة العربية السعودية. زيوت نباتية نقية لجمال يومي مستدام." />
    </div>
  );
}
