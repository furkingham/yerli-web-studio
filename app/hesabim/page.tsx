'use client';

import { useMemo, useState } from 'react';
import { getCurrentUser, logoutUser, type AuthUser } from '../../lib/auth';

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.href = '/auth';
  };

  const favoriteCount = useMemo(() => user?.favorites?.length ?? 0, [user]);
  const orderCount = useMemo(() => user?.orders?.length ?? 0, [user]);

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }

    return null;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-white/10 bg-[#141414] p-8 shadow-industrial">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Hesabım</p>
            <h1 className="text-3xl font-semibold text-white">Hoş geldin, {user.email}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-3xl bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:bg-milwaukee hover:text-black"
          >
            Çıkış Yap
          </button>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Geçmiş siparişlerinizi ve favorilerinizi buradan yönetebilirsiniz. Milwaukee Pro Store için özel olarak hazırlanmış sade bir yönetim ekranı.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
          <h2 className="text-xl font-semibold text-white">Hızlı Bakış</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Siparişler</p>
              <p className="mt-3 text-3xl font-semibold text-milwaukee">{orderCount}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Favoriler</p>
              <p className="mt-3 text-3xl font-semibold text-milwaukee">{favoriteCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
          <h2 className="text-xl font-semibold text-white">Hesap Bilgileri</h2>
          <div className="mt-5 space-y-3 rounded-3xl bg-[#101010] p-5 text-sm text-slate-300">
            <p>E-posta: {user.email}</p>
            <p>Hesabınız güvenli bir şekilde saklanmaktadır.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
          <h2 className="text-xl font-semibold text-white">Geçmiş Siparişler</h2>
          <div className="mt-6 space-y-4">
            {user.orders.length === 0 ? (
              <p className="text-sm text-slate-300">Henüz siparişiniz yok.</p>
            ) : (
              user.orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-white/10 bg-[#101010] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Sipariş No</p>
                      <p className="mt-2 text-lg font-semibold text-white">{order.id}</p>
                    </div>
                    <p className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">{order.date}</p>
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-3">
                        <p>{item.name} x{item.quantity}</p>
                        <p>{item.price}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-white">
                      <span>Toplam</span>
                      <span>{order.total}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
          <h2 className="text-xl font-semibold text-white">Favoriler</h2>
          <div className="mt-6 space-y-3">
            {user.favorites.length === 0 ? (
              <p className="text-sm text-slate-300">Henüz favori ürün eklemediniz.</p>
            ) : (
              user.favorites.map((favorite) => (
                <div key={favorite.productId} className="rounded-3xl border border-white/10 bg-[#101010] p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{favorite.name}</p>
                      <p>{favorite.price}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-400">Favori</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
