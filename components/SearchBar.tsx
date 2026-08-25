'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState('');
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = term.trim();
    router.push(trimmed ? `/category?search=${encodeURIComponent(trimmed)}` : '/category');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-xs focus-within:border-milwaukee focus-within:bg-white transition">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t('Ürün adı, kategori veya model ara...')}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-milwaukee px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-red-600"
          >
            {t('Ara')}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-400">{t('Hızlı Etiketler')}:</span>
          <button
            type="button"
            onClick={() => router.push('/urun/milwaukee-m18-fuel-matkap')}
            className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 transition hover:bg-milwaukee hover:text-white"
          >
            M18 Matkap
          </button>
          <button
            type="button"
            onClick={() => router.push('/urun/milwaukee-m18-aku-seti-5-ah')}
            className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 transition hover:bg-milwaukee hover:text-white"
          >
            5.0 Ah Akü
          </button>
          <button
            type="button"
            onClick={() => router.push('/category?category=İş%20Güvenliği')}
            className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 transition hover:bg-milwaukee hover:text-white"
          >
            İş Güvenliği
          </button>
          <button
            type="button"
            onClick={() => router.push('/urun/milwaukee-m12-akulu-tork-anahtari')}
            className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 transition hover:bg-milwaukee hover:text-white"
          >
            Tork Anahtarı
          </button>
        </div>
      </form>
    </div>
  );
}
