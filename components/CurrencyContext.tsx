'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'TL' | 'USD' | 'EUR';

interface ExchangeRates {
  USD: number;
  EUR: number;
}

interface CurrencyContextType {
  rates: ExchangeRates;
  setRates: (rates: ExchangeRates) => void;
  formatPrice: (product: any) => string;
  calculatePriceTL: (product: any) => number;
}

const defaultRates: ExchangeRates = {
  USD: 33.5, // Varsayılan kurlar
  EUR: 36.8,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRatesState] = useState<ExchangeRates>(defaultRates);

  useEffect(() => {
    // Tarayıcı belleğinden kurları çek
    const saved = localStorage.getItem('milwaukee_exchange_rates');
    if (saved) {
      try {
        setRatesState(JSON.parse(saved));
      } catch (e) {
        console.error("Kur verisi okunamadı:", e);
      }
    }
  }, []);

  const setRates = (newRates: ExchangeRates) => {
    setRatesState(newRates);
    localStorage.setItem('milwaukee_exchange_rates', JSON.stringify(newRates));
    // Fiyat değişikliklerini diğer sekmelere de yansıt
    window.dispatchEvent(new Event('exchange_rates_updated'));
  };

  const calculatePriceTL = (product: any): number => {
    // Admin overrides can provide basePrice & currency
    let basePrice = product.basePrice;
    let currency = product.currency || 'TL';

    if (basePrice === undefined) {
      // Eski 'price' (Örn: "1.450 TL") formatından sayıyı çek
      const priceStr = product.price || "0";
      const numStr = priceStr.toString().replace(/[^0-9]/g, '');
      basePrice = parseInt(numStr, 10) || 0;
    }

    if (currency === 'USD') {
      return Math.round(basePrice * rates.USD);
    } else if (currency === 'EUR') {
      return Math.round(basePrice * rates.EUR);
    }
    return basePrice;
  };

  const formatPrice = (product: any): string => {
    const tlPrice = calculatePriceTL(product);
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(tlPrice) + ' TL';
  };

  return (
    <CurrencyContext.Provider value={{ rates, setRates, formatPrice, calculatePriceTL }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
