import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-md my-12 space-y-6">
      <span className="inline-block rounded-full bg-milwaukee/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-milwaukee">
        404 - Sayfa Bulunamadı
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Aradığınız Sayfaya Ulaşılamadı
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
        Aradığınız ürün veya sayfa taşınmış, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/"
          className="rounded-2xl bg-milwaukee px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600"
        >
          Anasayfaya Dön
        </Link>
        <Link
          href="/category"
          className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Ürün Kataloğu
        </Link>
      </div>
    </div>
  );
}
