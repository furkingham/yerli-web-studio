'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = '/auth';
    } else {
      router.push('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-slate-50 p-6">
            <ShoppingCart size={48} className="text-slate-300" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-extrabold text-slate-900">Sepetiniz Boş</h1>
        <p className="mb-8 text-slate-500">Sepetinizde henüz ürün bulunmuyor.</p>
        <Link href="/" className="inline-flex rounded bg-milwaukee px-8 py-3.5 font-bold text-white transition hover:bg-red-700">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  // Calculate totals
  const totalAmount = cartItems.reduce((acc, item) => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    const price = parseInt(priceStr, 10);
    return acc + (price * item.quantity);
  }, 0);
  
  const formattedTotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalAmount);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between rounded bg-slate-900 px-6 py-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-white" size={24} />
          <h1 className="text-xl font-bold text-white">Sepetim</h1>
        </div>
      </div>

      {/* Banner */}
      <div className="mb-8 rounded border border-green-200 bg-green-50 p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-green-800">Siparişinizi teslim alın, %100 Güvenli Alışveriş!</h2>
        <p className="text-sm text-green-700">
          Kaswa Makine güvencesiyle siparişiniz özenle hazırlanıp en kısa sürede adresinize teslim edilecektir.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-12 items-center border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-bold text-slate-700 md:grid">
          <div className="col-span-1 text-center">Sil</div>
          <div className="col-span-2">Ürün</div>
          <div className="col-span-5">Ürün Adı</div>
          <div className="col-span-2 text-center">Adet</div>
          <div className="col-span-2 text-right">Tutar</div>
        </div>

        <div className="divide-y divide-slate-100">
          {cartItems.map((item) => (
            <div key={item.productId} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-12 md:items-center md:gap-0 md:px-6 md:py-5">
              {/* Delete */}
              <div className="col-span-1 flex justify-end md:justify-center">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="rounded bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                  title="Ürünü Sil"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Image */}
              <div className="col-span-2 flex justify-center md:justify-start md:pl-4">
                <div className="relative h-24 w-24 overflow-hidden rounded bg-slate-50">
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                </div>
              </div>

              {/* Product Info */}
              <div className="col-span-5 flex flex-col items-center text-center md:items-start md:text-left md:pr-4">
                <Link href={`/urun/${item.productId}`} className="font-bold text-slate-800 hover:text-milwaukee">
                  {item.name}
                </Link>
                <span className="mt-1 text-sm text-slate-500">Stok Kodu: {item.productId.substring(0, 8).toUpperCase()}</span>
              </div>

              {/* Quantity */}
              <div className="col-span-2 flex items-center justify-center py-4 md:py-0">
                <div className="flex h-10 w-28 items-center justify-between rounded border border-slate-200 bg-white px-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-full w-8 items-center justify-center text-slate-600 hover:text-milwaukee"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-bold text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-full w-8 items-center justify-center text-slate-600 hover:text-milwaukee"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-center text-lg font-extrabold text-slate-900 md:text-right">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(
                  parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Actions */}
        <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8">
          <div className="mx-auto max-w-md md:mr-0 md:ml-auto">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between font-semibold text-slate-600">
                <span>Ürünler Toplamı:</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-600">
                <span>Standart Kargo:</span>
                <span>0 TL</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-extrabold text-slate-900">
                <span>Toplam (KDV Dahil):</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="flex items-center justify-center rounded bg-[#f59e0b] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#d97706]"
              >
                Alışverişe Devam Et
              </Link>
              <button
                type="button"
                onClick={handleCheckout}
                className="flex items-center justify-center rounded bg-[#16a34a] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#15803d]"
              >
                Sepeti Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
