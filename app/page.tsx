"use client";

import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import CampaignBanner from '../components/CampaignBanner';
import { ShoppingBag, ShieldCheck, Building, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { products } from '../data/products';

import ProductCarousel from '../components/ProductCarousel';

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

        {/* 4 Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.slice(0, 4).map((product) => (
            <Link 
              key={product.id} 
              href={`/urun/${product.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 sm:p-5 transition duration-200 hover:-translate-y-1 hover:border-milwaukee hover:bg-white hover:shadow-xl cursor-pointer"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="relative h-28 sm:h-40 w-full overflow-hidden rounded-xl bg-white border border-slate-150 p-2 sm:p-3 flex items-center justify-center">
                  <Image
                    src={product.image || 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t(product.category)}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold text-amber-900">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> 5.0
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-milwaukee transition line-clamp-2 sm:line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                  <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {t(product.description || 'Milwaukee endüstriyel güç ve orijinal garanti güvencesiyle.')}
                  </p>
                </div>
              </div>

              <div className="mt-3 sm:mt-5 flex items-end justify-between border-t border-slate-150 pt-3 sm:pt-4">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Fiyat</span>
                  <p className="text-sm sm:text-lg font-black text-milwaukee">{product.price}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg bg-milwaukee/10 px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-milwaukee uppercase tracking-wider group-hover:bg-milwaukee group-hover:text-white transition">
                  <span className="hidden sm:inline">İncele</span> →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Carousel Section */}
      <ProductCarousel title="EL ALETİ & AKSESUAR" category="El Aletleri" />
      <ProductCarousel title="YENİ ÜRÜNLER" />

    </div>
  );
}
