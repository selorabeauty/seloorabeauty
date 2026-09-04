'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/ar',              label: 'الرئيسية' },
  { href: '/ar/products',     label: 'المنتجات' },
  { href: '/ar#ingredients',  label: 'المكونات' },
  { href: '/ar#reviews',      label: 'آراء العملاء' },
  { href: '/ar/contact',      label: 'تواصلي معنا' },
];

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-nude-50/97 backdrop-blur-xl shadow-luxury border-b border-nude-200'
          : 'bg-transparent'
      )}
      style={scrolled ? { backgroundColor: 'rgba(253,250,246,0.97)' } : {}}
    >
      {/* ── Announcement bar ── */}
      <div
        className="text-center text-xs py-2.5 px-4 font-medium tracking-wide"
        style={{ backgroundColor: '#1A0F08', color: '#D4A96A' }}
      >
        🚚 شحن سريع داخل المملكة &nbsp;·&nbsp;{' '}
        <span className="inline-block animate-cta-pulse font-bold px-1 rounded" style={{ color: '#FFD98A' }}>
          💰 الدفع عند الاستلام
        </span>
        {' '}&nbsp;·&nbsp; ✨ ضمان استرداد ٣٠ يوماً
      </div>

      {/* ── Main nav ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/ar" className="flex flex-col leading-none select-none group">
          <span
            className="text-xl font-bold tracking-tight transition-colors"
            style={{ color: '#1A0F08' }}
          >
            سيلورا
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.28em] uppercase"
            style={{ color: '#C4943E' }}
          >
            Beauty
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
            style={{ backgroundColor: '#1A0F08', color: '#FDFAF6' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A1C12')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A0F08')}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">السلة</span>
            {totalItems > 0 && (
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
          className="md:hidden border-t shadow-luxury-lg"
          style={{ backgroundColor: '#FDFAF6', borderColor: '#EFE4D4' }}
        >
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-base font-medium transition-colors"
                  style={{ color: '#1A0F08' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#C4943E'; e.currentTarget.style.backgroundColor = '#F8F2EA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#1A0F08'; e.currentTarget.style.backgroundColor = 'transparent'; }}
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
