export type Voltage = '12V' | '18V' | '24V';
export type MotorType = 'Kömürsüz' | 'Kömürlü';
export type StockStatus = 'Stokta Var' | 'Kritik Stok' | 'Tükendi';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  voltage: Voltage;
  motorType: MotorType;
  batteryCapacity: number;
  warranty: string;
  stockStatus: StockStatus;
  stockQuantity: number;
  description: string;
  image: string;
}

export const categories = [
  'Akülü Aletler',
  'El Aletleri',
  'İş Güvenliği',
  'Aksesuar',
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getAllProductSlugs = (): string[] => products.map((product) => product.slug);

export const products: Product[] = [
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
    image: 'https://images.unsplash.com/photo-1517244683842-3d9f3b6f4aa8?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581091012184-7b0a1f86c9f7?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092334498-ff86b2e4f6b7?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1611599539970-3c0b9b3b6b2b?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581093588401-7f4f1f1b6a8a?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1602524811974-3d2d7f2d4f2f?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1533658925620-9b1b5b0b6a6f?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1541534401786-3f4f1c6f6f6a?q=80&w=1600&auto=format&fit=crop',
  },
];
