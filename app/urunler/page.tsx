import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Ürün Kataloğu</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Milwaukee Profesyonel Ekipmanları</h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 font-medium">
            Tüm ağır hizmet el aletleri, orijinal servis garantisi ve anlık stok takibiyle sizlerle.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>
    </div>
  );
}
