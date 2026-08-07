'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Heart, LogIn, Menu, Search, ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

const navCategories = ['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'];

export default function Header() {
  const { cartCount, openDrawer } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryNavigate = (category: string) => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchTerm('');
    router.push(`/category?category=${encodeURIComponent(category)}`);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    setSearchTerm('');
    router.push(trimmed ? `/category?search=${encodeURIComponent(trimmed)}` : '/category');
  };

  return (
    <header className="relative border-b border-white/10 bg-[#090909]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-milwaukee text-sm font-bold uppercase tracking-[0.24em] text-black shadow-lg shadow-milwaukee/20">
            M
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Milwaukee</p>
            <p className="text-sm font-semibold text-white">Pro Store</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryNavigate(category)}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:border-milwaukee hover:text-white"
          >
            <Menu className="h-4 w-4" /> Kategoriler
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:border-milwaukee hover:text-white lg:hidden"
            aria-label="Aramayı aç"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:flex md:items-center md:gap-3 md:w-[420px]">
            <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-3">
              <Search className="h-4 w-4 text-slate-300" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ürün, marka veya model ara"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </form>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-milwaukee hover:text-black">
              <Heart className="h-5 w-5" />
            </button>
            <a href="/auth" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-milwaukee hover:text-black">
              <LogIn className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-milwaukee hover:text-black"
              aria-label="Sepeti aç"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-milwaukee px-1.5 text-[0.65rem] font-semibold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-[#090909]/95 p-4 shadow-2xl lg:hidden">
          <div className="grid gap-3">
            {navCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryNavigate(category)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-slate-200 transition hover:border-milwaukee hover:bg-white/10"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-[#090909]/95 p-4 shadow-2xl lg:hidden">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3">
              <Search className="h-4 w-4 text-slate-300" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ürün, marka veya model ara"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-3xl bg-milwaukee px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600"
              >
                Ara
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Kapat
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
