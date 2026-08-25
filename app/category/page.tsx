'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories, type StockStatus, type Voltage, type MotorType } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { ChevronRight, Slash } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';

const stockOptions: StockStatus[] = ['Stokta Var', 'Kritik Stok', 'Tükendi'];
const voltageOptions: Voltage[] = ['12V', '18V', '24V'];
const motorOptions: MotorType[] = ['Kömürsüz', 'Kömürlü'];

function CategoryPageContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVoltages, setSelectedVoltages] = useState<Voltage[]>([]);
  const [selectedMotorTypes, setSelectedMotorTypes] = useState<MotorType[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockStatus[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category') || '';
    const searchParam = searchParams.get('search') || '';
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSearchTerm(searchParam);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchVoltage = selectedVoltages.length === 0 || (product.voltage ? selectedVoltages.includes(product.voltage) : false);
      const matchMotor = selectedMotorTypes.length === 0 || (product.motorType ? selectedMotorTypes.includes(product.motorType) : false);
      const matchStock = selectedStock.length === 0 || selectedStock.includes(product.stockStatus);
      const matchCapacity = selectedCapacities.length === 0 || (product.batteryCapacity ? selectedCapacities.includes(product.batteryCapacity) : false);
      const matchSearch =
        searchTerm.length === 0 ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description ? product.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);

      return matchCategory && matchVoltage && matchMotor && matchStock && matchCapacity && matchSearch;
    });
  }, [selectedCategories, selectedVoltages, selectedMotorTypes, selectedStock, selectedCapacities, searchTerm]);

  const toggleSelection = <T extends string | number>(value: T, state: Array<T>, setter: (value: Array<T>) => void) => {
    const next = state.includes(value) ? state.filter((item) => item !== value) : [...state, value];
    setter(next);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedVoltages([]);
    setSelectedMotorTypes([]);
    setSelectedStock([]);
    setSelectedCapacities([]);
    setSearchTerm('');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full rounded-2xl bg-slate-900 text-white px-4 py-3 font-semibold flex items-center justify-between shadow-md"
        >
          <span>{t('Filtreleri')} {isFilterOpen ? t('Gizle') : t('Göster')}</span>
          <ChevronRight className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>
      <aside className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-md h-fit ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{t('Filtreler')}</h1>
            <p className="mt-1.5 text-xs text-slate-500">{t('Teknik özelliklere göre anında daraltın.')}</p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-slate-700 transition hover:border-milwaukee hover:text-milwaukee hover:bg-slate-100"
          >
            <Slash className="h-3 w-3" /> {t('Temizle')}
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('Kategori')}</legend>
            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedCategories.includes(category)
                      ? 'border-milwaukee bg-milwaukee/5 text-milwaukee font-semibold shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-milwaukee/30 hover:bg-slate-50'
                  }`}
                >
                  <span>{t(category)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('Voltaj')}</legend>
            <div className="mt-4 space-y-2">
              {voltageOptions.map((voltage) => (
                <button
                  key={voltage}
                  type="button"
                  onClick={() => toggleSelection(voltage, selectedVoltages, setSelectedVoltages)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition ${
                    selectedVoltages.includes(voltage)
                      ? 'border-milwaukee bg-milwaukee/5 text-milwaukee font-semibold shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-milwaukee/30 hover:bg-slate-50'
                  }`}
                >
                  <span>{voltage}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('Motor Tipi')}</legend>
            <div className="mt-4 space-y-2">
              {motorOptions.map((motor) => (
                <button
                  key={motor}
                  type="button"
                  onClick={() => toggleSelection(motor, selectedMotorTypes, setSelectedMotorTypes)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition ${
                    selectedMotorTypes.includes(motor)
                      ? 'border-milwaukee bg-milwaukee/5 text-milwaukee font-semibold shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-milwaukee/30 hover:bg-slate-50'
                  }`}
                >
                  <span>{t(motor)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('Akü Kapasitesi')}</legend>
            <div className="mt-4 space-y-2">
              {[...new Set(products.map((product) => product.batteryCapacity))]
                .filter((capacity): capacity is number => typeof capacity === 'number')
                .sort((a, b) => a - b)
                .map((capacity) => (
                  <button
                    key={capacity}
                    type="button"
                    onClick={() => toggleSelection(capacity, selectedCapacities, setSelectedCapacities)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition ${
                      selectedCapacities.includes(capacity)
                        ? 'border-milwaukee bg-milwaukee/5 text-milwaukee font-semibold shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-milwaukee/30 hover:bg-slate-50'
                    }`}
                  >
                    <span>{capacity} Ah</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('Stok Durumu')}</legend>
            <div className="mt-4 space-y-2">
              {stockOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleSelection(status, selectedStock, setSelectedStock)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition ${
                    selectedStock.includes(status)
                      ? 'border-milwaukee bg-milwaukee/5 text-milwaukee font-semibold shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-milwaukee/30 hover:bg-slate-50'
                  }`}
                >
                  <span>{t(status)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </aside>

      <section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-md">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{t('Ürünler')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{t('Milwaukee Teknik Ekipmanları')}</h2>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700 font-semibold">
            {filteredProducts.length} {t('ürün bulundu')}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-md">
              <p className="text-lg font-semibold text-slate-900">{t('Filtrenize uyan ürün bulunamadı.')}</p>
              <p className="mt-3 text-sm text-slate-400">{t('Başka kombinasyonları deneyin veya tüm filtreleri temizleyin.')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-slate-500">Yükleniyor...</div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
