'use client';

import { useState } from 'react';
import type { Product } from '../data/products';

const tabs = ['Teknik Özellikler', 'Garanti & Yetkili Servis'] as const;

export default function ProductDetailTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tabs[0]);

  return (
    <section id="teknik-ozellikler" className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
              activeTab === tab
                ? 'border-milwaukee bg-milwaukee text-black'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-milwaukee/30 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
        {activeTab === 'Teknik Özellikler' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Voltaj</p>
              <p className="mt-3 text-lg font-semibold text-white">{product.voltage}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Motor Tipi</p>
              <p className="mt-3 text-lg font-semibold text-white">{product.motorType}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Akü Kapasitesi</p>
              <p className="mt-3 text-lg font-semibold text-white">{product.batteryCapacity} Ah</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Garanti Süresi</p>
              <p className="mt-3 text-lg font-semibold text-white">{product.warranty}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stok Durumu</p>
              <p className="mt-3 text-lg font-semibold text-white">{product.stockStatus}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white">Garanti ve Yetkili Servis</h2>
            <p className="text-sm leading-7 text-slate-300">
              {product.warranty} kapsamında Milwaukee ürünlerinde yetkili servis garantisi mevcuttur. Orijinal yedek parça, uzman teknik servis ve hızlı destek ağımızla işinizi aksatmadan devam ettirin.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• Yetkili servislerimizde orijinal parça kullanımı</li>
              <li>• Garanti kapsamındaki onarım ve bakım desteği</li>
              <li>• Türkiye genelinde uzman Milwaukee servisi</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
