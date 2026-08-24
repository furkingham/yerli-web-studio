'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useCart } from './CartContext';
import type { Product } from '../data/products';
import { useLanguage } from './LanguageContext';

const stockStyles: Record<string, string> = {
  'Stokta Var': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Kritik Stok': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Tükendi': 'bg-slate-200 text-slate-700 ring-slate-300',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <Link href={`/urun/${product.slug}`} className="block transition hover:-translate-y-0.5 hover:shadow-lg">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md transition hover:border-milwaukee/60 hover:bg-slate-50/50">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="relative h-32 w-full overflow-hidden rounded-3xl bg-slate-100 xl:h-40 xl:w-40">
            <Image
              src={product.image || 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              style={{ objectFit: 'cover' }}
              className="rounded-3xl"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t(product.category)}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{product.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-2xl bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-bold text-amber-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0</span>
                </div>
                <div className={`rounded-2xl px-3 py-1 text-xs font-semibold uppercase ring-1 ${stockStyles[product.stockStatus]}`}>
                  {t(product.stockStatus)}
                </div>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-600">{t(product.description || '')}</p>
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {product.voltage && (
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{t('Voltaj')}</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">{product.voltage}</dd>
                </div>
              )}
              {product.motorType && (
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{t('Motor Tipi')}</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">{t(product.motorType)}</dd>
                </div>
              )}
              {product.batteryCapacity && (
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{t('Akü Kapasitesi')}</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">{product.batteryCapacity} Ah</dd>
                </div>
              )}
              {product.warranty && (
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">{t('Garanti')}</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">{product.warranty}</dd>
                </div>
              )}
            </dl>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xl font-semibold text-milwaukee">{product.price}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  addToCart(product);
                }}
                className="rounded-2xl bg-milwaukee px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
              >
                {t('Sepete ekle')}
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
