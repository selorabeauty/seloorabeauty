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

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A0F08' }}>

      {/* ── Trust strip ── */}
      <div style={{ borderBottom: '1px solid rgba(245,230,200,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#F5E6C8' }}>
              <span style={{ color: '#C4943E' }}>{item.icon}</span>
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
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
            >
              <span className="text-xs font-bold" style={{ color: '#FDFAF6' }}>S</span>
            </span>
            <div>
              <span className="text-2xl font-bold block leading-none" style={{ color: '#FFFFFF' }}>سيلورا بيوتي</span>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase block"
                style={{ color: '#C4943E' }}>
                Sellura Beauty
              </span>
            </div>
          </div>
          {/* High-contrast brand tagline */}
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#F5E6C8' }}>
            علاج علمي لتشققات الجسم للمرأة السعودية. زيت اللوز الحلو والأرجان. نتائج حقيقية.
          </p>
          {/* Email clearly visible */}
          <p className="text-sm mt-3 font-semibold" style={{ color: '#F5E6C8' }}>
            ✉️ hello@sellurabeauty.com
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold mb-4 text-sm" style={{ color: '#FFFFFF' }}>روابط سريعة</h4>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: '#F5E6C8' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-bold mb-4 text-sm" style={{ color: '#FFFFFF' }}>السياسات</h4>
          <ul className="space-y-2.5">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: '#F5E6C8' }}
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
                   justify-between gap-2 text-xs font-medium border-t"
        style={{ borderColor: 'rgba(245,230,200,0.12)', color: '#F5E6C8' }}
      >
        <span>© ٢٠٢٦ Sellura Beauty. جميع الحقوق محفوظة.</span>
        <span>مسجل لدى هيئة الزكاة والضريبة — VAT</span>
      </div>
    </footer>
  );
}
