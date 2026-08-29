'use client';

import { useMemo, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, updateUserAddress, registerGoogleUser, type AuthUser, type Order } from '../../lib/auth';
import Link from 'next/link';
import { MapPin, Truck, Star } from 'lucide-react';
import CargoTrackerModal from '../../components/CargoTrackerModal';
import ReviewModal from '../../components/ReviewModal';
import { useSession, signOut } from 'next-auth/react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Detailed address states
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [doorNo, setDoorNo] = useState('');
  const [directions, setDirections] = useState('');

  // Modals state
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [reviewingItem, setReviewingItem] = useState<{ productId: string; name: string } | null>(null);

  useEffect(() => {
    // Önce LocalStorage'dan kullanıcıyı kontrol et
    let currentUser = getCurrentUser();

    // Eğer LocalStorage'da kullanıcı yoksa ama NextAuth session varsa (Google ile giriş), senkronize et
    if (!currentUser && status === 'authenticated' && session?.user?.email) {
      currentUser = registerGoogleUser(session.user.email, session.user.name || session.user.email);
    }

    setUser(currentUser);
    if (currentUser?.address) {
      try {
        const parsed = JSON.parse(currentUser.address);
        setCity(parsed.city || '');
        setDistrict(parsed.district || '');
        setNeighborhood(parsed.neighborhood || '');
        setStreet(parsed.street || '');
        setApartment(parsed.apartment || '');
        setDoorNo(parsed.doorNo || '');
        setDirections(parsed.directions || '');
      } catch (e) {
        setStreet(currentUser.address);
      }
    }
    setMounted(true);
  }, [status, session]);

  const handleLogout = () => {
    logoutUser();
    signOut({ callbackUrl: '/' });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (
      !city.trim() ||
      !district.trim() ||
      !neighborhood.trim() ||
      !street.trim() ||
      !apartment.trim() ||
      !doorNo.trim() ||
      !directions.trim()
    ) {
      setErrorMsg('Lütfen tüm adres alanlarını doldurun (İl, İlçe, Mahalle, Cadde/Sokak, Apartman, Daire No ve Kısa Tarif zorunludur).');
      return;
    }

    const detailedAddress = JSON.stringify({
      city: city.trim(),
      district: district.trim(),
      neighborhood: neighborhood.trim(),
      street: street.trim(),
      apartment: apartment.trim(),
      doorNo: doorNo.trim(),
      directions: directions.trim(),
    });

    updateUserAddress(detailedAddress);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const favoriteCount = useMemo(() => user?.favorites?.length ?? 0, [user]);
  const orderCount = useMemo(() => user?.orders?.length ?? 0, [user]);

  if (!mounted) {
    return null;
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
    return null;
  }

  if (user.isAdmin) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Hesabım</p>
            <h1 className="text-3xl font-semibold text-slate-900">Hoş geldin, {user.firstName} {user.lastName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user.isAdmin && (
              <Link
                href="/admin"
                className="rounded-3xl bg-milwaukee px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
              >
                Yönetici Paneli
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-200"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 font-medium">
          Geçmiş siparişlerinizi, kargo teslimat süreçlerinizi, ürün değerlendirmelerinizi ve favorilerinizi buradan kolayca yönetebilirsiniz.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-3xl bg-red-500/10 p-5 text-sm font-semibold text-red-700 border border-red-500/20">
          ⚠️ {errorMsg}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-900">Hızlı Bakış</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">Siparişler</p>
              <p className="mt-3 text-3xl font-bold text-milwaukee">{orderCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">Favoriler</p>
              <p className="mt-3 text-3xl font-bold text-milwaukee">{favoriteCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Hesap Bilgileri</h2>
            <div className="mt-5 space-y-2 rounded-3xl bg-slate-50 border border-slate-100 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Ad Soyad: {user.firstName} {user.lastName}</p>
              <p className="text-slate-600">E-posta: {user.email}</p>
              <p className="text-xs text-slate-400 font-medium">Hesabınız güvenli bir şekilde saklanmaktadır.</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-150 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-5 w-5 text-milwaukee" /> Konum / Adres Bilgilerim
            </h3>
            <form onSubmit={handleSaveAddress} className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  İl
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Örn. İstanbul"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  İlçe
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Örn. Kadıköy"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  Mahalle
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Örn. Caferağa Mah."
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  Cadde / Sokak
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Örn. Moda Cad. No: 12"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  Apartman Adı / Blok
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Örn. Güneş Apt."
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                  Daire No
                  <input
                    type="text"
                    value={doorNo}
                    onChange={(e) => setDoorNo(e.target.value)}
                    placeholder="Örn. 4"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                  />
                </label>
              </div>
              <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                Kısa Adres Tarifi / Yönlendirme
                <input
                  type="text"
                  value={directions}
                  onChange={(e) => setDirections(e.target.value)}
                  placeholder="Örn. Merkez cami yanı, market karşısı"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl bg-milwaukee py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
              >
                Konumu Güncelle
              </button>
            </form>
            {addressSaved && (
              <p className="mt-2 text-sm text-emerald-600 font-semibold">✓ Konum bilgileriniz başarıyla güncellendi.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Kargo & Teslimat</p>
              <h2 className="text-2xl font-bold text-slate-900">Geçmiş Siparişlerim</h2>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            {user.orders.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Henüz siparişiniz yok.</p>
            ) : (
              user.orders.map((order) => {
                const status = order.status || 'Teslim Edildi';
                return (
                  <div key={order.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">Sipariş Kodu</p>
                        <p className="mt-1 text-lg font-bold text-slate-900 font-mono">{order.id}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white border border-slate-200 px-4 py-1.5 text-xs text-slate-600 font-semibold">
                          {order.date}
                        </span>
                        <span
                          className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                            status === 'Teslim Edildi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTrackingOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-xs"
                        >
                          <Truck className="h-3.5 w-3.5" /> Kargo Takibi
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Satın Alınan Ürünler</p>
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-slate-200/70 p-4"
                        >
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Adet: {item.quantity} | {item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setReviewingItem({ productId: item.productId, name: item.name })}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 shadow-xs"
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            Ürünü Değerlendir & Yorum Yap
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 text-sm font-bold text-slate-900">
                        <span>Toplam Tutar</span>
                        <span className="text-milwaukee text-lg font-bold">{order.total}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-900">Favorilerim</h2>
          <div className="mt-6 space-y-3">
            {user.favorites.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Henüz favori ürün eklemediniz.</p>
            ) : (
              user.favorites.map((favorite) => (
                <div key={favorite.productId} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{favorite.name}</p>
                      <p className="text-milwaukee font-semibold">{favorite.price}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Favori</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cargo Tracker Modal */}
      {activeTrackingOrder && (
        <CargoTrackerModal
          orderId={activeTrackingOrder.id}
          orderDate={activeTrackingOrder.date}
          status={activeTrackingOrder.status || 'Teslim Edildi'}
          trackingNumber={activeTrackingOrder.trackingNumber || 'MLW839201948TR'}
          cargoCompany={activeTrackingOrder.cargoCompany || 'Yurtiçi Kargo'}
          deliveryDate={activeTrackingOrder.deliveryDate}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* Review & Multi-criteria Rating Modal */}
      {reviewingItem && (
        <ReviewModal
          productId={reviewingItem.productId}
          productName={reviewingItem.name}
          userEmail={user.email}
          userName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]}
          onClose={() => setReviewingItem(null)}
        />
      )}
    </div>
  );
}
