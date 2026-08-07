'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState('');

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-[#0f0f0f] p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = term.trim();
          router.push(trimmed ? `/category?search=${encodeURIComponent(trimmed)}` : '/category');
        }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#121212] px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Ürün adı, kategori veya model ara"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            className="rounded-2xl bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-milwaukee/10"
          >
            En çok satılan Milwaukee aletler
          </button>
          <button
            type="button"
            onClick={() => router.push('/category')}
            className="rounded-2xl bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-milwaukee/10"
          >
            Yeni gelen profesyonel ekipmanlar
          </button>
        </div>
      </form>
    </div>
  );
}
