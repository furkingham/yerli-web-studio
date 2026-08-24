import Link from 'next/link';
import { getProductBySlug, products } from '../../../data/products';
import ProductView from '../../../components/ProductView';

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export const dynamicParams = true;

export default function ProductPage({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug ? String(params.slug) : '';
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-md my-12 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Aradığınız Ürün Bulunamadı</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Bu ürün güncellenmiş veya yayından kaldırılmış olabilir. Tüm Milwaukee ürün kataloğumuza göz atabilirsiniz.
        </p>
        <div className="pt-2">
          <Link
            href="/category"
            className="inline-flex rounded-2xl bg-milwaukee px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600"
          >
            Tüm Ürünleri İncele
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image || 'https://placehold.co/800x800/db0000/ffffff?text=Milwaukee',
    description: product.description || '',
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://kaswamakina.com/urun/${product.slug}`,
      priceCurrency: 'TRY',
      price: product.price ? product.price.replace(/\./g, '').replace(' TL', '').replace(',', '.') : '0',
      availability: product.stockStatus === 'Stokta Var' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} />
    </>
  );
}
