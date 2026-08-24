'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Globe, Heart, LogOut, User, Menu, Search, ShoppingCart, X, ChevronRight, Home } from 'lucide-react';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';
import { getCurrentUser, logoutUser } from '../lib/auth';
import Link from 'next/link';

const navCategories = ['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'];

export default function Header() {
  const { cartCount, openDrawer } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const handleCategoryNavigate = (category: string) => {
    setMenuOpen(false);
    router.push(`/category?category=${encodeURIComponent(category)}`);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    setSearchTerm('');
    router.push(trimmed ? `/category?search=${encodeURIComponent(trimmed)}` : '/category');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        {/* Top Bar — fast info and language switcher */}
        <div className="border-b border-slate-200/50 bg-slate-900 text-[11px] text-slate-400">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-1.5 lg:px-8">
            <div className="text-slate-300 font-medium tracking-wide">
              {t('Türkiye Geneli Hızlı Teslimat & Orijinal Ürün Garantisi')}
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-slate-500" />
              <button
                onClick={() => setLanguage('tr')}
                className={`transition hover:text-white ${language === 'tr' ? 'font-semibold text-white' : ''}`}
              >
                Türkçe
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`transition hover:text-white ${language === 'en' ? 'font-semibold text-white' : ''}`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Header container */}
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 lg:px-8">
          {/* Logo & Welcome text container */}
          <div className="flex flex-1 items-center justify-start gap-4 lg:gap-6">
            <Link href="/" className="transition hover:opacity-90 flex-shrink-0">
              <div className="relative h-14 w-40 overflow-hidden">
                <Image
                  src="/milwaukee-logo.jpg"
                  alt="Milwaukee Logo"
                  fill
                  sizes="160px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
            <div className="hidden sm:block border-l-2 border-slate-200 pl-4 py-1">
              <p className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">
                {mounted && user ? (
                  <>
                    <span className="text-milwaukee">{t('Sayın')}</span> {user.firstName} {user.lastName}
                  </>
                ) : (
                  <span>{t("Milwaukee'ye Hoş Geldiniz")}</span>
                )}
              </p>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                {t('Yetkili Pro Mağazası')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
            <Link
              href="/"
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
              aria-label={t('Anasayfa')}
            >
              <Home className="h-6 w-6" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 text-lg text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100/80"
            >
              <Menu className="h-6 w-6 text-milwaukee" /> {t('Kategoriler')}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              className="inline-flex h-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-base text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100/80 lg:hidden"
              aria-label={t('Aramayı aç')}
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Desktop Search bar */}
            <form onSubmit={handleSearchSubmit} className="hidden w-80 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('Ürün, marka veya model ara')}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </form>

            {/* User Profile / Login / Logout section */}
            {mounted && user ? (
              <>
                <Link
                  href="/hesabim"
                  className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
                  aria-label={t('Hesabım')}
                >
                  <User className="h-6 w-6" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
                  aria-label={t('Çıkış Yap')}
                >
                  <LogOut className="h-6 w-6 text-red-600" />
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
                aria-label={t('Giriş Yap')}
              >
                <User className="h-6 w-6" />
              </Link>
            )}

            <Link
              href="/hesabim"
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
              aria-label={t('Favoriler')}
            >
              <Heart className="h-6 w-6" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-milwaukee hover:text-white"
              aria-label={t('Sepeti aç')}
            >
              <ShoppingCart className="h-6 w-6" />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-milwaukee px-1.5 text-[0.65rem] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search dropdown */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full z-40 border-t border-slate-200 bg-white p-4 shadow-2xl lg:hidden">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('Ürün, marka veya model ara')}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-3xl bg-milwaukee px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600"
                >
                  {t('Ara')}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100"
                >
                  {t('Kapat')}
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Categories Left Drawer (Mega-like drawer sliding from the left) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Overlay */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
            aria-label={t('Kapat')}
          />
          {/* Drawer Panel */}
          <aside className="relative mr-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl border-r border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 font-semibold">{t('Kategori seçin')}</p>
                <h2 className="text-2xl font-bold text-slate-900">{t('Kategoriler')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200 hover:text-black"
                aria-label={t('Kapat')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
              {navCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryNavigate(category)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-left text-base font-semibold text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100/40"
                >
                  <span>{t(category)}</span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <Image
                  src="/milwaukee-logo.jpg"
                  alt="Milwaukee Logo"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xs text-slate-400 font-medium">Pro Store v1.0</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
