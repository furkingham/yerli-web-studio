'use client';

import { useCart } from './CartContext';
import type { Product } from '../data/products';

export default function ProductCartActions({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600"
    >
      Sepete ekle
    </button>
  );
}
