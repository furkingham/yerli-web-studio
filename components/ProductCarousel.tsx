"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product } from '../data/products';
import { getAdminProducts } from '../lib/admin';
import { useLanguage } from './LanguageContext';
import { useCart } from './CartContext';

export default function ProductCarousel({ title, category }: { title: string, category?: string }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getAdminProducts());
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const displayProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return (
    <div className="w-full py-8">
      {/* Title */}
      <div className="flex items-center justify-center mb-8 relative">
        <div className="h-px bg-slate-300 w-full absolute top-1/2 -z-10"></div>
        <h2 className="text-lg font-bold bg-[#eef0f3] px-4 text-slate-800 uppercase tracking-wide">
          {title}
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 sm:-ml-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-milwaukee hover:scale-110 transition opacity-80 hover:opacity-100"
          aria-label="Önceki"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 sm:gap-5 scroll-smooth no-scrollbar pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product) => (
            <div key={product.id} className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] shrink-0 snap-start">
              <Link
                href={`/urun/${product.slug}`}
                className="group flex h-full flex-col justify-between rounded-xl bg-white p-3 sm:p-4 transition hover:shadow-lg border border-slate-200 relative"
              >
                {/* YENİ or İNDİRİM tags could go here */}
                {product.stockStatus === 'Tükendi' && (
                   <div className="absolute top-3 left-3 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">TÜKENDİ</div>
                )}
                
                <div className="space-y-3">
                  <div className="relative h-32 sm:h-40 w-full overflow-hidden flex items-center justify-center bg-white">
                    <Image
                      src={product.image || 'https://placehold.co/400x400/ffffff/db0000?text=Milwaukee'}
                      alt={product.name}
                      fill
                      sizes="280px"
                      style={{ objectFit: 'contain' }}
                      className="transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-milwaukee transition line-clamp-2 leading-snug h-10">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Star className="h-2.5 w-2.5 fill-slate-300 text-slate-300" />
                      <Star className="h-2.5 w-2.5 fill-slate-300 text-slate-300" />
                      <Star className="h-2.5 w-2.5 fill-slate-300 text-slate-300" />
                      <Star className="h-2.5 w-2.5 fill-slate-300 text-slate-300" />
                      <Star className="h-2.5 w-2.5 fill-slate-300 text-slate-300" />
                      <span className="ml-1">(0 Yorum)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
                  <div>
                    {/* Old price mock (just to match design) */}
                    <span className="text-[10px] text-slate-400 line-through block">
                      {(parseFloat(product.price.replace(/[^\d.,]/g, '')) * 1.4).toFixed(3)} TL
                    </span>
                    <p className="text-base font-bold text-slate-900">{product.price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="flex h-8 items-center justify-center rounded-md bg-milwaukee px-3 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    EKLE
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 sm:-mr-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-milwaukee hover:scale-110 transition opacity-80 hover:opacity-100"
          aria-label="Sonraki"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
