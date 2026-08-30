'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Globe, Heart, LogOut, User, Menu, Search, ShoppingCart, X, ChevronRight, ChevronLeft, Mail, Truck, Phone, ClipboardList, Home } from 'lucide-react';
import { useCart } from './CartContext';
import { useLanguage } from './LanguageContext';
import { getCurrentUser, logoutUser } from '../lib/auth';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const navCategories = ['Akülü Aletler', 'El Aletleri', 'İş Güvenliği', 'Aksesuar'];

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const { cartCount, openDrawer, cartTotal } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const { data: session } = useSession();
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

  const handleLogout = async () => {
    logoutUser();
    setUser(null);
    if (session) {
      await signOut({ redirect: false });
    }
    window.location.href = '/';
  };

  // Combine both auth systems
  const isLoggedIn = mounted && (user || session);
  const displayName = session?.user?.name || (user ? `${user.firstName} ${user.lastName}` : '');

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md">
        {/* ═══════════════════════════════════════════════════════════════
            ROW 1: Dark Top Bar (email, kargo, iletişim, siparişlerim | favoriler, giriş yap)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-[#1a1a1a] text-[11px] text-slate-300">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-1.5 lg:px-8">
            {/* Left links */}
            <div className="flex items-center gap-4 sm:gap-5">
              <a href="mailto:destek@kaswamakine.com" className="hidden sm:flex items-center gap-1.5 hover:text-white transition">
                <Mail className="h-3 w-3 text-slate-500" /> destek@kaswamakine.com
              </a>
              <Link href="/hesabim" className="flex items-center gap-1.5 hover:text-white transition">
                <ClipboardList className="h-3 w-3 text-slate-500" /> {t('Siparişlerim')}
              </Link>
            </div>

            {/* Right links */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Language */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-slate-500" />
                <button
                  onClick={() => setLanguage('tr')}
                  className={`transition hover:text-white ${language === 'tr' ? 'font-semibold text-white' : ''}`}
                >
                  TR
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`transition hover:text-white ${language === 'en' ? 'font-semibold text-white' : ''}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ROW 2: Red Main Bar (logo, Ürünler, Sistemler, Sektörler | Ara, Sepetim)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-[#db0000] text-white">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-0 lg:px-8">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-2 lg:gap-8">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center p-2 text-white hover:bg-white/15 rounded-lg transition"
                aria-label={t('Geri Dön')}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex-shrink-0 py-2">
                <div className="relative h-12 w-36 sm:h-14 sm:w-48 overflow-hidden">
                  <Image
                    src="/kaswa-logo.png"
                    alt="Kaswa Makine Logo"
                    fill
                    sizes="200px"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </Link>

              {/* Divider */}
              <div className="hidden lg:block h-8 w-px bg-white/30" />

              {/* Greeting text */}
              {isLoggedIn && displayName && (
                <span className="hidden lg:block text-xs font-semibold text-white/90 tracking-wide">
                  {t('Sayın')} {displayName}
                </span>
              )}

              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMenuOpen((c) => !c)}
                  className="flex items-center justify-center h-10 w-10 rounded-lg text-white transition hover:bg-white/15"
                  aria-label={t('Menü')}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link
                  href="/kurumsal/teklif"
                  className="rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  {t('Kurumsal')}
                </Link>
              </nav>
            </div>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
                <Search className="h-4 w-4 text-white/70" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Ara...')}
                  className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
                />
              </form>

              {/* Home Button */}
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                aria-label={t('Ana Sayfa')}
              >
                <Home className="h-5 w-5" />
              </Link>

              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen((c) => !c)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm font-bold text-white transition hover:bg-white/15 lg:hidden"
                aria-label={t('Ara')}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((c) => !c)}
                className="flex items-center gap-1 rounded-lg px-3 py-3 text-white transition hover:bg-white/15 md:hidden"
                aria-label={t('Menü')}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2">
                <Link
                  href="/hesabim"
                  className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg text-white transition hover:bg-white/15"
                  aria-label={t('Favorilerim')}
                >
                  <Heart className="h-5 w-5" />
                </Link>

                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center h-10 w-10 rounded-lg text-white transition hover:bg-white/15 hover:bg-red-500/20 text-red-100 cursor-pointer"
                    title="Çıkış Yap"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/25"
              >
                <ShoppingCart className="h-5 w-5" />
                <div className="hidden sm:flex flex-col items-start text-left leading-none">
                  <span className="text-[10px] text-white/70 font-medium">{t('Sepetim')}</span>
                  <span className="text-xs font-bold">
                    {mounted ? `${cartCount} Ürün` : '0 Ürün'}
                  </span>
                </div>
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-[#db0000]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search dropdown */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full z-40 border-t border-red-800 bg-[#db0000] p-4 shadow-2xl lg:hidden">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Ürün, marka veya model ara')}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#db0000] transition hover:bg-slate-100"
                >
                  {t('Ara')}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="flex-1 rounded-xl border border-white/30 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/15"
                >
                  {t('Kapat')}
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Categories Left Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
            aria-label={t('Kapat')}
          />
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

              <div className="h-px bg-slate-200 my-4" />

              <button
                onClick={() => { setMenuOpen(false); router.push('/hesabim'); }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-left text-base font-semibold text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100/40"
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <span>{t('Hesabım')}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              <button
                onClick={() => { setMenuOpen(false); router.push('/siparis-takip'); }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-left text-base font-semibold text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100/40"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t('Sipariş Takip')}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
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
                <span className="text-xs text-slate-400 font-medium">Kaswa Makina</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
