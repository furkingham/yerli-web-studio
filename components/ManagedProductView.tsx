'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductBySlug, type Product } from '../data/products';
import { getAdminProducts } from '../lib/admin';
import ProductView from './ProductView';

export default function ManagedProductView({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | undefined>(() => getProductBySlug(slug));

  useEffect(() => {
    const updatedProduct = getAdminProducts().find(
      (item) => item.slug.toLowerCase() === slug.toLowerCase() || item.id.toLowerCase() === slug.toLowerCase(),
    );
    if (updatedProduct) setProduct(updatedProduct);
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto my-12 max-w-2xl space-y-4 rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">Aradığınız Ürün Bulunamadı</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500">
          Bu ürün güncellenmiş veya yayından kaldırılmış olabilir. Tüm ürün kataloğumuza göz atabilirsiniz.
        </p>
        <Link href="/category" className="inline-flex rounded-2xl bg-milwaukee px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600">
          Tüm Ürünleri İncele
        </Link>
      </div>
    );
  }

  return <ProductView product={product} />;
}
