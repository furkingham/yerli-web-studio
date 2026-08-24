'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Sistem Hatası:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-lg my-12 space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-milwaukee text-2xl font-bold">
        ⚠️
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
        Bir Hata Oluştu
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Sayfa yüklenirken geçici bir aksaklık meydana geldi. Lütfen tekrar deneyin veya anasayfaya dönün.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="rounded-2xl bg-milwaukee px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600"
        >
          Yeniden Dene
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Anasayfaya Git
        </Link>
      </div>
    </div>
  );
}
