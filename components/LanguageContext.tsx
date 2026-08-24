'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Language = 'tr' | 'en';

const translations: Record<string, Record<Language, string>> = {
  // Header
  'Kategoriler': { tr: 'Kategoriler', en: 'Categories' },
  'Ürün, marka veya model ara': { tr: 'Ürün, marka veya model ara', en: 'Search product, brand or model' },
  'Ara': { tr: 'Ara', en: 'Search' },
  'Kapat': { tr: 'Kapat', en: 'Close' },
  'Sepeti aç': { tr: 'Sepeti aç', en: 'Open cart' },
  'Aramayı aç': { tr: 'Aramayı aç', en: 'Open search' },
  'Akülü Aletler': { tr: 'Akülü Aletler', en: 'Cordless Tools' },
  'El Aletleri': { tr: 'El Aletleri', en: 'Hand Tools' },
  'İş Güvenliği': { tr: 'İş Güvenliği', en: 'Safety Equipment' },
  'Aksesuar': { tr: 'Aksesuar', en: 'Accessories' },

  // Footer
  'Hakkımızda': { tr: 'Hakkımızda', en: 'About Us' },
  'İletişim': { tr: 'İletişim', en: 'Contact' },
  'Destek': { tr: 'Destek', en: 'Support' },
  'Kariyer': { tr: 'Kariyer', en: 'Careers' },
  'Yardım & Destek': { tr: 'Yardım & Destek', en: 'Help & Support' },
  'Kurumsal': { tr: 'Kurumsal', en: 'Corporate' },
  'Bülten': { tr: 'Bülten', en: 'Newsletter' },
  'E-posta adresiniz': { tr: 'E-posta adresiniz', en: 'Your email address' },
  'Abone ol': { tr: 'Abone ol', en: 'Subscribe' },
  'Güvenli alışveriş': { tr: 'Güvenli alışveriş', en: 'Secure shopping' },
  '7/24 destek': { tr: '7/24 destek', en: '24/7 support' },
  'Gizlilik Politikası': { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
  'Kullanım Şartları': { tr: 'Kullanım Şartları', en: 'Terms of Use' },
  'KVKK Aydınlatma Metni': { tr: 'KVKK Aydınlatma Metni', en: 'KVKK Disclosure' },
  'Tüm hakları saklıdır.': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },
  'Endüstriyel aletler ve profesyonel ekipmanlarla işinizde fark yaratın. Güvenilir marka deneyimi ve yüksek performans için tasarlandı.': {
    tr: 'Endüstriyel aletler ve profesyonel ekipmanlarla işinizde fark yaratın. Güvenilir marka deneyimi ve yüksek performans için tasarlandı.',
    en: 'Make a difference with industrial tools and professional equipment. Designed for reliable brand experience and high performance.'
  },
  'Her ay yeni ürünler, promosyonlar ve teknik içerikler doğrudan e-posta kutunuza gelsin.': {
    tr: 'Her ay yeni ürünler, promosyonlar ve teknik içerikler doğrudan e-posta kutunuza gelsin.',
    en: 'Get new products, promotions and technical content delivered to your inbox every month.'
  },

  // Home page
  'Endüstriyel Çözümler': { tr: 'Endüstriyel Çözümler', en: 'Industrial Solutions' },
  'Milwaukee ile isinizde güven ve güç birlesiyor.': { tr: 'Milwaukee ile isinizde güven ve güç birlesiyor.', en: 'Trust and power come together with Milwaukee.' },
  'Insaat firmalari ve büyük ölçekli projeler için özel fiyatlandirma, kurumsal fatura ve öncelikli teknik destek sunuyoruz.': {
    tr: 'Insaat firmalari ve büyük ölçekli projeler için özel fiyatlandirma, kurumsal fatura ve öncelikli teknik destek sunuyoruz.',
    en: 'We offer special pricing, corporate invoicing and priority technical support for construction companies and large-scale projects.'
  },
  'Ürünlere Göz At': { tr: 'Ürünlere Göz At', en: 'Browse Products' },
  'Kurumsal Teklif Alin': { tr: 'Kurumsal Teklif Alin', en: 'Get Corporate Quote' },
  'Proje çözümü': { tr: 'Proje çözümü', en: 'Project solution' },
  'Güvenilir Milwaukee ekipmanlari, hizlandirilmis lojistik ve kurumsal bütçe planlamasiyla isinizi büyütün.': {
    tr: 'Güvenilir Milwaukee ekipmanlari, hizlandirilmis lojistik ve kurumsal bütçe planlamasiyla isinizi büyütün.',
    en: 'Grow your business with reliable Milwaukee equipment, accelerated logistics and corporate budget planning.'
  },
  'Üstün performans özellikleri': { tr: 'Üstün performans özellikleri', en: 'Superior performance features' },
  'Hizli teslimat': { tr: 'Hizli teslimat', en: 'Fast delivery' },
  'Türkiye çapinda hizli ve güvenilir lojistik.': { tr: 'Türkiye çapinda hizli ve güvenilir lojistik.', en: 'Fast and reliable logistics across Turkey.' },
  'Sertifikali ekipman': { tr: 'Sertifikali ekipman', en: 'Certified equipment' },
  'Endüstriyel kalite ve dayaniklilik garantisi.': { tr: 'Endüstriyel kalite ve dayaniklilik garantisi.', en: 'Industrial quality and durability guarantee.' },
  'Kurumsal destek': { tr: 'Kurumsal destek', en: 'Corporate support' },
  'Uzman satis ve teknik destek ekibimiz yaninizda.': { tr: 'Uzman satis ve teknik destek ekibimiz yaninizda.', en: 'Our expert sales and technical support team is with you.' },
  'Öne çikan ürünler': { tr: 'Öne çikan ürünler', en: 'Featured products' },
  'Sektörünüz için seçtiklerimiz': { tr: 'Sektörünüz için seçtiklerimiz', en: 'Our picks for your industry' },
  'Stokta': { tr: 'Stokta', en: 'In Stock' },
  'Stokta Var': { tr: 'Stokta Var', en: 'In Stock' },
  'Kritik Stok': { tr: 'Kritik Stok', en: 'Low Stock' },
  'Tükendi': { tr: 'Stok Yok', en: 'Out of Stock' },
  'Yüksek tork, dayanikli yapi ve profesyonel kullanim için optimize edildi.': {
    tr: 'Yüksek tork, dayanikli yapi ve profesyonel kullanim için optimize edildi.',
    en: 'Optimized for high torque, durable construction and professional use.'
  },
  'Kategori seçin': { tr: 'Kategori seçin', en: 'Select category' },
  'Kapsamli Milwaukee ürün gamimizda hizlica gezin.': { tr: 'Kapsamli Milwaukee ürün gamimizda hizlica gezin.', en: 'Quickly browse our comprehensive Milwaukee product range.' },
  'Aramayi hizlandir': { tr: 'Aramayi hizlandir', en: 'Speed up your search' },
  'Ihtiyaciniz olan ürünü dogrudan bulun.': { tr: 'Ihtiyaciniz olan ürünü dogrudan bulun.', en: 'Find the product you need directly.' },
  'Sayın': { tr: 'Sayın', en: 'Dear' },
  "Milwaukee'ye Hoş Geldiniz": { tr: "Milwaukee'ye Hoş Geldiniz", en: "Welcome to Milwaukee" },
  'Yetkili Pro Mağazası': { tr: 'Yetkili Pro Mağazası', en: 'Authorized Pro Store' },
  'Türkiye Geneli Hızlı Teslimat & Orijinal Ürün Garantisi': {
    tr: 'Türkiye Geneli Hızlı Teslimat & Orijinal Ürün Garantisi',
    en: 'Fast Delivery Across Turkey & Genuine Product Guarantee',
  },
  // Destek page
  'Yardım Konuları': { tr: 'Yardım Konuları', en: 'Help Topics' },
  'Anasayfa': { tr: 'Anasayfa', en: 'Home' },
  'Ürünler': { tr: 'Ürünler', en: 'Products' },
  'Siparişler': { tr: 'Siparişler', en: 'Orders' },
  'İade': { tr: 'İade', en: 'Returns' },
  'Kargo ve Teslimat': { tr: 'Kargo ve Teslimat', en: 'Shipping & Delivery' },
  'Hesabım': { tr: 'Hesabım', en: 'My Account' },
  'Sıkça Sorulan Sorular': { tr: 'Sıkça Sorulan Sorular', en: 'Frequently Asked Questions' },
  'M18 FUEL™ Akülü Matkap': { tr: 'M18 FUEL™ Akülü Matkap', en: 'M18 FUEL™ Cordless Drill' },
  'M12 Çift Akülü Vidalama': { tr: 'M12 Çift Akülü Vidalama', en: 'M12 Dual Cordless Screwdriver' },
  'Kirmizi Endüstriyel Torque Anahtari': { tr: 'Kirmizi Endüstriyel Torque Anahtari', en: 'Red Industrial Torque Wrench' },
  'Boya ve Temizlik': { tr: 'Boya ve Temizlik', en: 'Paint & Cleaning' },
  'Yedek Parçalar': { tr: 'Yedek Parçalar', en: 'Spare Parts' },
  'Ürün adı, kategori veya model ara': { tr: 'Ürün adı, kategori veya model ara', en: 'Search product name, category or model' },
  'En çok satılan Milwaukee aletler': { tr: 'En çok satılan Milwaukee aletler', en: 'Best selling Milwaukee tools' },
  'Yeni gelen profesyonel ekipmanlar': { tr: 'Yeni gelen profesyonel ekipmanlar', en: 'New professional equipment' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  const t = useCallback(
    (key: string) => {
      return translations[key]?.[language] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
