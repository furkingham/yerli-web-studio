'use client';

import { useState } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle } from 'lucide-react';
import { findOrderByCode } from '../../lib/orders';
import { Order } from '../../lib/auth';

export default function OrderTrackingPage() {
  const [code, setCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const found = findOrderByCode(code.trim());
    setOrder(found || null);
    setSearched(true);
  };

  const statusList = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi'];

  const getStatusIndex = (current: string) => {
    const idx = statusList.indexOf(current);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 min-h-[60vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kargo ve Sipariş Takibi</h1>
        <p className="text-slate-600 max-w-lg mx-auto">
          Sipariş durumunuzu öğrenmek için size verilen benzersiz sipariş kodunu (Örn: ORD-7492) aşağıdaki alana giriniz.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Sipariş Kodunuz (ORD-XXXX)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:border-milwaukee outline-none transition"
              required
            />
          </div>
          <button type="submit" className="bg-milwaukee hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition shadow">
            Sorgula
          </button>
        </form>
      </div>

      {searched && !order && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center font-medium">
          Girmiş olduğunuz "{code}" koduna ait bir sipariş bulunamadı. Lütfen kodunuzu kontrol edip tekrar deneyin.
        </div>
      )}

      {searched && order && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SİPARİŞ KODU</p>
              <p className="text-2xl font-black text-slate-900">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SİPARİŞ TARİHİ</p>
              <p className="font-semibold text-slate-800">{order.date}</p>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Teslimat Durumu</h3>
            
            <div className="relative flex justify-between items-center mb-12">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded z-0"></div>
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded z-0 transition-all duration-500" 
                   style={{ width: `${(getStatusIndex(order.status || 'Sipariş Alındı') / 3) * 100}%` }}></div>

              {statusList.map((statusItem, idx) => {
                const currentIdx = getStatusIndex(order.status || 'Sipariş Alındı');
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                
                let Icon = Package;
                if (idx === 0) Icon = Package;
                if (idx === 1) Icon = MapPin;
                if (idx === 2) Icon = Truck;
                if (idx === 3) Icon = CheckCircle;

                return (
                  <div key={statusItem} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold whitespace-nowrap ${isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                      {statusItem}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Sipariş Detayı</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} Adet</p>
                    </div>
                    <p className="font-bold text-milwaukee">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600">Toplam Tutar</span>
                <span className="text-xl font-black text-slate-900">{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
