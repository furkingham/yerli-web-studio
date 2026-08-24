'use client';

import { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, Award, Zap, Hammer } from 'lucide-react';
import type { Product } from '../data/products';
import { getProductReviews, getProductRatingSummary, type ProductReview } from '../lib/reviews';

const tabs = ['Teknik Özellikler', 'Garanti & Yetkili Servis', 'Kullanıcı Yorumları & Puanlar'] as const;

export default function ProductDetailTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tabs[0]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState({
    averageRating: 5.0,
    durabilityAvg: 5.0,
    materialAvg: 5.0,
    performanceAvg: 5.0,
    totalReviews: 0,
  });

  useEffect(() => {
    if (!product?.id) return;
    const list = getProductReviews(product.id);
    setReviews(list);
    setSummary(getProductRatingSummary(product.id));
  }, [product?.id]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="teknik-ozellikler" className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition ${
              activeTab === tab
                ? 'border-milwaukee bg-milwaukee text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-milwaukee/40 hover:bg-slate-50'
            }`}
          >
            {tab} {tab === 'Kullanıcı Yorumları & Puanlar' && reviews.length > 0 && `(${reviews.length})`}
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        {activeTab === 'Teknik Özellikler' && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {product.voltage && (
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Voltaj</p>
                <p className="mt-3 text-lg font-bold text-slate-800">{product.voltage}</p>
              </div>
            )}
            {product.motorType && (
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Motor Tipi</p>
                <p className="mt-3 text-lg font-bold text-slate-800">{product.motorType}</p>
              </div>
            )}
            {product.batteryCapacity && (
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Akü Kapasitesi</p>
                <p className="mt-3 text-lg font-bold text-slate-800">{product.batteryCapacity} Ah</p>
              </div>
            )}
            {product.warranty && (
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Garanti Süresi</p>
                <p className="mt-3 text-lg font-bold text-slate-800">{product.warranty}</p>
              </div>
            )}
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Stok Durumu</p>
              <p className="mt-3 text-lg font-bold text-slate-800">{product.stockStatus}</p>
            </div>
          </div>
        )}

        {activeTab === 'Garanti & Yetkili Servis' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-milwaukee" /> Milwaukee Yetkili Servis ve Garanti Ağı
            </h2>
            <p className="text-sm leading-7 text-slate-600 font-medium">
              {product.warranty ? `${product.warranty} kapsamında` : 'Tüm'} Milwaukee ürünleriniz orijinal yedek parça ve yetkili servis garantisi altındadır. Satış sonrası teknik destek, periyodik bakım ve sertifikalı onarım hizmetimizle işiniz kesintisiz sürer.
            </p>
            <ul className="grid gap-3 sm:grid-cols-3 pt-2 text-sm text-slate-700 font-semibold">
              <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" /> %100 Orijinal Yedek Parça
              </li>
              <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" /> Türkiye Geneli Servis Ağı
              </li>
              <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" /> Hızlı Arıza Tespiti & Onarım
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'Kullanıcı Yorumları & Puanlar' && (
          <div className="space-y-8">
            {/* Rating Statistics Dashboard */}
            <div className="grid gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 lg:grid-cols-[1fr_2fr]">
              {/* Overall Score */}
              <div className="flex flex-col items-center justify-center border-b border-slate-200/80 pb-6 lg:border-b-0 lg:border-r lg:pr-6">
                <span className="text-5xl font-black text-slate-900">
                  {summary.totalReviews > 0 ? summary.averageRating : '5.0'}
                </span>
                <div className="mt-2">{renderStars(summary.averageRating)}</div>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {summary.totalReviews > 0 ? `${summary.totalReviews} Doğrulanmış Değerlendirme` : 'Genel Puan (5 Üzerinden)'}
                </p>
              </div>

              {/* Sub-Criteria Breakdown */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 text-center shadow-xs">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-milwaukee">
                    <Hammer className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">Dayanıklılık</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{summary.durabilityAvg} / 5.0</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-milwaukee"
                      style={{ width: `${(summary.durabilityAvg / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 text-center shadow-xs">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">Materyal Kalitesi</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{summary.materialAvg} / 5.0</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(summary.materialAvg / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 text-center shadow-xs">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">Performans & Güç</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{summary.performanceAvg} / 5.0</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(summary.performanceAvg / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Müşteri Yorumları</h3>
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  Bu ürün için henüz yazılı yorum eklenmemiş. Bu ürünü satın aldıysanız Hesabım sayfanızdaki siparişlerinizden ilk yorumu siz ekleyebilirsiniz!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6 space-y-3 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-milwaukee text-white font-bold text-sm">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            {rev.userName}
                            {rev.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" /> Doğrulanmış Satın Alım
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">{rev.date}</p>
                        </div>
                      </div>
                      <div>{renderStars(rev.overallRating)}</div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{rev.comment}</p>

                    {/* Criteria tags */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-slate-600">
                      <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1">
                        Dayanıklılık: {rev.durabilityRating} / 5 ★
                      </span>
                      <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1">
                        Materyal: {rev.materialRating} / 5 ★
                      </span>
                      <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1">
                        Performans: {rev.performanceRating} / 5 ★
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
