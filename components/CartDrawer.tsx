'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!drawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button type="button" onClick={closeDrawer} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-label="Sepet kapat" />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-[#0f0f0f] shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Sepetiniz</p>
            <h2 className="text-2xl font-semibold text-white">Sipariş Önizleme</h2>
          </div>
          <button type="button" onClick={closeDrawer} className="rounded-2xl bg-white/5 p-3 text-slate-300 transition hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cartItems.length === 0 ? (
            <div className="space-y-4 rounded-[32px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
              <ShoppingCart className="mx-auto h-12 w-12 text-milwaukee" />
              <p className="text-lg font-semibold text-white">Sepetiniz boş</p>
              <p className="text-sm text-slate-400">Ürünleri keşfedin ve sepetinize ekleyin.</p>
              <Link href="/category" className="inline-flex rounded-3xl bg-milwaukee px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
                Ürünleri Gör
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div key={item.productId} className="rounded-[32px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-white/5">
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} sizes="96px" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                          <p className="mt-2 text-sm text-slate-400">{item.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="rounded-2xl bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                          aria-label="Ürünü kaldır"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#121212] text-white transition hover:border-milwaukee"
                          aria-label="Adeti azalt"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-semibold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#121212] text-white transition hover:border-milwaukee"
                          aria-label="Adeti artır"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Toplam ürün</span>
            <span>{cartCount}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-lg font-semibold text-white">
            <span>Toplam</span>
            <span>{cartTotal}</span>
          </div>
          <div className="mt-5 grid gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-3xl bg-white/5 px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              onClick={closeDrawer}
            >
              Sepete git
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-3xl bg-red-600/10 px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-600/20"
            >
              Sepeti temizle
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
