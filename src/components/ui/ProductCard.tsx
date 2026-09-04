'use client';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/lib/products';

interface Props {
  product: Product;
  locale?: string;
}

export default function ProductCard({ product, locale = 'ar' }: Props) {
  const { addItem, openCheckout } = useCartStore();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      imageBg: product.imageBg,
    });
    openCheckout();
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div
      className="product-card flex flex-col"
      style={{ background: '#fff', borderColor: '#EFE4D4' }}
    >
      {/* Image area */}
      <Link href={`/${locale}/products/${product.slug}`} className="block relative">
        <div
          className={`aspect-square bg-gradient-to-b ${product.imageBg} flex items-center justify-center`}
        >
          <div
            className="w-24 h-36 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-lg px-2"
            style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-xs font-bold tracking-wider" style={{ color: '#D4A96A' }}>SELORA</span>
            <span className="text-[8px] font-bold tracking-widest text-center leading-relaxed px-1" style={{ color: 'rgba(253,250,246,0.7)' }}>
              {product.subtitle.split(' ').slice(0, 2).join('\n')}
            </span>
            <span className="text-[7px] mt-0.5" style={{ color: 'rgba(253,250,246,0.3)' }}>30 ml</span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {(product.isBestseller || product.isNew || product.badge) && (
            <span
              className="text-xs font-bold px-2.5 py-1.5 rounded-xl shadow"
              style={{
                background: product.isNew ? '#2D6B41' : '#C4943E',
                color: '#fff',
              }}
            >
              {product.badge}
            </span>
          )}
        </div>
        <div
          className="absolute top-3 end-3 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow"
          style={{ background: '#C0392B', color: '#fff' }}
        >
          -{discount}%
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Link href={`/${locale}/products/${product.slug}`}>
          {/* Bold dark title */}
          <h3
            className="text-base leading-snug transition-colors"
            style={{ color: '#1A0F08', fontWeight: 800 }}
          >
            {product.name}
          </h3>
          {/* Darkened tagline — was #8C7B6E */}
          <p className="text-xs mt-0.5 font-medium" style={{ color: '#4A3E3D' }}>{product.tagline}</p>
        </Link>

        {/* Stars + rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                style={{ color: i < Math.floor(product.rating) ? '#C4943E' : '#EFE4D4' }}
              />
            ))}
          </div>
          {/* Bold dark rating number */}
          <span className="text-sm font-bold" style={{ color: '#1A0F08' }}>{product.rating}</span>
          {/* Darkened review count */}
          <span className="text-xs font-medium" style={{ color: '#4A3E3D' }}>
            ({product.reviewCount.toLocaleString('ar-SA')})
          </span>
        </div>

        {/* Price — bold and large */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-2xl" style={{ color: '#1A0F08', fontWeight: 800 }}>
            {product.price} <span className="text-base font-bold">ر.س</span>
          </span>
          <span className="text-sm line-through" style={{ color: '#A08870' }}>{product.originalPrice}</span>
        </div>

        {/* CTA */}
        <button
          onClick={handleBuyNow}
          className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-sm"
        >
          <ShoppingBag size={15} />
          اطلبي الآن
        </button>

        <Link
          href={`/${locale}/products/${product.slug}`}
          className="text-center text-sm font-bold transition-colors"
          style={{ color: '#8C7B6E' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1A0F08')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8C7B6E')}
        >
          اعرفي أكثر ←
        </Link>
      </div>
    </div>
  );
}
