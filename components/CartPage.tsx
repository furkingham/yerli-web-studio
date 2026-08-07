'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartPage() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="space-y-10">
      <section className="rounded-[28px] border border-white/10 bg-[#141414] p-8 shadow-industrial">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Sepet</p>
            <h1 className="text-3xl font-semibold text-white">Sipariş Özeti</h1>
          </div>
          <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Toplam ürün: {cartCount}</div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-white/10 bg-[#111111] p-10 text-center text-slate-300">
          <p className="text-xl font-semibold text-white">Sepetinizde ürün yok.</p>
          <p className="mt-3 text-sm text-slate-400">Milwaukee ürün kataloğumuzu inceleyip sepetinize ekleme yapabilirsiniz.</p>
          <Link href="/category" className="mt-8 inline-flex rounded-3xl bg-milwaukee px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
            Ürünlere git
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div key={item.productId} className="rounded-[28px] border border-white/10 bg-[#111111] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-white/5 p-3">
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} sizes="96px" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                      <p className="mt-2 text-sm text-slate-400">{item.price}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="rounded-3xl bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-600/20"
                  >
                    Ürünü kaldır
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#121212] text-white transition hover:border-milwaukee"
                      aria-label="Adeti azalt"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#121212] text-white transition hover:border-milwaukee"
                      aria-label="Adeti artır"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-300">Ara toplam: {item.price}</div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-[#111111] p-6">
            <div className="space-y-5">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Sipariş Özeti</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Ürün adedi</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Sepet toplamı</span>
                    <span>{cartTotal}</span>
                  </div>
                </div>
              </div>

              <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
                Siparişi onayla
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-3xl bg-white/5 px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Sepeti temizle
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
