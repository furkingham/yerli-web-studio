import { Mail, ShieldCheck, GitPullRequest } from 'lucide-react';

const links = [
  { label: 'Hakkımızda', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Destek', href: '#' },
  { label: 'Kariyer', href: '#' },
];

const legal = ['Gizlilik Politikası', 'Kullanım Şartları', 'KVKK Aydınlatma Metni'];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] py-14 text-slate-300">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-milwaukee/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-milwaukee">
            <span>M</span> Milwaukee Pro Store
          </div>
          <p className="max-w-lg text-sm leading-7 text-slate-400">
            Endüstriyel aletler ve profesyonel ekipmanlarla işinizde fark yaratın. Güvenilir marka deneyimi ve yüksek performans için tasarlandı.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-milwaukee" />
              <span className="text-sm text-slate-200">Güvenli alışveriş</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
              <Mail className="h-5 w-5 text-milwaukee" />
              <span className="text-sm text-slate-200">7/24 destek</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Kurumsal</h3>
          <div className="mt-6 space-y-3">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="block text-sm text-slate-300 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Bülten</h3>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Her ay yeni ürünler, promosyonlar ve teknik içerikler doğrudan e-posta kutunuza gelsin.
          </p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-milwaukee"
            />
            <button className="rounded-2xl bg-milwaukee px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
              Abone ol
            </button>
          </form>
          <div className="mt-8 space-y-2 text-xs text-slate-500">
            {legal.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
        © 2026 Milwaukee Pro Store. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
