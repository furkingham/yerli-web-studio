import { NextResponse } from 'next/server';
import { getAllProductSlugs } from '../../data/products';

export const dynamic = 'force-static';

const getSiteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://yerli-web-studio.vercel.app';

export function GET() {
  const siteUrl = getSiteUrl();
  const productUrls = getAllProductSlugs().map(
    (slug) => `  <url>\n    <loc>${siteUrl}/urun/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`,
  );

  const routes = ['/', '/category', '/auth', '/hesabim', '/cart', '/admin'].map(
    (path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.join('\n')}\n${productUrls.join('\n')}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
