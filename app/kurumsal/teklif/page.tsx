'use client';

import { useState } from 'react';
import { Building, Mail, Phone } from 'lucide-react';

export default function CorporateOfferPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-industrial">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Kurumsal Teklif</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Projenize özel fiyatlandırma ve öncelikli destek</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Büyük montaj projeleri, inşaat işleri ve endüstriyel satın almalarda avantajlı kurumsal çözümler sunuyoruz.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-slate-200">
              <Building className="h-6 w-6 text-milwaukee" />
              <span className="font-semibold">Kurumsal proje uzmanı</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Saha ihtiyaç analizinden teklif sürecine kadar profesyonel destek. Güvenilir Milwaukee ürünleriyle operasyonunuzu hızlandırın.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#0f0f0f] p-8 shadow-industrial">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Hızlı iletişim</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">Sizin için özel bir teklif hazırlayalım. Formu doldurun, proje ekibimiz 24 saat içinde dönüş yapsın.</p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  İsim
                  <input className="w-full rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-milwaukee" type="text" placeholder="Adınız" required />
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  Şirket
                  <input className="w-full rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-milwaukee" type="text" placeholder="Firma adı" required />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  E-posta
                  <input className="w-full rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-milwaukee" type="email" placeholder="E-posta adresi" required />
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  Telefon
                  <input className="w-full rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-milwaukee" type="tel" placeholder="Telefon" required />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-200">
                Proje Bilgisi
                <textarea className="h-40 w-full rounded-3xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-milwaukee" placeholder="Kısa proje açıklaması" required />
              </label>
              <button className="inline-flex w-full items-center justify-center rounded-full bg-milwaukee px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:scale-[1.02] hover:bg-milwaukee/90">
                Teklif isteğini gönder
              </button>
            </form>
            {submitted && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Talebiniz alındı. Ekibimiz yakında sizinle irtibata geçecek.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
          <h2 className="text-xl font-semibold text-white">Kurumsal destek avantajları</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-[#111111]/80 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-3xl bg-milwaukee/15 text-milwaukee">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">İletişim Hattı</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Kurumsal sorularınız için özel ekip, 7/24 yanınızda.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-[#111111]/80 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-3xl bg-milwaukee/15 text-milwaukee">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Hızlı geri dönüş</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Teklif talepleriniz kısa sürede değerlendirilir ve size özel sunulur.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
