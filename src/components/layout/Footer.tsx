import Link from 'next/link';
import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

const TRUST = [
  { icon: <Shield size={16} />,      text: 'دفع آمن عند الاستلام' },
  { icon: <Truck size={16} />,       text: 'شحن سريع ١‑٣ أيام' },
  { icon: <RotateCcw size={16} />,   text: 'ضمان استرداد ٣٠ يوماً' },
  { icon: <Headphones size={16} />,  text: 'دعم عملاء ٧ أيام' },
];

const QUICK_LINKS = [
  { href: '/ar',          label: 'الرئيسية' },
  { href: '/ar/products', label: 'المنتجات' },
  { href: '/ar/contact',  label: 'تواصلي معنا' },
];

const POLICY_LINKS = [
  { href: '/ar/privacy',  label: 'سياسة الخصوصية' },
  { href: '/ar/terms',    label: 'شروط الاستخدام' },
  { href: '/ar/returns',  label: 'سياسة الاسترجاع' },
  { href: '/ar/shipping', label: 'سياسة الشحن' },
];

interface FooterProps {
  customTagline?: string;
  hideTagline?: boolean;
}

export default function Footer({ customTagline, hideTagline }: FooterProps = {}) {
  return (
    <footer style={{ backgroundColor: '#1A0F08', borderTop: '1px solid #3D2B1F' }}>

      {/* ── Trust strip ── */}
      <div style={{ borderBottom: '1px solid #3D2B1F' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-semibold text-stone-300">
              <span className="text-amber-400">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main columns ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow"
              style={{ background: 'linear-gradient(135deg, #8A611E, #8A611E)', border: '1px solid #D4A96A' }}
            >
              <span className="text-xs font-bold text-white">S</span>
            </span>
            <div>
              <span className="text-2xl font-black block leading-none text-white">سيلورا بيوتي</span>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase block text-amber-400">
                Selora Beauty
              </span>
            </div>
          </div>
          {/* Brand tagline */}
          {!hideTagline && (
            <p className="text-sm leading-relaxed font-medium text-stone-400">
              {customTagline || 'سيلورا بيوتي — ببتيدات النحاس الزرقاء والديرما رولر للعناية ببشرة جسمكِ واستعادة ثقتكِ.'}
            </p>
          )}
          {/* Email */}
          <p className="text-sm mt-3 font-semibold text-stone-300">
            ✉️ <a href="mailto:support@seloorabeauty.shop" className="underline-offset-2 hover:underline text-amber-400">support@seloorabeauty.shop</a>
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold mb-4 text-sm text-white">روابط سريعة</h4>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors text-stone-400 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-bold mb-4 text-sm text-white">السياسات</h4>
          <ul className="space-y-2.5">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors text-stone-400 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center
                   justify-between gap-2 text-xs font-medium border-t border-stone-800 text-stone-400"
      >
        <span>© ٢٠٢٦ Selora Beauty. جميع الحقوق محفوظة.</span>
        <span>🇸🇦 شحن سريع وتوصيل للمنزل · الدفع عند الاستلام</span>
      </div>
    </footer>
  );
}
