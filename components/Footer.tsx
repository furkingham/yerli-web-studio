'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Youtube, Instagram, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="mt-16 w-full overflow-hidden border-t border-slate-200">
      {/* 1. Red Top Newsletter Bar */}
      <div className="bg-[#db0000] py-4 text-white">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-4 sm:flex-row lg:px-8">
          <p className="text-sm sm:text-base font-bold tracking-tight text-center sm:text-left">
            {t('Kampanya ve yeniliklerden haberdar olmak için e-bültenimize abone olun!')}
          </p>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center shadow-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('E-posta adresinizi giriniz')}
              className="w-full bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-[#1a1a1a] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black whitespace-nowrap"
            >
              {subscribed ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="h-4 w-4" /> {t('KAYDEDİLDİ')}
                </span>
              ) : (
                <>
                  {t('KAYIT OL')} <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Dark Footer Grid */}
      <div className="bg-[#202020] py-12 text-slate-300">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {/* Column 1: KATEGORİLER */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('KATEGORİLER')}
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li>
                  <Link href="/category?category=Akülü%20Aletler" className="transition hover:text-white">
                    Aküler, Şarj Cihazları ve Güç Kaynakları
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Akülü%20Aletler" className="transition hover:text-white">
                    Akülü & Elektrikli El Aletleri
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Akülü%20Aletler" className="transition hover:text-white">
                    Bahçe ve Dış Mekan Aletleri
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Akülü%20Aletler" className="transition hover:text-white">
                    Kanalizasyon ve Boru Temizliği
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Aksesuar" className="transition hover:text-white">
                    Aydınlatmalar
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=El%20Aletleri" className="transition hover:text-white">
                    Hizalama, Ölçüm ve Test Cihazları
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: KATEGORİLER */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('KATEGORİLER')}
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li>
                  <Link href="/category?category=İş%20Güvenliği" className="transition hover:text-white">
                    İş Güvenliği Ekipmanları
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=İş%20Güvenliği" className="transition hover:text-white">
                    Isıtıcılı Mont, Yelek ve Hırkalar
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Aksesuar" className="transition hover:text-white">
                    Depolama
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Aksesuar" className="transition hover:text-white">
                    Alan Temizliği
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=El%20Aletleri" className="transition hover:text-white">
                    El Aletleri
                  </Link>
                </li>
                <li>
                  <Link href="/category?category=Aksesuar" className="transition hover:text-white">
                    Aksesuarlar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: ÖNEMLİ BİLGİLER */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('ÖNEMLİ BİLGİLER')}
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Teslimat Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Üyelik Sözleşmesi
                  </Link>
                </li>
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Satış Sözleşmesi
                  </Link>
                </li>
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Garanti ve İade Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Gizlilik ve Güvenlik
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: HIZLI ERİŞİM */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('HIZLI ERİŞİM')}
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Anasayfa
                  </Link>
                </li>
                <li>
                  <Link href="/urunler" className="transition hover:text-white">
                    Yeni Ürünler
                  </Link>
                </li>
                <li>
                  <Link href="/category" className="transition hover:text-white">
                    İndirimdekiler
                  </Link>
                </li>
                <li>
                  <Link href="/destek" className="transition hover:text-white">
                    Müşteri Hizmetleri
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="transition hover:text-white">
                    Sepetim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: ÜYE */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t('ÜYE')}
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li>
                  <Link href="/auth" className="transition hover:text-white">
                    Yeni Üyelik
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="transition hover:text-white">
                    Üye Girişi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Address, Social Media, Distributor Notice & Map */}
          <div className="mt-10 border-t border-slate-700/80 pt-8 flex flex-col lg:flex-row gap-8 justify-between">
            <div className="space-y-6 lg:w-1/2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t('ADRES & İLETİŞİM')}
                </h4>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-milwaukee hover:text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-milwaukee hover:text-white"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-milwaukee hover:text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-400 font-normal leading-relaxed">
                <p>Kaswa Makina, Milwaukee markasının Antalya yetkili bayisidir.</p>
                <p>Kaswa Makina San. ve Tic. Ltd. Şti. | kaswamakina.com - Antalya / Türkiye</p>
                <p>Destek: destek@kaswamakine.com</p>
              </div>
            </div>

            {/* Map */}
            <div className="lg:w-1/2 h-48 lg:h-auto min-h-[200px] rounded-xl overflow-hidden border border-slate-700">
              <iframe 
                src="https://maps.google.com/maps?q=36.9147,30.6344&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mağaza Konumu"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
