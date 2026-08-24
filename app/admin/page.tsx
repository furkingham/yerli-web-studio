'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../../lib/auth';
import {
  getAdminProducts,
  saveAdminProducts,
  getAdminCampaigns,
  saveAdminCampaigns,
  isAdminUser,
  generateSlug,
  type Campaign,
} from '../../lib/admin';
import type { Product } from '../../data/products';
import { useLanguage } from '../../components/LanguageContext';

const categories = ['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'];
const voltages = ['12V', '18V', '24V'];
const motorTypes = ['Kömürsüz', 'Kömürlü'];

type ProductForm = Omit<Product, 'id'>;

const initialProductForm: ProductForm = {
  name: '',
  slug: '',
  category: 'Akülü Aletler',
  price: '0 TL',
  voltage: '',
  motorType: '',
  batteryCapacity: '',
  warranty: '',
  stockStatus: 'Stokta Var',
  stockQuantity: 1,
  description: '',
  image: 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee',
};

const initialCampaignForm = {
  name: 'Milwaukee Özel Kampanya',
  code: 'MILWAUKEE20',
  discount: 20,
  category: 'Akülü Aletler',
  active: true,
  banner: 'Milwaukee ile profesyonel avantajlar sizi bekliyor. Kategoriye özel indirim kodunu kullanın.',
};

const calculateStockStatus = (quantity: number): 'Stokta Var' | 'Kritik Stok' | 'Tükendi' => {
  if (quantity <= 0) return 'Tükendi';
  if (quantity <= 10) return 'Kritik Stok';
  return 'Stokta Var';
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<ProductForm>(initialProductForm);
  const [newCampaign, setNewCampaign] = useState(initialCampaignForm);
  const { t } = useLanguage();

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAdminUser(user)) {
      window.location.href = '/auth';
      return;
    }

    setAuthorized(true);
    setProducts(getAdminProducts());
    setCampaigns(getAdminCampaigns());
  }, []);

  const persistProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    saveAdminProducts(nextProducts);
  };

  const persistCampaigns = (nextCampaigns: Campaign[]) => {
    setCampaigns(nextCampaigns);
    saveAdminCampaigns(nextCampaigns);
  };

  const handleProductFieldChange = (id: string, field: keyof Product, value: string | number) => {
    persistProducts(
      products.map((product) => {
        if (product.id === id) {
          const updated = {
            ...product,
            [field]: value,
          };
          if (field === 'stockQuantity') {
            updated.stockStatus = calculateStockStatus(Number(value));
          }
          return updated;
        }
        return product;
      }),
    );
  };

  const handleDeleteProduct = (id: string) => {
    persistProducts(products.filter((product) => product.id !== id));
    setMessage('Ürün başarıyla silindi.');
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const product: Product = {
      ...newProduct,
      id: `PRD-${Date.now()}`,
      slug: newProduct.slug.trim() ? newProduct.slug.trim() : generateSlug(newProduct.name),
      stockStatus: calculateStockStatus(newProduct.stockQuantity),
    };

    persistProducts([product, ...products]);
    setNewProduct(initialProductForm);
    setMessage('Yeni ürün eklendi.');
  };

  const handleAddCampaign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const campaign: Campaign = {
      id: `CMP-${Date.now()}`,
      ...newCampaign,
    };

    persistCampaigns([campaign, ...campaigns]);
    setNewCampaign(initialCampaignForm);
    setMessage('Kampanya kaydedildi.');
  };

  const activeCampaign = useMemo(() => campaigns.find((campaign) => campaign.active), [campaigns]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Admin Paneli</p>
            <h1 className="text-3xl font-semibold text-slate-900">Yetkili Yönetim Alanı</h1>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 font-medium">
            Yöneticiler için ürün, stok ve kampanya kontrolü.
          </div>
        </div>
      </div>

      {message && <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700 font-semibold">{message}</div>}

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Ürün Listeleme</h2>
              <p className="mt-2 text-sm text-slate-500">Bütün ürünleri tablo halinde görüntüle ve stok bilgilerini hızla güncelle.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 font-semibold">Toplam ürün: {products.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.24em] text-slate-600">
                  <th className="px-4 py-3 rounded-l-2xl">Ürün</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Stok Adedi</th>
                  <th className="px-4 py-3">Stok Durumu</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 rounded-r-2xl">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{product.slug}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-slate-500">
                        <span>Voltaj: {product.voltage || <span className="text-slate-400 italic">(opsiyonel)</span>}</span>
                        <span>Motor: {product.motorType ? t(product.motorType) : <span className="text-slate-400 italic">(opsiyonel)</span>}</span>
                        <span>Akü: {product.batteryCapacity ? `${product.batteryCapacity} Ah` : <span className="text-slate-400 italic">(opsiyonel)</span>}</span>
                        <span>Garanti: {product.warranty || <span className="text-slate-400 italic">(opsiyonel)</span>}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={product.price}
                        onChange={(event) => handleProductFieldChange(product.id, 'price', event.target.value)}
                        className="w-28 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-milwaukee"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min={0}
                        value={product.stockQuantity}
                        onChange={(event) => handleProductFieldChange(product.id, 'stockQuantity', Number(event.target.value))}
                        className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-milwaukee"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                        product.stockStatus === 'Stokta Var' ? 'bg-emerald-100 text-emerald-800' :
                        product.stockStatus === 'Kritik Stok' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {t(product.stockStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{product.category}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-slate-900">Yeni Ürün Ekle</h2>
            <form onSubmit={handleAddProduct} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  Ürün Adı
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                  <span>SEO Slug <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                  <input
                    type="text"
                    value={newProduct.slug}
                    onChange={(event) => setNewProduct({ ...newProduct, slug: event.target.value })}
                    placeholder="milwaukee-m18-fuel-matkap"
                    className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  Fiyat
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  Kategori
                  <select
                    value={newProduct.category}
                    onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-white text-slate-900">
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                  <span>Voltaj <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                  <select
                    value={newProduct.voltage}
                    onChange={(event) => setNewProduct({ ...newProduct, voltage: event.target.value as Product['voltage'] })}
                    className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  >
                    <option value="">Seçilmedi</option>
                    {voltages.map((voltage) => (
                      <option key={voltage} value={voltage} className="bg-white text-slate-900">
                        {voltage}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                  <span>Motor Tipi <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                  <select
                    value={newProduct.motorType}
                    onChange={(event) => setNewProduct({ ...newProduct, motorType: event.target.value as Product['motorType'] })}
                    className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  >
                    <option value="">Seçilmedi</option>
                    {motorTypes.map((motor) => (
                      <option key={motor} value={motor} className="bg-white text-slate-900">
                        {motor}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                  <span>Akü Kapasitesi (Ah) <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                  <input
                    type="number"
                    min={0}
                    value={newProduct.batteryCapacity}
                    onChange={(event) => setNewProduct({ ...newProduct, batteryCapacity: event.target.value === '' ? '' : Number(event.target.value) })}
                    className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                  <span>Garanti <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                  <input
                    type="text"
                    value={newProduct.warranty}
                    onChange={(event) => setNewProduct({ ...newProduct, warranty: event.target.value })}
                    className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  Stok Adedi
                  <input
                    type="number"
                    min={0}
                    value={newProduct.stockQuantity}
                    onChange={(event) => setNewProduct({ ...newProduct, stockQuantity: Number(event.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
                <div className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col justify-end">
                  <span className="text-xs text-slate-400 font-medium italic mb-2">Stok durumu adete göre otomatik belirlenir.</span>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-700">
                    Otomatik Durum: <span className="font-bold text-milwaukee">{t(calculateStockStatus(newProduct.stockQuantity))}</span>
                  </div>
                </div>
              </div>
              <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                <span>Ürün Açıklaması <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                <textarea
                  value={newProduct.description}
                  onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
                  rows={4}
                  className="w-full mt-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600 font-semibold flex flex-col">
                <span>Görsel URL <span className="text-xs text-slate-400 font-normal italic">(opsiyonel)</span></span>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(event) => setNewProduct({ ...newProduct, image: event.target.value })}
                  className="w-full mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                />
              </label>
              <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow-md">
                Ürünü Ekle
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Kampanya Yönetimi</h2>
                <p className="mt-2 text-sm text-slate-500">Ana sayfa banner veya kategori bazlı kupon oluştur.</p>
              </div>
              <div className="rounded-full bg-milwaukee/10 px-4 py-2 text-sm uppercase tracking-[0.14em] text-milwaukee font-semibold">
                Aktif kampanya
              </div>
            </div>

            <form onSubmit={handleAddCampaign} className="mt-6 space-y-4">
              <label className="space-y-2 text-sm text-slate-600 font-semibold">
                Kampanya Adı
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(event) => setNewCampaign({ ...newCampaign, name: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  Kupon Kodu
                  <input
                    type="text"
                    value={newCampaign.code}
                    onChange={(event) => setNewCampaign({ ...newCampaign, code: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 font-semibold">
                  İndirim (%)
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newCampaign.discount}
                    onChange={(event) => setNewCampaign({ ...newCampaign, discount: Number(event.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-600 font-semibold">
                Kategori
                <select
                  value={newCampaign.category}
                  onChange={(event) => setNewCampaign({ ...newCampaign, category: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-white text-slate-900">
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-600 font-semibold">
                Banner Metni
                <textarea
                  value={newCampaign.banner}
                  onChange={(event) => setNewCampaign({ ...newCampaign, banner: event.target.value })}
                  rows={3}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee transition"
                />
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={newCampaign.active}
                  onChange={(event) => setNewCampaign({ ...newCampaign, active: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 bg-slate-50 text-milwaukee focus:ring-milwaukee"
                />
                Aktif kampanya olarak ayarla
              </label>
              <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow-md">
                Kampanya Kaydet
              </button>
            </form>

            {activeCampaign ? (
              <div className="mt-6 rounded-3xl border border-milwaukee/25 bg-milwaukee/5 p-5 text-slate-800">
                <p className="text-xs uppercase tracking-[0.18em] text-milwaukee font-bold">Aktif Kampanya</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{activeCampaign.name}</h3>
                <p className="mt-2 text-sm text-slate-700">Kodu kullan: <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-milwaukee font-semibold">{activeCampaign.code}</span></p>
                <p className="mt-2 text-sm text-slate-600 italic">"{activeCampaign.banner}"</p>
                <p className="mt-3 text-xs text-slate-500 font-medium">Kategori: {activeCampaign.category} | %{activeCampaign.discount} indirim</p>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 italic">Aktif bir kampanya bulunmuyor.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
