import type { ReactNode } from 'react';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../components/CartContext';
import { LanguageProvider } from '../components/LanguageContext';
import CartDrawer from '../components/CartDrawer';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Milwaukee Pro Store',
  description: 'Endüstriyel Milwaukee marka kimliğine uygun e-ticaret sitesi.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen bg-[#eef0f3] text-[#1a1a1a]">
          <Providers>
            <LanguageProvider>
              <CartProvider>
                <Header />
                <CartDrawer />
                <main className="mx-auto max-w-screen-2xl px-4 pb-16 pt-8 lg:px-8">{children}</main>
                <Footer />
              </CartProvider>
            </LanguageProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
