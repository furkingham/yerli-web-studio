"use client";

import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import CampaignBanner from '../components/CampaignBanner';
import { ShoppingBag, ShieldCheck, Building, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { products } from '../data/products';

const heroBackgroundImage = 'https://placehold.co/1800x800/1a1a1a/db0000?text=Milwaukee+Heavy+Duty';

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { title: t('Hizli teslimat'), description: t('Türkiye çapinda hizli ve güvenilir lojistik.'), icon: ShoppingBag },
    { title: t('Sertifikali ekipman'), description: t('Endüstriyel kalite ve dayaniklilik garantisi.'), icon: ShieldCheck },
    { title: t('Kurumsal destek'), description: t('Uzman satis ve teknik destek ekibimiz yaninizda.'), icon: Building },
  ];

  return (
    <div className="space-y-8">
      <CampaignBanner />

      {/* Hero Banner */}
      <section className="relative isolate overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950 px-6 py-6 shadow-industrial lg:px-10 lg:py-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-80">
            <Image
              src={heroBackgroundImage}
              alt="Milwaukee Atölye"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              className="scale-105 transform object-cover blur-[2px] transition duration-700 hover:scale-100"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-12">
            <div className="max-w-4xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.25em] text-red-500 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Heavy Duty Ekipmanlar
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Milwaukee ile işinizde <span className="text-red-500">güven</span> ve <span className="text-red-500">güç</span> bir arada
              </h1>
              <p className="max-w-2xl text-xs font-normal leading-relaxed text-slate-300 sm:text-sm">
                Sanayi ve atölye operasyonlarınız için yüksek performanslı akülü el aletleri ve servis garantili aksesuarlar.
              </p>

              <div className="grid gap-3 pt-3 sm:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/40 p-3 backdrop-blur-xl transition duration-300 hover:border-milwaukee/40 hover:bg-white/5">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-milwaukee ring-1 ring-white/5">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1.5 text-xs leading-5 text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Search Banner */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-milwaukee">Hızlı Arama & Filtreleme</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('Aramayı Hızlandır')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('İhtiyacınız olan profesyonel Milwaukee ürün veya parça kodunu doğrudan bulun.')}</p>
          </div>
          <div className="w-full lg:max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Expansive Featured Products (Full Width) */}
      <section className="rounded-[32px] bg-white p-6 sm:p-8 shadow-[0_15px_45px_rgba(219,0,0,0.12)] border-2 border-milwaukee space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-milwaukee px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm">
              🔥 {t('EN ÇOK SATANLAR')}
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{t('Sektörünüz İçin Seçtiklerimiz')}</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {t('Yüksek tork, dayanıklı gövde ve profesyonel şantiye kullanımı için optimize edildi.')}
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-milwaukee"
          >
            {t('Tüm Kataloğu İncele')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <Link 
              key={product.id} 
              href={`/urun/${product.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/50 p-5 transition duration-200 hover:-translate-y-1 hover:border-milwaukee hover:bg-white hover:shadow-xl cursor-pointer"
            >
              <div className="space-y-4">
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-white border border-slate-150 p-3 flex items-center justify-center">
                  <Image
                    src={product.image || 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    className="rounded-xl transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t(product.category)}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 5.0
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-milwaukee transition line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {t(product.description || 'Milwaukee endüstriyel güç ve orijinal garanti güvencesiyle.')}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-150 pt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fiyat</span>
                  <p className="text-lg font-black text-milwaukee">{product.price}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-xl bg-milwaukee/10 px-3.5 py-2 text-xs font-bold text-milwaukee uppercase tracking-wider group-hover:bg-milwaukee group-hover:text-white transition">
                  İncele →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
