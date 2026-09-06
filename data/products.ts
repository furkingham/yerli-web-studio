export type Voltage = '12V' | '18V' | '24V' | '';
export type MotorType = 'Kömürsüz' | 'Kömürlü' | '';
export type StockStatus = 'Stokta Var' | 'Kritik Stok' | 'Tükendi';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  basePrice?: number;
  currency?: 'TL' | 'USD' | 'EUR';
  voltage?: Voltage;
  motorType?: MotorType;
  batteryCapacity?: number | '';
  warranty?: string;
  stockStatus: StockStatus;
  stockQuantity: number;
  description?: string;
  image?: string;
}

export const categories = [
  'Akülü Aletler',
  'El Aletleri',
  'İş Güvenliği',
  'Aksesuar',
];

export const getProductBySlug = (slug: string): Product | undefined => {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  let decoded = clean;
  try {
    decoded = decodeURIComponent(slug).toLowerCase().trim();
  } catch {}

  return products.find(
    (product) =>
      product.slug.toLowerCase() === clean ||
      product.slug.toLowerCase() === decoded ||
      product.id.toLowerCase() === clean ||
      product.id.toLowerCase() === decoded
  );
};

export const getAllProductSlugs = (): string[] => products.map((product) => product.slug);

export const products: Product[] = [
  {
    id: 'FASTBACK-6IN1',
    slug: 'milwaukee-fastback-6-in-1-katlanir-bicak',
    name: 'FASTBACK™ 6 IN 1 Katlanır Bıçak',
    category: 'El Aletleri',
    price: '1.250 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 20,
    description: 'Hızlı açılır tasarım ve 6 farklı fonksiyon sunan profesyonel katlanır bıçak.',
    image: 'https://cdtmilwaukee.com/Data/Urun/773.jpg',
  },
  {
    id: 'SHOCKWAVE-33',
    slug: 'milwaukee-shockwave-33-parca-vidalama-seti',
    name: 'Shockwave™ 33 Parça Vidalama Ucu Seti',
    category: 'El Aletleri',
    price: '1.450 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 15,
    description: 'Darbeli vidalamalara dayanıklı Shockwave Impact Duty uç seti.',
    image: 'https://cdtmilwaukee.com/Data/Urun/751.jpg',
  },
  {
    id: 'DIAMOND-MAX-8',
    slug: 'milwaukee-diamond-max-8-mm-elmas-delici',
    name: 'Diamond Max™ 8 mm Elmas Delici',
    category: 'El Aletleri',
    price: '480 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 30,
    description: 'Fayans, seramik ve sert taşlar için elmas kaplamalı delici uç.',
    image: 'https://cdtmilwaukee.com/Data/Urun/765.jpg',
  },
  {
    id: 'HOLEDOZER-10',
    slug: 'milwaukee-hole-dozer-10-parca-panc-seti',
    name: 'Hole Dozer™ 10 Parça Panç Seti',
    category: 'El Aletleri',
    price: '3.200 TL',
    stockStatus: 'Kritik Stok',
    stockQuantity: 3,
    description: 'Buz sertleştirmeli dişler ile ekstra uzun ömürlü bi-metal panç seti.',
    image: 'https://cdtmilwaukee.com/Data/Urun/759.jpg',
  },
  {
    id: 'SAWZALL-BLADES',
    slug: 'milwaukee-sawzall-metal-kesme-testere-bıcagi',
    name: 'SAWZALL™ Metal Kesme Testere Bıçağı',
    category: 'El Aletleri',
    price: '350 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 50,
    description: 'Kalın metal kesimi için tasarlanmış yüksek performanslı tilki kuyruğu testere bıçağı.',
    image: 'https://cdtmilwaukee.com/Data/Urun/757.jpg',
  },
  {
    id: 'PIPE-WRENCH-14',
    slug: 'milwaukee-14-inc-aluminyum-boru-anahtari',
    name: '14" Alüminyum Boru Anahtarı',
    category: 'El Aletleri',
    price: '2.100 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 8,
    description: 'Hafif alüminyum gövdeli, yüksek kavramalı profesyonel boru anahtarı.',
    image: 'https://cdtmilwaukee.com/Data/Urun/763.jpg',
  },
  {
    id: 'MAGNETIC-TAPE-5M',
    slug: 'milwaukee-5m-manyetik-serit-metre',
    name: '5M Manyetik Şerit Metre',
    category: 'El Aletleri',
    price: '950 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 12,
    description: '27 metreye kadar kırılmaz şerit ve güçlü manyetik uç.',
    image: 'https://cdtmilwaukee.com/Data/Urun/752.jpg',
  },
  {
    id: 'V-JAW-PLIERS',
    slug: 'milwaukee-v-cene-ayarlanabilir-pense',
    name: 'V-Çene Ayarlanabilir Pense',
    category: 'El Aletleri',
    price: '1.050 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 25,
    description: 'Borular ve somunlar için maksimum kavrama sağlayan V çene tasarımı.',
    image: 'https://cdtmilwaukee.com/Data/Urun/754.jpg',
  },
  {
    id: 'SAFETY-GLASSES-CLR',
    slug: 'milwaukee-performans-is-guvenligi-gozlugu',
    name: 'Performans İş Güvenliği Gözlüğü',
    category: 'İş Güvenliği',
    price: '450 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 40,
    description: 'Çizilmeye ve buğulanmaya karşı dirençli şeffaf güvenlik gözlüğü.',
    image: 'https://cdtmilwaukee.com/Data/Urun/761.jpg',
  },
  {
    id: 'SAFETY-SHOES-S3',
    slug: 'milwaukee-s3-is-guvenligi-ayakkabisi',
    name: 'S3 İş Güvenliği Ayakkabısı',
    category: 'İş Güvenliği',
    price: '4.800 TL',
    stockStatus: 'Stokta Var',
    stockQuantity: 10,
    description: 'Kompozit burunlu, suya dayanıklı ve kaymaz tabanlı profesyonel iş ayakkabısı.',
    image: 'https://cdtmilwaukee.com/Data/Urun/762.jpg',
  },
  {
    id: 'M18-FPD',
    slug: 'milwaukee-m18-fuel-matkap',
    name: 'M18 FPD™ Akülü Matkap',
    category: 'Akülü Aletler',
    price: '14.999 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 5,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 12,
    description: 'Yüksek torklu akülü matkap, profesyonel şantiye performansı ve uzun ömürlü motor sunar.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M18+Matkap',
  },
  {
    id: 'M12-FPD',
    slug: 'milwaukee-m12-fpd-kompakt-vidalama',
    name: 'M12 FPD™ Kompakt Vidalama',
    category: 'Akülü Aletler',
    price: '9.599 TL',
    voltage: '12V',
    motorType: 'Kömürsüz',
    batteryCapacity: 4,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Kritik Stok',
    stockQuantity: 4,
    description: 'Kompakt tasarımda güçlü performans, dar alanlarda hassas kontrol sağlar.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M12+Vidalama',
  },
  {
    id: 'M18-CAG',
    slug: 'milwaukee-m18-akulu-testere',
    name: 'M18™ Akülü Testere',
    category: 'Akülü Aletler',
    price: '16.299 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 8,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 9,
    description: 'Yüksek dayanıklılığa sahip kesim performansı, şantiyede uzun süreli kullanım için ideal.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M18+Testere',
  },
  {
    id: 'M12-SOT',
    slug: 'milwaukee-m12-cift-akulu-sokucu',
    name: 'M12™ Çift Akülü Sökücü',
    category: 'El Aletleri',
    price: '6.750 TL',
    voltage: '12V',
    motorType: 'Kömürlü',
    batteryCapacity: 2,
    warranty: '2 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 14,
    description: 'Yüksek momentli el aleti; sıkıştırma ve sökme işlemlerinde verimli çözüm.',
    image: 'https://placehold.co/800x800/1a1a1a/ffffff?text=M12+Sökücü',
  },
  {
    id: 'M18-SSG',
    slug: 'milwaukee-m18-fuel-sarjli-taslama',
    name: 'M18 FUEL™ Şarjlı Taşlama',
    category: 'Akülü Aletler',
    price: '12.999 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 6,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Tükendi',
    stockQuantity: 0,
    description: 'Taşlama işlemlerinde yüksek hız ve uzun servis ömrü sağlayan profesyonel ekipman.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M18+Taşlama',
  },
  {
    id: 'M12-TORQ',
    slug: 'milwaukee-m12-akulu-tork-anahtari',
    name: 'M12™ Akülü Tork Anahtarı',
    category: 'El Aletleri',
    price: '7.999 TL',
    voltage: '12V',
    motorType: 'Kömürsüz',
    batteryCapacity: 5,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 8,
    description: 'Hassas tork ayarı ve güvenilir ölçüm ile endüstriyel montajlar için ideal.',
    image: 'https://placehold.co/800x800/1a1a1a/ffffff?text=M12+Tork',
  },
  {
    id: 'M18-PACK',
    slug: 'milwaukee-m18-aku-seti-5-ah',
    name: 'M18™ Akü Seti 5 Ah',
    category: 'Aksesuar',
    price: '4.499 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 5,
    warranty: '2 Yıl Garanti',
    stockStatus: 'Kritik Stok',
    stockQuantity: 6,
    description: 'Uzun çalışma süresi için yüksek kapasiteli Milwaukee akü paketi.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M18+Akü+5Ah',
  },
  {
    id: 'M12-GUARD',
    slug: 'milwaukee-m12-endustriyel-koruyucu-gozluk',
    name: 'M12™ Endüstriyel Koruyucu Gözlük',
    category: 'İş Güvenliği',
    price: '1.099 TL',
    voltage: '12V',
    motorType: 'Kömürlü',
    batteryCapacity: 0,
    warranty: '1 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 10,
    description: 'Uzun süreli kullanım için konforlu, darbelere dayanıklı iş güvenliği gözlüğü.',
    image: 'https://placehold.co/800x800/f59e0b/1a1a1a?text=Koruyucu+Gözlük',
  },
  {
    id: 'M18-HELM',
    slug: 'milwaukee-m18-profesyonel-kask',
    name: 'M18™ Profesyonel Kask',
    category: 'İş Güvenliği',
    price: '2.299 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 0,
    warranty: '1 Yıl Garanti',
    stockStatus: 'Stokta Var',
    stockQuantity: 7,
    description: 'Çarpma ve düşmeye karşı dayanıklı, modern tasarımlı profesyonel iş kaskı.',
    image: 'https://placehold.co/800x800/f59e0b/1a1a1a?text=Profesyonel+Kask',
  },
  {
    id: 'M18-MULTI',
    slug: 'milwaukee-m18-cok-amacli-akulu-korleyici',
    name: 'M18™ Çok Amaçlı Akülü Körleştirici',
    category: 'Akülü Aletler',
    price: '11.250 TL',
    voltage: '18V',
    motorType: 'Kömürsüz',
    batteryCapacity: 12,
    warranty: '3 Yıl Garanti',
    stockStatus: 'Kritik Stok',
    stockQuantity: 3,
    description: 'Çok yönlü uygulamalar için güçlü akülü araç; uzun süre performans sunar.',
    image: 'https://placehold.co/800x800/db0000/ffffff?text=M18+Çok+Amaçlı',
  },
];
