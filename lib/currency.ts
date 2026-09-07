export type ProductCurrency = 'TRY' | 'EUR' | 'USD';

export type CurrencyRates = {
  eur: number;
  usd: number;
};

const KEY = 'kaswa_currency_rates';

export const defaultRates: CurrencyRates = { eur: 45, usd: 41 };

export function getCurrencyRates(): CurrencyRates {
  if (typeof window === 'undefined') return defaultRates;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = JSON.parse(raw || 'null');
    if (parsed && Number(parsed.eur) > 0 && Number(parsed.usd) > 0) {
      return { eur: Number(parsed.eur), usd: Number(parsed.usd) };
    }
  } catch {
    // ignore
  }
  return defaultRates;
}

export function saveCurrencyRates(rates: CurrencyRates) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, JSON.stringify(rates));
  }
}

export function calculateTryPrice(
  basePrice: number,
  currency: ProductCurrency,
  rates: CurrencyRates,
): number {
  if (currency === 'EUR') return basePrice * rates.eur;
  if (currency === 'USD') return basePrice * rates.usd;
  return basePrice;
}

export function formatTry(value: number): string {
  return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(value)} TL`;
}

export function priceFromCurrency(
  basePrice: number | undefined,
  currency: ProductCurrency | undefined,
  rates: CurrencyRates,
): string | null {
  if (typeof basePrice !== 'number' || !currency) return null;
  return formatTry(calculateTryPrice(basePrice, currency, rates));
}
