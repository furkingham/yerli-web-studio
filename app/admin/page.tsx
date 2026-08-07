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
  getDefaultCampaign,
  type Campaign,
} from '../../lib/admin';
import type { Product } from '../../data/products';

const categories = ['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'];
const voltages = ['12V', '18V', '24V'];
const motorTypes = ['Kömürsüz', 'Kömürlü'];
const stockStatuses = ['Stokta Var', 'Kritik Stok', 'Tükendi'] as const;

type ProductForm = Omit<Product, 'id'>;

const initialProductForm: ProductForm = {
  name: '',
  slug: '',
  category: 'Akülü Aletler',
  price: '0 TL',
  voltage: '18V',
  motorType: 'Kömürsüz',
  batteryCapacity: 5,
  warranty: '1 Yıl Garanti',
  stockStatus: 'Stokta Var',
  stockQuantity: 1,
  description: '',
  image: 'https://images.unsplash.com/photo-1517244683842-3d9f3b6f4aa8?q=80&w=1600&auto=format&fit=crop',
};

const initialCampaignForm = {
  name: 'Milwaukee Özel Kampanya',
  code: 'MILWAUKEE20',
  discount: 20,
  category: 'Akülü Aletler',
  active: true,
  banner: 'Milwaukee ile profesyonel avantajlar sizi bekliyor. Kategoriye özel indirim kodunu kullanın.',
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<ProductForm>(initialProductForm);
  const [newCampaign, setNewCampaign] = useState(initialCampaignForm);

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
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              [field]: value,
            }
          : product,
      ),
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
      <div className="rounded-[28px] border border-white/10 bg-[#141414] p-8 shadow-industrial">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Admin Paneli</p>
            <h1 className="text-3xl font-semibold text-white">Yetkili Yönetim Alanı</h1>
          </div>
          <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">
            Yöneticiler için ürün, stok ve kampanya kontrolü.
          </div>
        </div>
      </div>

      {message && <div className="rounded-3xl bg-milwaukee/10 p-4 text-sm text-milwaukee">{message}</div>}

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Ürün Listeleme</h2>
              <p className="mt-2 text-sm text-slate-400">Bütün ürünleri tablo halinde görüntüle ve stok bilgilerini hızla güncelle.</p>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Toplam ürün: {products.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm text-slate-300">
              <thead>
                <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.24em] text-slate-400">
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Stok Adedi</th>
                  <th className="px-4 py-3">Stok Durumu</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={product.price}
                        onChange={(event) => handleProductFieldChange(product.id, 'price', event.target.value)}
                        className="w-28 rounded-2xl border border-white/10 bg-[#0f0f0f] px-3 py-2 text-white outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min={0}
                        value={product.stockQuantity}
                        onChange={(event) => handleProductFieldChange(product.id, 'stockQuantity', Number(event.target.value))}
                        className="w-24 rounded-2xl border border-white/10 bg-[#0f0f0f] px-3 py-2 text-white outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={product.stockStatus}
                        onChange={(event) => handleProductFieldChange(product.id, 'stockStatus', event.target.value)}
                        className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-3 py-2 text-white outline-none"
                      >
                        {stockStatuses.map((status) => (
                          <option key={status} value={status} className="bg-[#0f0f0f] text-white">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded-2xl bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-600/20"
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
          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <h2 className="text-2xl font-semibold text-white">Yeni Ürün Ekle</h2>
            <form onSubmit={handleAddProduct} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Ürün Adı
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  SEO Slug
                  <input
                    type="text"
                    value={newProduct.slug}
                    onChange={(event) => setNewProduct({ ...newProduct, slug: event.target.value })}
                    placeholder="milwaukee-m18-fuel-matkap"
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Fiyat
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Kategori
                  <select
                    value={newProduct.category}
                    onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-[#0f0f0f] text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Voltaj
                  <select
                    value={newProduct.voltage}
                    onChange={(event) => setNewProduct({ ...newProduct, voltage: event.target.value as Product['voltage'] })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  >
                    {voltages.map((voltage) => (
                      <option key={voltage} value={voltage} className="bg-[#0f0f0f] text-white">
                        {voltage}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Motor Tipi
                  <select
                    value={newProduct.motorType}
                    onChange={(event) => setNewProduct({ ...newProduct, motorType: event.target.value as Product['motorType'] })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  >
                    {motorTypes.map((motor) => (
                      <option key={motor} value={motor} className="bg-[#0f0f0f] text-white">
                        {motor}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Akü Kapasitesi (Ah)
                  <input
                    type="number"
                    min={0}
                    value={newProduct.batteryCapacity}
                    onChange={(event) => setNewProduct({ ...newProduct, batteryCapacity: Number(event.target.value) })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Garanti
                  <input
                    type="text"
                    value={newProduct.warranty}
                    onChange={(event) => setNewProduct({ ...newProduct, warranty: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Stok Adedi
                  <input
                    type="number"
                    min={0}
                    value={newProduct.stockQuantity}
                    onChange={(event) => setNewProduct({ ...newProduct, stockQuantity: Number(event.target.value) })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Stok Durumu
                  <select
                    value={newProduct.stockStatus}
                    onChange={(event) => setNewProduct({ ...newProduct, stockStatus: event.target.value as Product['stockStatus'] })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  >
                    {stockStatuses.map((status) => (
                      <option key={status} value={status} className="bg-[#0f0f0f] text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-300">
                Ürün Açıklaması
                <textarea
                  value={newProduct.description}
                  onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
                  rows={4}
                  className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Görsel URL
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(event) => setNewProduct({ ...newProduct, image: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                />
              </label>
              <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
                Ürünü Ekle
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Kampanya Yönetimi</h2>
                <p className="mt-2 text-sm text-slate-400">Ana sayfa banner veya kategori bazlı kupon oluştur.</p>
              </div>
              <div className="rounded-full bg-milwaukee/10 px-4 py-2 text-sm uppercase tracking-[0.14em] text-milwaukee">
                Aktif kampanya
              </div>
            </div>

            <form onSubmit={handleAddCampaign} className="mt-6 space-y-4">
              <label className="space-y-2 text-sm text-slate-300">
                Kampanya Adı
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(event) => setNewCampaign({ ...newCampaign, name: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Kupon Kodu
                  <input
                    type="text"
                    value={newCampaign.code}
                    onChange={(event) => setNewCampaign({ ...newCampaign, code: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  İndirim (%)
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newCampaign.discount}
                    onChange={(event) => setNewCampaign({ ...newCampaign, discount: Number(event.target.value) })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-300">
                Kategori
                <select
                  value={newCampaign.category}
                  onChange={(event) => setNewCampaign({ ...newCampaign, category: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-[#0f0f0f] text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Banner Metni
                <textarea
                  value={newCampaign.banner}
                  onChange={(event) => setNewCampaign({ ...newCampaign, banner: event.target.value })}
                  rows={3}
                  className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none"
                />
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={newCampaign.active}
                  onChange={(event) => setNewCampaign({ ...newCampaign, active: event.target.checked })}
                  className="h-4 w-4 rounded border-white/10 bg-[#0f0f0f] text-milwaukee"
                />
                Aktif kampanya olarak ayarla
              </label>
              <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
                Kampanya Kaydet
              </button>
            </form>

            {activeCampaign ? (
              <div className="mt-6 rounded-3xl border border-milwaukee/30 bg-milwaukee/10 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.18em] text-milwaukee">Aktif Kampanya</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{activeCampaign.name}</h3>
                <p className="mt-2 text-sm text-slate-300">Kodu kullan: {activeCampaign.code}</p>
                <p className="mt-2 text-sm text-slate-300">{activeCampaign.banner}</p>
                <p className="mt-3 text-sm text-slate-400">Kategori: {activeCampaign.category} | %{activeCampaign.discount} indirim</p>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#101010] p-5 text-sm text-slate-300">Aktif bir kampanya bulunmuyor.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
