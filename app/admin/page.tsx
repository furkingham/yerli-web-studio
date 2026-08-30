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
import {
  LayoutDashboard,
  ClipboardList,
  ClipboardCheck,
  Users,
  Package,
  Tags,
  MessageSquare,
  CreditCard,
  RotateCcw,
  Settings,
  Menu,
  X,
  Activity
} from 'lucide-react';
import Image from 'next/image';

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

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { id: 'orders', label: 'Siparişler', icon: ClipboardList },
  { id: 'pending', label: 'Onay Bekleyenler', icon: ClipboardCheck },
  { id: 'customers', label: 'Müşteri & Destek', icon: Users },
  { id: 'products', label: 'Ürünler', icon: Package },
  { id: 'categories', label: 'Kategoriler', icon: Tags },
  { id: 'reviews', label: 'Yorumlar', icon: MessageSquare },
  { id: 'banks', label: 'Banka Hesapları', icon: CreditCard },
  { id: 'returns', label: 'İadeler', icon: RotateCcw },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false for mobile

  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<ProductForm>(initialProductForm);
  const [newCampaign, setNewCampaign] = useState(initialCampaignForm);
  
  const { t } = useLanguage();

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
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
          const updated = { ...product, [field]: value };
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
    setTimeout(() => setMessage(null), 3000);
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
    setTimeout(() => setMessage(null), 3000);
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
    setTimeout(() => setMessage(null), 3000);
  };

  const activeCampaign = useMemo(() => campaigns.find((campaign) => campaign.active), [campaigns]);

  if (!authorized) {
    return null;
  }

  const renderProductsTab = () => (
    <div className="space-y-6">
      {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700 font-semibold">{message}</div>}
      
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Ürün Listesi</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Toplam: {products.length}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left font-semibold text-slate-600">
                <th className="p-4">Ürün</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Stok Adedi</th>
                <th className="p-4">Stok Durumu</th>
                <th className="p-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={product.price}
                      onChange={(e) => handleProductFieldChange(product.id, 'price', e.target.value)}
                      className="w-24 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      min={0}
                      value={product.stockQuantity}
                      onChange={(e) => handleProductFieldChange(product.id, 'stockQuantity', Number(e.target.value))}
                      className="w-20 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      product.stockStatus === 'Stokta Var' ? 'bg-emerald-100 text-emerald-800' :
                      product.stockStatus === 'Kritik Stok' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {t(product.stockStatus)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
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

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Yeni Ürün Ekle</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı</label>
              <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fiyat</label>
              <input type="text" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
              <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Stok Adedi</label>
              <input type="number" min={0} value={newProduct.stockQuantity} onChange={(e) => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
            </div>
          </div>
          <button type="submit" className="mt-4 rounded bg-[#1e2330] px-4 py-2 font-semibold text-white hover:bg-[#2a3040]">Ürün Ekle</button>
        </form>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700 font-semibold">{message}</div>}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Kampanya Ayarları</h2>
        <form onSubmit={handleAddCampaign} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kampanya Adı</label>
            <input type="text" required value={newCampaign.name} onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kupon Kodu</label>
              <input type="text" value={newCampaign.code} onChange={(e) => setNewCampaign({...newCampaign, code: e.target.value})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">İndirim (%)</label>
              <input type="number" value={newCampaign.discount} onChange={(e) => setNewCampaign({...newCampaign, discount: Number(e.target.value)})} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Banner Metni</label>
            <textarea value={newCampaign.banner} onChange={(e) => setNewCampaign({...newCampaign, banner: e.target.value})} rows={2} className="w-full rounded border border-slate-300 p-2 outline-none focus:border-blue-500" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={newCampaign.active} onChange={(e) => setNewCampaign({...newCampaign, active: e.target.checked})} className="rounded" />
            <span className="text-sm font-semibold">Aktif kampanya</span>
          </label>
          <button type="submit" className="rounded bg-[#1e2330] px-4 py-2 font-semibold text-white hover:bg-[#2a3040]">Kaydet</button>
        </form>

        {activeCampaign && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="font-bold text-slate-900 mb-2">Şu Anki Aktif Kampanya</h3>
            <div className="rounded bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold">{activeCampaign.name}</p>
              <p className="text-sm text-slate-600">Kod: {activeCampaign.code} | İndirim: %{activeCampaign.discount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMockContent = (tabId: string) => {
    switch (tabId) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-bold mb-1">Toplam Ciro</p>
              <h3 className="text-2xl font-black text-slate-900">₺142.500</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-bold mb-1">Aktif Siparişler</p>
              <h3 className="text-2xl font-black text-slate-900">24</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-bold mb-1">Toplam Üye</p>
              <h3 className="text-2xl font-black text-slate-900">1.205</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-bold mb-1">Stok Uyarısı</p>
              <h3 className="text-2xl font-black text-red-500">3 Ürün</h3>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-bold">Sipariş No</th>
                  <th className="p-4 font-bold">Müşteri</th>
                  <th className="p-4 font-bold">Tutar</th>
                  <th className="p-4 font-bold">Durum</th>
                  <th className="p-4 font-bold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-mono font-bold text-slate-900">ORD-7492</td>
                  <td className="p-4 text-slate-600">Ahmet Yılmaz</td>
                  <td className="p-4 font-bold text-milwaukee">19.498 TL</td>
                  <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Teslim Edildi</span></td>
                  <td className="p-4 text-slate-500">20.08.2026</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-mono font-bold text-slate-900">ORD-7501</td>
                  <td className="p-4 text-slate-600">Mehmet Demir</td>
                  <td className="p-4 font-bold text-milwaukee">4.499 TL</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Kargoya Verildi</span></td>
                  <td className="p-4 text-slate-500">28.08.2026</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-mono font-bold text-slate-900">ORD-7512</td>
                  <td className="p-4 text-slate-600">Caner Çelik</td>
                  <td className="p-4 font-bold text-milwaukee">14.999 TL</td>
                  <td className="p-4"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Hazırlanıyor</span></td>
                  <td className="p-4 text-slate-500">29.08.2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Havale/EFT Onayı Bekleyen Siparişler</h3>
            <div className="border border-slate-100 rounded-lg p-4 flex justify-between items-center mb-2">
              <div>
                <p className="font-bold text-slate-900">ORD-7514 <span className="text-slate-500 font-normal ml-2">Mustafa Kaya</span></p>
                <p className="text-sm text-slate-500">Garanti Bankası - 2.500 TL</p>
              </div>
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Onayla</button>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">ORD-7515 <span className="text-slate-500 font-normal ml-2">Ali Veli</span></p>
                <p className="text-sm text-slate-500">Ziraat Bankası - 8.250 TL</p>
              </div>
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Onayla</button>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Users className="text-slate-500" /></div>
              <h4 className="font-bold text-slate-900">Ahmet Yılmaz</h4>
              <p className="text-sm text-slate-500">ahmet@example.com</p>
              <p className="text-sm font-bold text-milwaukee mt-2">Toplam 4 Sipariş</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Users className="text-slate-500" /></div>
              <h4 className="font-bold text-slate-900">Mehmet Demir</h4>
              <p className="text-sm text-slate-500">mehmet@example.com</p>
              <p className="text-sm font-bold text-milwaukee mt-2">Toplam 1 Sipariş</p>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <span className="font-bold text-slate-700">Kategori Adı</span>
               <span className="font-bold text-slate-700">Ürün Sayısı</span>
             </div>
             {['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'].map((cat, i) => (
               <div key={i} className="p-4 border-b border-slate-100 flex justify-between items-center">
                 <span className="font-bold text-slate-900">{cat}</span>
                 <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{Math.floor(Math.random() * 20) + 5} Ürün</span>
               </div>
             ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-1 mb-2">{'⭐⭐⭐⭐⭐'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
              <h4 className="font-bold text-slate-900">M18 FPD Akülü Matkap</h4>
              <p className="text-sm text-slate-600 mt-2">"Gerçekten efsane bir alet, şantiyede elim kolum oldu. Pili çok uzun süre gidiyor."</p>
              <p className="text-xs text-slate-400 mt-3">- Ahmet Y.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-1 mb-2">{'⭐⭐⭐⭐'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
              <h4 className="font-bold text-slate-900">M18 Somun Sıkma</h4>
              <p className="text-sm text-slate-600 mt-2">"Gücü inanılmaz ama biraz ağır. Yine de Milwaukee kalitesi tartışılmaz."</p>
              <p className="text-xs text-slate-400 mt-3">- Mehmet D.</p>
            </div>
          </div>
        );
      case 'banks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-milwaukee">
              <h4 className="font-bold text-slate-900 text-lg">Garanti BBVA</h4>
              <p className="text-sm text-slate-500 mt-1">Alıcı: Milwaukee Türkiye TR</p>
              <p className="text-base font-mono font-bold text-slate-700 mt-2 tracking-wide">TR12 3456 7890 1234 5678 90</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
              <h4 className="font-bold text-slate-900 text-lg">İş Bankası</h4>
              <p className="text-sm text-slate-500 mt-1">Alıcı: Milwaukee Türkiye TR</p>
              <p className="text-base font-mono font-bold text-slate-700 mt-2 tracking-wide">TR98 7654 3210 9876 5432 10</p>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="border border-slate-100 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">ORD-7450 <span className="text-red-500 font-bold ml-2">İade Talebi</span></p>
                <p className="text-sm text-slate-500">M12 Akü - Ürün kullanılmadı, yanlış sipariş.</p>
              </div>
              <button className="bg-milwaukee text-white px-4 py-2 rounded-lg text-sm font-bold">Detay</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50">
            <div className="text-center">
              <h3 className="text-xl font-bold text-milwaukee/80">Yakında</h3>
              <p className="text-milwaukee/60 mt-2 font-medium">Bu sayfa içeriği hazırlanıyor.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        } bg-[#131722] text-slate-300 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 md:relative`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-bold text-lg text-white tracking-wider">YÖNETİM MERKEZİ</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 sm:h-20 flex items-center justify-between px-2 sm:px-4 sticky top-0 z-40 overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 sm:p-2 sm:-ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={22} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="flex items-center">
                <Image
                  src="/kaswa-logo.png"
                  alt="Kaswa Makine Logo"
                  width={144}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain"
                  priority
                />
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="text-[8px] sm:text-sm font-medium text-slate-500 leading-[1.1] sm:leading-normal w-[85px] sm:w-auto">
                OPERASYON VE SİPARİŞ<br className="sm:hidden" /> YÖNETİMİ
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-1">
            <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs font-bold text-slate-500 bg-slate-50 sm:bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-100 sm:border-transparent">
              <Activity size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" />
              <span className="leading-[1.1] sm:leading-normal">CANLI<br className="sm:hidden" /> PANEL</span>
            </div>
            <a href="/" className="text-[10px] sm:text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap">Siteye Dön</a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
              {MENU_ITEMS.find(m => m.id === activeTab)?.label}
            </h1>
            
            {activeTab === 'products' && renderProductsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
            {activeTab !== 'products' && activeTab !== 'settings' && renderMockContent(activeTab)}
          </div>
        </div>
      </main>
    </div>
  );
}
