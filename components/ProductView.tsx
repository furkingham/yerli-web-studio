'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Minus, Plus, Heart, Share2, MessageSquare, Bell, Check, ShoppingCart, Star } from 'lucide-react';
import ProductDetailTabs from './ProductDetailTabs';
import { useLanguage } from './LanguageContext';
import { useCart } from './CartContext';
import { getProductRatingSummary } from '../lib/reviews';
import type { Product } from '../data/products';

export default function ProductView({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [favoriteAdded, setFavoriteAdded] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [rating, setRating] = useState({ averageRating: 5.0, totalReviews: 0 });

  useEffect(() => {
    const summary = getProductRatingSummary(product.id);
    setRating({ averageRating: summary.averageRating, totalReviews: summary.totalReviews });
  }, [product.id]);

  // Compute mock original list price for discount badge
  const parsePrice = (priceStr: string) => {
    const num = Number(priceStr.replace(/\./g, '').replace(' TL', '').replace(',', '.').trim()) || 1000;
    return num;
  };
  const currentPriceNum = parsePrice(product.price);
  const oldPriceNum = Math.round(currentPriceNum * 1.18);
  const oldPriceFormatted = `${oldPriceNum.toLocaleString('tr-TR')} TL`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleActionToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const scrollToTabs = () => {
    const el = document.getElementById('teknik-ozellikler');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Breadcrumb (Gidiş Yolu) Navigation */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-milwaukee transition">
          {t('Anasayfa')}
        </Link>
        <span className="text-slate-400">›</span>
        <Link
          href={`/category?category=${encodeURIComponent(product.category)}`}
          className="hover:text-milwaukee transition"
        >
          {t(product.category)}
        </Link>
        <span className="text-slate-400">›</span>
        <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-2xl animate-fade-in flex items-center gap-2">
          ✓ {toastMsg}
        </div>
      )}

      {/* 2. Main Product Showcase Box */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-6">
            <div className="relative h-80 sm:h-[440px] w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-150 p-6 flex items-center justify-center">
              <Image
                src={product.image || 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                className="rounded-2xl transition duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="space-y-6 lg:col-span-6">
            {/* Title & Model */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
                <p>
                  {t('Ürün Kodu')} : <span className="text-slate-900 font-mono font-bold">T{product.id.replace(/[^0-9]/g, '') || '4933464713'}</span>
                </p>
                <p>
                  {t('Model')} : <span className="text-slate-900 font-bold">{product.id}</span>
                </p>
              </div>
            </div>

            {/* Price & Discount Section */}
            <div className="space-y-2 rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {oldPriceFormatted}
                </span>
                <span className="rounded-md bg-black px-2.5 py-1 text-[11px] font-black uppercase text-white tracking-wider">
                  %15 İNDİRİMLİ
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {product.price}
                </span>
                <span className="text-xs font-medium text-slate-500">{t('KDV dahildir.')}</span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-bold uppercase text-slate-500 mr-4">ADET</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md transition ${
                  added ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-milwaukee hover:bg-red-600'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> {t('SEPETE EKLENDİ')}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" /> {t('SEPETE EKLE')} +
                  </>
                )}
              </button>
            </div>

            {/* Highlights (Öne Çıkan Bilgiler) */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-900">{t('Öne Çıkan Bilgiler')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {product.description || 'Milwaukee ağır hizmet profesyonel el aletleri serisi; kömürsüz motor teknolojisi ve uzun çalışma ömrü sunar.'}
              </p>
              <button
                type="button"
                onClick={scrollToTabs}
                className="text-xs font-bold text-milwaukee hover:underline"
              >
                {t('Devamı...')}
              </button>
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setFavoriteAdded(!favoriteAdded);
                  handleActionToast(favoriteAdded ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
                }}
                className="flex items-center gap-1.5 hover:text-milwaukee transition"
              >
                <Heart className={`h-4 w-4 ${favoriteAdded ? 'fill-milwaukee text-milwaukee' : 'text-slate-400'}`} />
                {t('Listeye Ekle')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    handleActionToast('Ürün linki kopyalandı');
                  }
                }}
                className="flex items-center gap-1.5 hover:text-milwaukee transition"
              >
                <Share2 className="h-4 w-4 text-slate-400" />
                {t('Tavsiye Et')}
              </button>
              <button
                type="button"
                onClick={scrollToTabs}
                className="flex items-center gap-1.5 hover:text-milwaukee transition"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                {t('Yorum Yap')}
              </button>
              <button
                type="button"
                onClick={() => handleActionToast('Fiyat alarmı başarıyla kuruldu')}
                className="flex items-center gap-1.5 hover:text-milwaukee transition"
              >
                <Bell className="h-4 w-4 text-slate-400" />
                {t('Fiyat Alarmı')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Specifications & Reviews Tabs */}
      <ProductDetailTabs product={product} />
    </div>
  );
}
