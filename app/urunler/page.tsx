import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-industrial">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Ürün Kataloğu</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Milwaukee profesyonel ekipmanları</h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Kurumsal alım, stok durumu ve teknik özelliklerle desteklenen ürünlerimiz.
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
