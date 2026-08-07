import { products as defaultProducts, type Product } from '../data/products';
import type { AuthUser } from './auth';

export type Campaign = {
  id: string;
  name: string;
  code: string;
  discount: number;
  category: string;
  active: boolean;
  banner: string;
};

const ADMIN_PRODUCTS_KEY = 'milwaukee_admin_products';
const ADMIN_CAMPAIGNS_KEY = 'milwaukee_admin_campaigns';
const ADMIN_EMAIL = 'admin@milwaukee.com';

const isClient = typeof window !== 'undefined';

export const isAdminUser = (user: AuthUser | null): boolean => user?.email === ADMIN_EMAIL;

export const getAdminProducts = (): Product[] => {
  if (!isClient) return defaultProducts;
  const raw = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : defaultProducts;
};

export const saveAdminProducts = (products: Product[]): void => {
  if (!isClient) return;
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
};

export const getAdminCampaigns = (): Campaign[] => {
  if (!isClient) return [];
  const raw = window.localStorage.getItem(ADMIN_CAMPAIGNS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveAdminCampaigns = (campaigns: Campaign[]): void => {
  if (!isClient) return;
  window.localStorage.setItem(ADMIN_CAMPAIGNS_KEY, JSON.stringify(campaigns));
};

export const generateSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçıİ]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const getDefaultCampaign = (): Campaign => ({
  id: `CMP-${Date.now()}`,
  name: 'Milwaukee Özel Kampanya',
  code: 'MILWAUKEE20',
  discount: 20,
  category: 'Akülü Aletler',
  active: true,
  banner: 'Milwaukee ile profesyonel avantajlar sizi bekliyor. Kategoriye özel indirim kodunu kullanın.',
});
