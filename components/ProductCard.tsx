'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import type { Product } from '../data/products';

const stockStyles: Record<string, string> = {
  'Stokta Var': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
  'Kritik Stok': 'bg-amber-500/15 text-amber-300 ring-amber-500/20',
  'Tükendi': 'bg-slate-700/15 text-slate-300 ring-slate-600/20',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Link href={`/urun/${product.slug}`} className="block transition hover:-translate-y-0.5 hover:shadow-2xl">
      <article className="rounded-[28px] border border-white/10 bg-[#111111] p-6 shadow-industrial transition hover:border-milwaukee/70 hover:bg-white/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative h-32 w-full overflow-hidden rounded-3xl bg-white/5 xl:h-40 xl:w-40">
          <Image
            src={product.image}
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
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{product.category}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{product.name}</h3>
            </div>
            <div className={`rounded-2xl px-3 py-1 text-xs font-semibold uppercase ring-1 ${stockStyles[product.stockStatus]}`}>
              {product.stockStatus}
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-300">{product.description}</p>
          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Voltaj</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{product.voltage}</dd>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Motor Tipi</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{product.motorType}</dd>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Akü Kapasitesi</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{product.batteryCapacity} Ah</dd>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Garanti</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{product.warranty}</dd>
            </div>
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
              className="rounded-2xl bg-milwaukee px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600"
            >
              Sepete ekle
            </button>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}
