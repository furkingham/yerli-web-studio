'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../components/CartContext';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [isNotTC, setIsNotTC] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Top Banner */}
      <div className="mb-8 flex items-center text-sm">
        <span className="text-slate-600">Zaten hesabınız var mı?</span>
        <Link href="/auth" className="ml-1 font-bold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-milwaukee hover:decoration-milwaukee">
          Giriş Yap
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left: Form Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Steps */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-3 rounded border border-milwaukee px-6 py-4 flex-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-milwaukee text-xs font-bold text-white">1</span>
              <span className="font-bold text-milwaukee text-sm">ADRES BİLGİLERİ</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 flex-1 opacity-50">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">2</span>
              <span className="font-bold text-slate-500 text-sm">ÖDEME BİLGİLERİ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
            <MapPin className="h-4 w-4 text-milwaukee" /> YENİ ADRES EKLE
          </div>

          {/* Form Container */}
          <div className="rounded border border-slate-200 bg-white p-6 md:p-8">
            <form className="space-y-6">
              
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
                  <input type="email" required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                </div>

                {/* Ad Soyad */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">Ad Soyad *</label>
                  <input type="text" required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
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

                {/* Ülke */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">Ülke Seçiniz *</label>
                  <select className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee appearance-none">
                    <option value="tr">Türkiye</option>
                  </select>
                </div>

                {/* İl */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">İl Seçiniz *</label>
                  <select required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee appearance-none">
                    <option value=""></option>
                    <option value="01">Adana</option>
                    <option value="06">Ankara</option>
                    <option value="07">Antalya</option>
                    <option value="34">İstanbul</option>
                    <option value="35">İzmir</option>
                  </select>
                </div>

                {/* İlçe */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">İlçe *</label>
                  <input type="text" required className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                </div>

                {/* Semt */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">Semt</label>
                  <input type="text" className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                </div>
              </div>

              {/* Adres */}
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Adres *</label>
                <textarea required rows={3} className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee resize-none" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Posta Kodu */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">Posta Kodu</label>
                  <input type="text" className="w-full rounded border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-milwaukee" />
                </div>

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

              <div className="pt-2 flex items-start gap-2">
                <input type="checkbox" id="diffAddress" className="mt-0.5 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label htmlFor="diffAddress" className="text-sm text-slate-600 cursor-pointer">
                  Faturamın farklı bir adrese düzenlenmesini istiyorum
                </label>
              </div>

              <div className="pt-4">
                <button type="button" className="w-full md:w-1/2 rounded bg-milwaukee px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700">
                  ADRESİ KAYDET
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
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
      </div>
    </div>
  );
}
