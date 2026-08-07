import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs, type Product } from '../../../data/products';
import ProductDetailTabs from '../../../components/ProductDetailTabs';
import ProductCartActions from '../../../components/ProductCartActions';
import Image from 'next/image';

function formatStockAvailability(status: string) {
  if (status === 'Stokta Var') return 'https://schema.org/InStock';
  if (status === 'Kritik Stok') return 'https://schema.org/LimitedAvailability';
  return 'https://schema.org/OutOfStock';
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug);

  if (!product) return { title: 'Ürün bulunamadı', description: 'Aradığınız Milwaukee ürünü mevcut değil.' };

  return {
    title: `${product.name} | Milwaukee Pro Store`,
    description: `${product.name} satın alın. ${product.voltage}, ${product.motorType} motor, ${product.batteryCapacity} Ah akü kapasitesi ve ${product.stockStatus} stok durumu ile profesyonel çözüm.`,
    openGraph: {
      title: `${product.name} | Milwaukee Pro Store`,
      description: `${product.description} ${product.warranty} ve yetkili servis bilgisiyle.`,
    },
  };
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Milwaukee',
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://yerli-web-studio.vercel.app/urun/${product.slug}`,
      priceCurrency: 'TRY',
      price: product.price.replace('.', '').replace(' TL', '').replace(',', '.'),
      availability: formatStockAvailability(product.stockStatus),
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#141414] p-8 shadow-industrial">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] bg-white/5 p-8 text-center">
                <div className="mx-auto relative h-80 w-full items-center justify-center rounded-[32px] bg-[#0e0e0e]">
                  <Image src={product.image} alt={product.name} fill style={{ objectFit: 'contain' }} sizes="(max-width: 1024px) 100vw, 800px" />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{product.category}</p>
                <h1 className="text-4xl font-semibold text-white">{product.name}</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300">{product.description}</p>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Voltaj</p>
                    <p className="mt-3 text-lg font-semibold text-white">{product.voltage}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Motor Tipi</p>
                    <p className="mt-3 text-lg font-semibold text-white">{product.motorType}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Akü Kapasitesi</p>
                    <p className="mt-3 text-lg font-semibold text-white">{product.batteryCapacity} Ah</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stok Durumu</p>
                    <p className="mt-3 text-lg font-semibold text-white">{product.stockStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#111111] p-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fiyat</p>
                <p className="text-4xl font-semibold text-milwaukee">{product.price}</p>
                <p className="text-sm text-slate-300">Stok durumu: {product.stockStatus}</p>
              </div>
              <ProductCartActions product={product} />
              <div className="rounded-3xl bg-white/5 p-5 text-sm text-slate-300">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Garanti ve Yetkili Servis</h2>
                <p className="mt-2 leading-7">
                  {product.warranty} ile Milwaukee yetkili servis ağında destek. Orijinal parça ve uzman bakım garantisi ile koruma altında kalın.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-industrial">
            <h2 className="text-xl font-semibold text-white">Ürün Detayları</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>Marka: Milwaukee</li>
              <li>Model: {product.id}</li>
              <li>Garanti: {product.warranty}</li>
              <li>Stok Durumu: {product.stockStatus}</li>
              <li>Motor Tipi: {product.motorType}</li>
              <li>Akü Kapasitesi: {product.batteryCapacity} Ah</li>
            </ul>
          </div>

          <ProductDetailTabs product={product} />
        </div>
      </section>
    </div>
  );
}
