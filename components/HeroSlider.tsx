"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag } from 'lucide-react';
import { getAdminCampaigns, getAdminProducts, type Campaign } from '../lib/admin';
import type { Product } from '../data/products';

export default function HeroSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setProducts(getAdminProducts());
    setCampaign(getAdminCampaigns().find((item) => item.active) ?? null);
  }, []);

  const slides = useMemo(() => {
    const featured = products[0];
    const newest = products[products.length - 1];
    return [
      {
        id: 'product',
        eyebrow: 'PROFESYONEL GÜÇ',
        title: featured?.name ?? 'Milwaukee profesyonel güç serisi',
        text: featured?.description ?? 'Şantiyede yüksek performans, güvenilir dayanıklılık ve orijinal garanti.',
        image: featured?.image ?? 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee',
        href: featured ? `/urun/${featured.slug}` : '/urunler',
        action: 'Ürünü İncele',
        icon: Sparkles,
        tone: 'from-[#202020] via-[#2b2b2b] to-[#520000]',
      },
      {
        id: 'campaign',
        eyebrow: 'SINIRLI SÜRELİ FIRSAT',
        title: campaign?.name ?? 'Profesyonellere özel avantajlar',
        text: campaign?.banner ?? 'Seçili Milwaukee ürünlerinde avantajlı fiyatları kaçırmayın.',
        image: 'https://placehold.co/800x800/db0000/ffffff?text=Kampanya',
        href: '/category',
        action: campaign?.code ? `Kodu Kullan: ${campaign.code}` : 'Kampanyaları Gör',
        icon: Tag,
        tone: 'from-[#db0000] via-[#b30000] to-[#620000]',
      },
      {
        id: 'new',
        eyebrow: 'YENİ ÜRÜNLER',
        title: newest?.name ?? 'Yeni nesil el aletleri',
        text: newest?.description ?? 'Yeni ürünleri keşfedin, işinizi hızlandıran çözümlerle tanışın.',
        image: newest?.image ?? 'https://placehold.co/800x800/1a1a1a/ffffff?text=Yeni+Ürün',
        href: newest ? `/urun/${newest.slug}` : '/urunler',
        action: 'Yeni Ürünleri Gör',
        icon: Sparkles,
        tone: 'from-[#30343a] via-[#1a1a1a] to-[#111111]',
      },
    ];
  }, [campaign, products]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[active] ?? slides[0];
  const Icon = slide.icon;

  const move = (direction: 1 | -1) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="relative isolate min-h-[330px] overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-[0_18px_50px_rgba(26,26,26,0.22)] sm:min-h-[390px] lg:min-h-[430px]"
      aria-label="Öne çıkan ürünler ve kampanyalar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${slide.tone} transition-colors duration-500`} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_45%,rgba(255,255,255,0.16),transparent_32%)]" />
      <div className="absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full border-[32px] border-white/5" />
      <div className="absolute -bottom-32 right-24 -z-10 h-64 w-64 rounded-full border-[22px] border-white/5" />

      <div className="mx-auto grid min-h-[330px] max-w-screen-2xl grid-cols-1 items-center gap-5 px-6 py-8 sm:min-h-[390px] sm:px-10 lg:min-h-[430px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-14">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white/85">
            <Icon className="h-3.5 w-3.5" />
            {slide.eyebrow}
          </div>
          <h1 className="max-w-lg text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">{slide.text}</p>
          <Link
            href={slide.href}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
          >
            {slide.action} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative hidden h-full min-h-[230px] items-center justify-center lg:flex">
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            width={460}
            height={460}
            className="relative max-h-[330px] w-auto max-w-full object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.32)]"
            priority={active === 0}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between sm:left-10 sm:right-10 lg:left-14 lg:right-14">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slaytları">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${index === active ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
              aria-label={`${index + 1}. slayta git`}
              aria-selected={index === active}
              role="tab"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white transition hover:bg-white hover:text-slate-900" aria-label="Önceki slayt">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => move(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white transition hover:bg-white hover:text-slate-900" aria-label="Sonraki slayt">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
