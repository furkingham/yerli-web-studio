'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../data/products';
import { getAdminProducts } from '../lib/admin';
import { useCurrency } from './CurrencyContext';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: string;
  basePrice?: number;
  currency?: 'TL' | 'USD' | 'EUR';
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: string;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'milwaukee_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);

  const { calculatePriceTL } = useCurrency();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          const currentProducts = getAdminProducts();
          const refreshed = parsed.map((item) => {
            const current = currentProducts.find((product) => product.id === item.productId);
            return current
              ? {
                  ...item,
                  name: current.name,
                  price: current.price,
                  basePrice: current.basePrice,
                  currency: current.currency,
                  image: current.image || item.image,
                  slug: current.slug,
                }
              : item;
          });
          setCartItems(refreshed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart storage', e);
    }
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (cartHydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, cartHydrated]);

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const cartTotalValue = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + calculatePriceTL(item) * item.quantity, 0);
  }, [cartItems, calculatePriceTL]);

  const cartTotal = `${Math.round(cartTotalValue).toLocaleString('tr-TR')} TL`;

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          basePrice: product.basePrice,
          currency: product.currency,
          image: product.image || 'https://placehold.co/400x400/ffffff/db0000?text=Milwaukee',
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCartItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        drawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
