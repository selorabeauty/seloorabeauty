'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

// Cart icon links straight to the /cart page — no drawer/pop-up.

const NAV_LINKS = [
  { href: '/ar',              label: 'الرئيسية' },
  { href: '/ar#results',      label: 'نتائج قبل وبعد' },
  { href: '/ar#science',      label: 'العلم والميكانيزم' },
  { href: '/ar#ingredients',  label: 'التركيبة الفعالة' },
  { href: '/ar#reviews',      label: 'آراء العميلات' },
  { href: '/ar#faq',          label: 'الأسئلة والضمان' },
];

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Cart count is persisted in localStorage, so it must only render after mount to avoid SSR/CSR hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
      style={scrolled ? { backgroundColor: 'rgba(251,247,241,0.95)', borderBottom: '1px solid #EFE4D4' } : {}}
    >
      {/* ── Announcement bar ── */}
      <div
        className="text-center text-xs py-2 px-4 font-semibold tracking-wide flex items-center justify-center gap-2 flex-wrap"
        style={{ backgroundColor: '#2A1C12', color: '#F5E6C8' }}
      >
        <span>🇸🇦 شحن سريع لكافة مدن المملكة (١-٣ أيام)</span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="font-bold text-[#D4A96A] flex items-center gap-1">
          <span>الدفع عند الاستلام متاح بعد فحص الطلب</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="text-[#E8C98F]">🛡️ ضمان استرجاع ٣٠ يوماً</span>
      </div>

      {/* ── Main nav ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo — Selora Beauty */}
        <Link href="/ar" className="flex items-center gap-2.5 select-none group">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, #C4943E, #A87830)' }}
          >
            <Sparkles size={16} className="text-white" />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-xl font-bold tracking-tight transition-colors"
              style={{ color: '#1A0F08', fontFamily: 'var(--font-tajawal), Tajawal, Cairo, Arial, sans-serif' }}
            >
              سيلورا بيوتي
            </span>
            <span
              className="text-[9px] font-bold tracking-[0.25em] uppercase"
              style={{ color: '#C4943E' }}
            >
              Selora Beauty
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: '#3D2B1F' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C4943E')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3D2B1F')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Cart + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/ar/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#2A1C12', color: '#FBF7F1' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A1C12')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A0F08')}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">السلة</span>
            {mounted && totalItems > 0 && (
              <span
                className="absolute -top-2 -end-2 w-5 h-5 flex items-center justify-center
                           text-white text-[10px] font-bold rounded-full shadow"
                style={{ backgroundColor: '#C4943E' }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2"
            style={{ color: '#1A0F08' }}
            aria-label="قائمة"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t shadow-lg"
          style={{ backgroundColor: '#FBF7F1', borderColor: '#EFE4D4' }}
        >
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-base font-medium transition-colors"
                  style={{ color: '#2A1C12' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A87830'; e.currentTarget.style.backgroundColor = '#F8F2EA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#2A1C12'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
