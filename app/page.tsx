"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import CategoryMenu from '../components/CategoryMenu';
import CampaignBanner from '../components/CampaignBanner';
import { ShoppingBag, ShieldCheck, Building } from 'lucide-react';

const features = [
  { title: 'Hizli teslimat', description: 'Türkiye çapinda hizli ve güvenilir lojistik.', icon: ShoppingBag },
  { title: 'Sertifikali ekipman', description: 'Endüstriyel kalite ve dayaniklilik garantisi.', icon: ShieldCheck },
  { title: 'Kurumsal destek', description: 'Uzman satis ve teknik destek ekibimiz yaninizda.', icon: Building },
];

const products = [
  { name: 'M18 FUEL™ Akülü Matkap', price: '14.999 TL' },
  { name: 'M12 Çift Akülü Vidalama', price: '9.599 TL' },
  { name: 'Kirmizi Endüstriyel Torque Anahtari', price: '12.299 TL' },
];

const heroBackgroundImage = 'https://images.unsplash.com/photo-1508898578281-774ac4893a08?q=80&w=1800&auto=format&fit=crop';
const heroFloating = [
  {
    label: 'M18 FUEL™ Akülü Matkap',
    image: 'https://images.unsplash.com/photo-1517244683842-3d9f3b6f4aa8?q=80&w=900&auto=format&fit=crop',
  },
  {
    label: 'M18 FUEL™ Sarjli Taslama',
    image: 'https://images.unsplash.com/photo-1611599539970-3c0b9b3b6b2b?q=80&w=900&auto=format&fit=crop',
  },
];

export default function HomePage() {
  const router = useRouter();

  const goToProducts = () => router.push('/urunler');
  const goToCorporateOffer = () => router.push('/kurumsal/teklif');

  return (
    <>
      <CampaignBanner />

      <section className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0b0b]/95 px-6 py-10 shadow-industrial lg:px-10 lg:py-14">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-80">
            <Image
              src={heroBackgroundImage}
              alt="Milwaukee endüstriyel sahne"
              fill
              priority
              className="object-cover object-center opacity-90"
            />
          </div>
          <div className="absolute inset-0 animate-hero-bg bg-[radial-gradient(circle_at_top_left,rgba(219,0,0,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)] mix-blend-screen opacity-80" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute left-[-10%] top-1/3 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-[-8%] bottom-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.95fr] lg:items-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-milwaukee/20 bg-milwaukee/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-milwaukee shadow-sm shadow-red-500/10">
              <span className="h-2.5 w-2.5 rounded-full bg-milwaukee" />
              Endüstriyel Çözümler
            </span>
            <h1 className="text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
              Milwaukee ile isinizde güven ve güç birlesiyor.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Insaat firmalari ve büyük ölçekli projeler için özel fiyatlandirma, kurumsal fatura ve öncelikli teknik destek sunuyoruz.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={goToProducts}
                className="inline-flex items-center justify-center rounded-full bg-milwaukee px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_rgba(219,0,0,0.25)] transition duration-300 hover:scale-[1.02] hover:bg-milwaukee/90"
              >
                Ürünlere Göz At
              </button>
              <button
                type="button"
                onClick={goToCorporateOffer}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Kurumsal Teklif Alin
              </button>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Proje çözümü</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Güvenilir Milwaukee ekipmanlari, hizlandirilmis lojistik ve kurumsal bütçe planlamasiyla isinizi büyütün.
              </p>
            </div>
          </div>

          <div className="relative rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-white/10">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            <div className="relative space-y-6">
              <h2 className="text-xl font-semibold text-white">Üstün performans özellikleri</h2>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-[#0b0b0b]/80 p-4 backdrop-blur-xl transition duration-300 hover:border-milwaukee/40 hover:bg-white/10">
                    <span className="grid h-12 w-12 place-items-center rounded-3xl bg-white/10 text-milwaukee shadow-sm shadow-black/20 ring-1 ring-white/10">
                      <feature.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none hidden lg:block">
          <div className="absolute right-0 top-1/2 h-[560px] w-[420px] -translate-y-1/2">
            <div className="absolute left-0 top-10 h-56 w-56 animate-float rounded-[2rem] border border-white/10 bg-[#111111]/90 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.75rem]">
                <Image src={heroFloating[0].image} alt={heroFloating[0].label} fill className="object-cover" />
              </div>
            </div>
            <div className="absolute right-8 bottom-14 h-64 w-64 animate-float-slow rounded-[2.5rem] border border-white/10 bg-[#111111]/90 p-3 shadow-[0_35px_90px_rgba(0,0,0,0.55)]">
              <div className="relative h-full w-full overflow-hidden rounded-[2.25rem]">
                <Image src={heroFloating[1].image} alt={heroFloating[1].label} fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] bg-[#141414] p-6 shadow-industrial ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Öne çikan ürünler</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Sektörünüz için seçtiklerimiz</h2>
            </div>
            <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">Stokta</span>
          </div>
          <div className="mt-8 space-y-4">
            {products.map((product) => (
              <div key={product.name} className="rounded-3xl border border-white/10 bg-[#131313] p-5 transition hover:border-milwaukee/80 hover:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">Yüksek tork, dayanikli yapi ve profesyonel kullanim için optimize edildi.</p>
                  </div>
                  <p className="text-lg font-semibold text-milwaukee">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <h3 className="text-xl font-semibold text-white">Kategori seçin</h3>
            <p className="mt-3 text-sm text-slate-300">Kapsamli Milwaukee ürün gamimizda hizlica gezin.</p>
            <CategoryMenu />
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <h3 className="text-xl font-semibold text-white">Aramayi hizlandir</h3>
            <p className="mt-3 text-sm text-slate-300">Ihtiyaciniz olan ürünü dogrudan bulun.</p>
            <SearchBar />
          </div>
        </div>
      </section>
    </>
  );
}
