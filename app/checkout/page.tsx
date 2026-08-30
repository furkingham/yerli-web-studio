'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../components/CartContext';
import { MapPin, ChevronDown, ChevronUp, CheckCircle, Home } from 'lucide-react';
import { saveGlobalOrder } from '../../lib/orders';
import { OrderItem, getCurrentUser, addOrderToCurrentUser, updateUserAddress } from '../../lib/auth';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [isNotTC, setIsNotTC] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [step, setStep] = useState(1);
  const [orderCode, setOrderCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');

  // User state
  const [user, setUser] = useState<any>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [savedAddressText, setSavedAddressText] = useState('');

  // Form states for new address
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.address) {
        setUseSavedAddress(true);
        try {
          const parsed = JSON.parse(currentUser.address);
          setSavedAddressText(`${parsed.neighborhood} Mah. ${parsed.street} No:${parsed.doorNo} ${parsed.district}/${parsed.city}\n${parsed.directions || ''}`);
        } catch {
          setSavedAddressText(currentUser.address);
        }
      }
    }
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Eğer yeni adres girildiyse ve kayıtlı bir kullanıcıysa, bu adresi kaydet.
    if (!useSavedAddress && user && newCity && newDistrict && newAddress) {
      const addr = JSON.stringify({
        city: newCity,
        district: newDistrict,
        neighborhood: '',
        street: newAddress,
        doorNo: '',
        directions: '',
      });
      updateUserAddress(addr);
    }

    setAddressSaved(true);
    setTimeout(() => {
      setAddressSaved(false);
      setStep(2);
    }, 1500); 
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sipariş kodunu oluştur (Örn: ORD-XYZ123)
    const code = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(code);

    const items: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    const newOrder = {
      id: code,
      date: new Date().toLocaleDateString('tr-TR'),
      total: cartTotal,
      items: items,
      status: 'Sipariş Alındı' as const,
      trackingNumber: `MLW${Math.floor(100000000 + Math.random() * 900000000)}TR`,
      cargoCompany: 'Yurtiçi Kargo'
    };

    // 1. Global siparişlere kaydet (Sipariş Takip için)
    saveGlobalOrder(newOrder);

    // 2. Eğer kullanıcı giriş yapmışsa, kendi hesabına da kaydet
    if (user) {
      addOrderToCurrentUser(newOrder);
    }

    // 3. Arka planda mail otomasyonunu tetikle
    const customerEmail = user?.email || 'Müşteri e-postası (Misafir)';
    const customerName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Misafir Kullanıcı';
    
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode: code,
        total: cartTotal,
        customerEmail,
        customerName,
        paymentMethod: paymentMethod,
        items: items
      })
    }).catch(err => console.error("Mail otomasyonu tetiklenemedi:", err));

    clearCart();
    setStep(3); // Başarı adımı
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Top Banner */}
      {!user && step !== 3 && (
        <div className="mb-8 flex items-center text-sm">
          <span className="text-slate-600">Zaten hesabınız var mı?</span>
          <Link href="/auth" className="ml-1 font-bold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-milwaukee hover:decoration-milwaukee">
            Giriş Yap
          </Link>
        </div>
      )}

      <div className={`grid gap-12 ${step === 3 ? 'max-w-4xl mx-auto' : 'lg:grid-cols-12'}`}>
        {/* Left: Form Area */}
        <div className={step === 3 ? 'space-y-6' : 'lg:col-span-8 space-y-6'}>
          
          {/* Steps */}
          {step !== 3 && (
            <div className="flex gap-4 mb-8">
              <div className={`flex items-center gap-3 rounded border px-6 py-4 flex-1 ${step === 1 ? 'border-milwaukee bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-milwaukee text-white' : 'bg-slate-300 text-slate-500'}`}>1</span>
                <span className={`font-bold text-sm ${step === 1 ? 'text-milwaukee' : 'text-slate-500'}`}>ADRES BİLGİLERİ</span>
              </div>
              <div className={`flex items-center gap-3 rounded border px-6 py-4 flex-1 ${step === 2 ? 'border-milwaukee bg-white' : 'border-slate-200 bg-transparent opacity-50'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? 'bg-milwaukee text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                <span className={`font-bold text-sm ${step === 2 ? 'text-milwaukee' : 'text-slate-500'}`}>ÖDEME BİLGİLERİ</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-milwaukee" /> TESLİMAT ADRESİ
                </div>
                {user && user.address && (
                  <button 
                    type="button" 
                    onClick={() => setUseSavedAddress(!useSavedAddress)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {useSavedAddress ? '+ Yeni Adres Gir' : 'Kayıtlı Adresimi Kullan'}
                  </button>
                )}
              </div>

              {/* Form Container */}
              <div className="rounded border border-slate-200 bg-white p-6 md:p-8">
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  
                  {useSavedAddress ? (
                    <div className="rounded-xl border-2 border-milwaukee bg-red-50/30 p-6 flex items-start gap-4 cursor-pointer">
                      <div className="mt-1">
                        <Home className="h-6 w-6 text-milwaukee" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Ev Adresim</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{savedAddressText}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Fatura Türü */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Fatura Türü</label>
                          <select className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee appearance-none">
                            <option value="bireysel">Bireysel Adres</option>
                            <option value="kurumsal">Kurumsal Adres</option>
                          </select>
                        </div>
                        
                        {/* E-Mail */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">E-Mail Adresiniz *</label>
                          <input type="email" defaultValue={user?.email} required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>

                        {/* Ad Soyad */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Ad Soyad *</label>
                          <input type="text" defaultValue={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''} required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>

                        {/* TC Kimlik */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <label className="text-xs text-slate-500">T.C. Kimlik No</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id="notTC_checkout" 
                                checked={isNotTC}
                                onChange={(e) => setIsNotTC(e.target.checked)}
                                className="rounded border-slate-300 text-milwaukee focus:ring-milwaukee" 
                              />
                              <label htmlFor="notTC_checkout" className="text-[10px] text-slate-700 cursor-pointer">T.C. Uyruklu değilim</label>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            disabled={isNotTC}
                            className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee disabled:bg-slate-50" 
                          />
                        </div>

                        {/* İl */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">İl Seçiniz *</label>
                          <input type="text" value={newCity} onChange={e => setNewCity(e.target.value)} required placeholder="Örn: İstanbul" className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>

                        {/* İlçe */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">İlçe *</label>
                          <input type="text" value={newDistrict} onChange={e => setNewDistrict(e.target.value)} required placeholder="Örn: Kadıköy" className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>
                      </div>

                      {/* Adres */}
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Açık Adres *</label>
                        <textarea value={newAddress} onChange={e => setNewAddress(e.target.value)} required rows={3} placeholder="Mahalle, sokak, no..." className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee resize-none" />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Cep Telefonu */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Cep Telefonu *</label>
                          <div className="flex">
                            <div className="flex items-center justify-center border border-r-0 border-slate-200 bg-slate-50 px-3 rounded-l">
                              <span className="text-xs font-medium text-slate-600">🇹🇷 +90</span>
                            </div>
                            <input type="tel" required className="w-full rounded-r border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2 flex items-start gap-2">
                    <input type="checkbox" id="diffAddress" className="mt-0.5 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                    <label htmlFor="diffAddress" className="text-sm text-slate-600 cursor-pointer">
                      Faturamın farklı bir adrese düzenlenmesini istiyorum
                    </label>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" className="w-full md:w-1/2 rounded bg-milwaukee px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700">
                      {useSavedAddress ? 'BU ADRESİ KULLAN' : 'ADRESİ KAYDET VE İLERLE'}
                    </button>
                    {addressSaved && (
                      <p className="text-sm text-emerald-600 font-semibold mt-2">✓ Adres bilgileriniz başarıyla kaydedildi! Ödeme adımına yönlendiriliyorsunuz...</p>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                <MapPin className="h-4 w-4 text-milwaukee" /> ÖDEME SEÇENEKLERİ
              </div>
              <div className="rounded border border-slate-200 bg-white p-6 md:p-8 space-y-6">
                
                {/* Havale / EFT Seçeneği */}
                <div 
                  className={`rounded-lg border-2 p-4 cursor-pointer transition ${paymentMethod === 'bank_transfer' ? 'border-milwaukee bg-red-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'bank_transfer'} 
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="h-4 w-4 text-milwaukee focus:ring-milwaukee cursor-pointer"
                    />
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">HAVALE / EFT</h3>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-4 border-t border-red-100 text-sm text-slate-700 space-y-3">
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                        <li>Havale Fiyatı: <strong>{cartTotal}</strong> (Kargo Ücretsiz)</li>
                        <li>Havalenizi yaparken gönderen bölümünde mutlaka <strong>{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Adınızı Soyadınızı'}</strong> kullanınız.</li>
                        <li>Aşağıdaki listeden havale göndermek istediğiniz banka hesap numarasını seçiniz.</li>
                        <li>Havale yaparken alıcı olarak mutlaka <strong>KASWA MAKİNA SAN. VE TİC. LTD. ŞTİ.</strong> belirtiniz.</li>
                        <li>Sipariş onaylandıktan sonra oluşacak "ORD..." ile başlayan Sipariş Kodunuzu havalenizin açıklama bölümünde belirtiniz.</li>
                      </ul>

                      <h4 className="font-bold text-slate-900 mt-6 mb-3 text-lg">Banka Hesaplarımız</h4>
                      <div className="space-y-3">
                        {/* Dummy IBAN 1 */}
                        <label className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-white bg-slate-50 transition">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="bankIban" defaultChecked className="text-milwaukee focus:ring-milwaukee" />
                            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">GARANTİ BANKASI</span>
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-500 break-all bg-white sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border sm:border-none border-slate-200 rounded">TR27 0006 2000 6610 0006 2959 16</span>
                        </label>
                        {/* Dummy IBAN 2 */}
                        <label className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-white bg-slate-50 transition">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="bankIban" className="text-milwaukee focus:ring-milwaukee" />
                            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">ZİRAAT BANKASI</span>
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-500 break-all bg-white sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border sm:border-none border-slate-200 rounded">TR15 0001 0022 9076 9899 4650 01</span>
                        </label>
                        {/* Dummy IBAN 3 */}
                        <label className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-white bg-slate-50 transition">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="bankIban" className="text-milwaukee focus:ring-milwaukee" />
                            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">AKBANK</span>
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-500 break-all bg-white sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 border sm:border-none border-slate-200 rounded">TR45 0004 6007 2888 8000 0703 09</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kredi Kartı Seçeneği */}
                <div 
                  className={`rounded-lg border-2 p-4 cursor-pointer transition ${paymentMethod === 'credit_card' ? 'border-milwaukee bg-red-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === 'credit_card'} 
                      onChange={() => setPaymentMethod('credit_card')}
                      className="h-4 w-4 text-milwaukee focus:ring-milwaukee cursor-pointer"
                    />
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">KREDİ KARTI</h3>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="mt-4 pt-4 border-t border-red-100">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kart Üzerindeki İsim</label>
                          <input type="text" required={paymentMethod === 'credit_card'} className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kart Numarası</label>
                          <input type="text" required={paymentMethod === 'credit_card'} placeholder="0000 0000 0000 0000" className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Son Kullanma (AA/YY)</label>
                            <input type="text" required={paymentMethod === 'credit_card'} placeholder="MM/YY" className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CVV</label>
                            <input type="text" required={paymentMethod === 'credit_card'} placeholder="123" className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-slate-400 hover:text-slate-800 underline decoration-slate-300 underline-offset-4">
                    Geri Dön
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePaymentSubmit}
                    className="md:w-1/2 rounded bg-milwaukee px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700 shadow text-center"
                  >
                    ÖDEMEYİ TAMAMLA
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="rounded border border-slate-200 bg-white p-8 md:p-12 text-center shadow-lg">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ödemeniz Başarılı Oldu!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Siparişiniz başarıyla alınmıştır. Sipariş durumunuzu aşağıdaki takip kodunu kullanarak <strong>Siparişlerim</strong> sayfasından öğrenebilirsiniz.
              </p>
              
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-8 py-6 mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SİPARİŞ KODUNUZ</p>
                <p className="text-4xl font-black text-milwaukee tracking-wider font-mono">{orderCode}</p>
              </div>

              <div>
                <Link href="/siparis-takip" className="inline-flex items-center justify-center rounded bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-800 shadow">
                  Siparişi Takip Et
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        {step !== 3 && (
          <div className="lg:col-span-4">
            <div className="rounded border border-slate-200 bg-white overflow-hidden sticky top-32">
              {/* Header */}
              <button 
                type="button" 
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between bg-white px-6 py-5 font-bold text-slate-900 border-b border-slate-100"
              >
                Sipariş Özet
                {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {summaryOpen && (
                <div className="px-6 py-4">
                  {/* Cart Items List */}
                  <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.productId} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded border border-slate-100 p-1">
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} sizes="64px" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">MILWAUKEE</div>
                            <div className="text-xs text-slate-800 line-clamp-2 leading-snug my-0.5">{item.name}</div>
                            <div className="text-[10px] text-slate-500">{item.quantity} ADET</div>
                            <div className="text-sm font-bold text-milwaukee mt-1">{item.price}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500 py-4 text-center">Sepetinizde ürün bulunmamaktadır.</div>
                    )}
                  </div>

                  {/* Discount Code */}
                  <div className="flex gap-2 mb-6">
                    <input 
                      type="text" 
                      placeholder="İndirim Kodu" 
                      className="flex-1 rounded border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-milwaukee" 
                    />
                    <button type="button" className="rounded bg-slate-400 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-500 transition">
                      Uygula
                    </button>
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Sepet Toplamı</span>
                      <span className="font-medium text-slate-900">{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Kargo Ücreti</span>
                      <span className="text-slate-500">Teslimat adresini girin</span>
                    </div>
                    <div className="pt-3 flex justify-between border-t border-slate-100">
                      <span className="font-bold text-milwaukee">Genel Toplam</span>
                      <span className="font-bold text-milwaukee text-lg">{cartTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
