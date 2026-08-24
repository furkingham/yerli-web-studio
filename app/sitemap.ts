import type { MetadataRoute } from 'next';
import { getAllProductSlugs } from '../data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://kaswamakina.com';
  const productUrls = getAllProductSlugs().map((slug) => ({
    url: `${siteUrl}/urun/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const routes = ['', '/category', '/auth', '/hesabim', '/cart', '/admin', '/destek', '/urunler'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes, ...productUrls];
}
