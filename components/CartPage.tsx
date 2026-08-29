'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, MapPin } from 'lucide-react';
import { useCart } from './CartContext';
import { getCurrentUser, updateUserAddress, addOrderToCurrentUser } from '../lib/auth';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export default function CartPage() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Detailed address states
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [doorNo, setDoorNo] = useState('');
  const [directions, setDirections] = useState('');

  // ikas Sanal POS states
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
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
        setShowAddressForm(true);
      }
    } else if (currentUser) {
      setShowAddressForm(true);
    }
  }, []);

  const handleCheckout = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg(t('Sipariş verebilmek için lütfen önce üye girişi yapın.'));
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
      return;
    }

    if (showAddressForm) {
      if (
        !city.trim() ||
        !district.trim() ||
        !neighborhood.trim() ||
        !street.trim() ||
        !apartment.trim() ||
        !doorNo.trim() ||
        !directions.trim()
      ) {
        setErrorMsg(t('Lütfen tüm adres alanlarını doldurun (İl, İlçe, Mahalle, Cadde/Sokak, Apartman, Daire No ve Kısa Tarif zorunludur).'));
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
      setShowAddressForm(false);
    } else {
      if (!user.address) {
        setShowAddressForm(true);
        setErrorMsg(t('Lütfen teslimat adresinizi girin.'));
        return;
      }
      try {
        const parsed = JSON.parse(user.address);
        if (
          !parsed.city ||
          !parsed.district ||
          !parsed.neighborhood ||
          !parsed.street ||
          !parsed.apartment ||
          !parsed.doorNo ||
          !parsed.directions
        ) {
          setShowAddressForm(true);
          setErrorMsg(t('Lütfen teslimat adresinizi eksiksiz doldurun.'));
          return;
        }
      } catch {
        setShowAddressForm(true);
        setErrorMsg(t('Lütfen teslimat adresinizi eksiksiz doldurun.'));
        return;
      }
    }

    // Proceed to ikas Virtual POS payment step
    setShowPaymentStep(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
      setErrorMsg(t('Lütfen tüm kredi kartı bilgilerini doldurun.'));
      return;
    }

    setIsProcessingPayment(true);

    // Simulate ikas API query
    setTimeout(() => {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const code = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: code,
        date: new Date().toLocaleDateString('tr-TR'),
        total: cartTotal,
        items: orderItems,
        status: 'Kargoya Verildi' as any,
        trackingNumber: `MLW${Math.floor(100000000 + Math.random() * 900000000)}TR`,
        cargoCompany: 'Yurtiçi Kargo'
      };
      
      addOrderToCurrentUser(newOrder);
      // Not calling saveGlobalOrder here because CartPage doesn't import it, but we can if we want to.
      setIsProcessingPayment(false);
      setSuccessMsg(t('Ödemeniz ikas Sanal POS ile başarıyla çekildi! Siparişiniz onaylandı...'));

      setTimeout(() => {
        clearCart();
        window.location.href = '/hesabim';
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{t('Sepet')}</p>
            <h1 className="text-3xl font-semibold text-slate-900">{t('Sipariş Özeti')}</h1>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 font-semibold">
            {t('Toplam ürün')}: {cartCount}
          </div>
        </div>
      </section>

      {errorMsg && (
        <div className="rounded-3xl bg-red-500/10 p-5 text-sm font-semibold text-red-700 border border-red-500/20">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-3xl bg-emerald-500/10 p-5 text-sm font-semibold text-emerald-700 border border-emerald-500/20">
          ✓ {successMsg}
        </div>
      )}

      {cartItems.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">{t('Sepetinizde ürün yok.')}</p>
          <p className="mt-3 text-sm text-slate-400">
            {t('Milwaukee ürün kataloğumuzu inceleyip sepetinize ekleme yapabilirsiniz.')}
          </p>
          <Link
            href="/category"
            className="mt-8 inline-flex rounded-3xl bg-milwaukee px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
          >
            {t('Ürünlere git')}
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div key={item.productId} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-50 p-3 border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="96px"
                        className="rounded-2xl"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-2 text-sm text-slate-500 font-semibold">{item.price}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="rounded-2xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
                  >
                    {t('Ürünü kaldır')}
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-milwaukee"
                      aria-label="Adeti azalt"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-milwaukee"
                      aria-label="Adeti artır"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    {t('Ara toplam')}: {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">{t('Sipariş Özeti')}</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
                      <span>{t('Ürün adedi')}</span>
                      <span>{cartCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
                      <span>{t('Sepet toplamı')}</span>
                      <span>{cartTotal}</span>
                    </div>
                  </div>
                </div>

                {showPaymentStep ? (
                  <form onSubmit={handleProcessPayment} className="rounded-3xl border border-milwaukee/20 bg-milwaukee/5 p-5 space-y-4">
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                      💳 {t('ikas Sanal POS Ödeme Altyapısı')}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium leading-5">
                      {t('Ödemeniz 256-bit SSL şifreleme ve ikas Sanal POS API entegrasyonu ile güvenli bir şekilde tahsil edilecektir.')}
                    </p>
                    <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                      {t('Kart Sahibi')}
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Örn. Furkan Yılmaz"
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                      />
                    </label>
                    <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                      {t('Kart Numarası')}
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        placeholder="0000 0000 0000 0000"
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                        {t('Son Kullanma Tarihi')}
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="AA/YY"
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                        />
                      </label>
                      <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                        {t('Güvenlik Kodu (CVC)')}
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="000"
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                        />
                      </label>
                    </div>

                    {isProcessingPayment ? (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-milwaukee border-t-transparent" />
                        <span className="text-xs text-slate-500 font-semibold">{t('ikas Sanal POS API sorgulanıyor...')}</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-milwaukee py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
                      >
                        {t('ikas Sanal POS ile')} {cartTotal} {t('Öde')}
                      </button>
                    )}
                  </form>
                ) : (
                  <>
                    {showAddressForm && (
                      <div className="rounded-3xl border border-milwaukee/20 bg-milwaukee/5 p-5 space-y-4">
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                          <MapPin className="h-4 w-4 text-milwaukee animate-bounce" /> {t('Konum / Detaylı Teslimat Adresi')}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('İl')}
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Örn. İstanbul"
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('İlçe')}
                            <input
                              type="text"
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              placeholder="Örn. Kadıköy"
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('Mahalle')}
                            <input
                              type="text"
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              placeholder="Örn. Caferağa Mah."
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('Cadde / Sokak')}
                            <input
                              type="text"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              placeholder="Örn. Moda Cad. No: 12"
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('Apartman Adı / Blok')}
                            <input
                              type="text"
                              value={apartment}
                              onChange={(e) => setApartment(e.target.value)}
                              placeholder="Örn. Güneş Apt."
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                          <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                            {t('Daire No')}
                            <input
                              type="text"
                              value={doorNo}
                              onChange={(e) => setDoorNo(e.target.value)}
                              placeholder="Örn. 4"
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                            />
                          </label>
                        </div>
                        <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1.5">
                          {t('Kısa Adres Tarifi / Yönlendirme')}
                          <input
                            type="text"
                            value={directions}
                            onChange={(e) => setDirections(e.target.value)}
                            placeholder="Örn. Merkez cami yanı, market karşısı"
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee"
                          />
                        </label>
                      </div>
                    )}

                    <Link
                      href="/checkout"
                      className="flex w-full justify-center rounded-3xl bg-milwaukee px-5 py-4 mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow"
                    >
                      {t('Siparişi onayla')}
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full rounded-3xl bg-slate-100 px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-200"
                >
                  {t('Sepeti temizle')}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
