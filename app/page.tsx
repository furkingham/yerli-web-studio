"use client";

import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import CategoryMenu from '../components/CategoryMenu';
import CampaignBanner from '../components/CampaignBanner';
import { ShoppingBag, ShieldCheck, Building } from 'lucide-react';

const features = [
  { title: 'Hızlı teslimat', description: 'Türkiye çapında hızlı ve güvenilir lojistik.', icon: ShoppingBag },
  { title: 'Sertifikalı ekipman', description: 'Endüstriyel kalite ve dayanıklılık garantisi.', icon: ShieldCheck },
  { title: 'Kurumsal destek', description: 'Uzman satış ve teknik destek ekibimiz yanınızda.', icon: Building },
];

const products = [
  { name: 'M18 FUEL™ Akülü Matkap', price: '14.999 TL' },
  { name: 'M12 Çift Akülü Vidalama', price: '9.599 TL' },
  { name: 'Kırmızı Endüstriyel Torque Anahtarı', price: '12.299 TL' },
];

export default function HomePage() {
  const router = useRouter();

  const goToProducts = () => router.push('/urunler');
  const goToCorporateOffer = () => router.push('/kurumsal/teklif');

  return (
    <>
      <CampaignBanner />
      <section className="rounded-[28px] border border-white/10 bg-[#1c1c1c] p-6 shadow-industrial backdrop-blur-sm lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-milwaukee/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-milwaukee">
              Endüstriyel Çözümler
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Milwaukee ile işinizde güven ve güç birleşiyor.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Profesyonel kullanıcılar için tasarlanmış, dayanıklı ve performanslı ekipmanlarla üretkenliğinizi artırın.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToProducts}
                className="inline-flex items-center justify-center rounded-full bg-milwaukee px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-red-600"
              >
                Ürünlere göz at
              </button>
              <button
                type="button"
                onClick={goToCorporateOffer}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-milwaukee"
              >
                Kurumsal teklif alın
              </button>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-industrial">
            <h2 className="text-xl font-semibold text-white">Üstün performans özellikleri</h2>
            <div className="mt-6 space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
                  <div className="flex items-start gap-4">
                    <feature.icon className="h-7 w-7 text-milwaukee" />
                    <div>
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] bg-[#141414] p-6 shadow-industrial ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Öne çıkan ürünler</p>
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
                    <p className="mt-2 text-sm text-slate-300">Yüksek tork, dayanıklı yapı ve profesyonel kullanım için optimize edildi.</p>
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
            <p className="mt-3 text-sm text-slate-300">Kapsamlı Milwaukee ürün gamımızda hızlıca gezin.</p>
            <CategoryMenu />
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <h3 className="text-xl font-semibold text-white">Aramayı hızlandır</h3>
            <p className="mt-3 text-sm text-slate-300">İhtiyacınız olan ürünü doğrudan bulun.</p>
            <SearchBar />
          </div>
        </div>
      </section>
    </>
  );
}
