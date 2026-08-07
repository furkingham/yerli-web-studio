'use client';

import { useRouter } from 'next/navigation';

const categories = [
  'Akülü Aletler',
  'El Aletleri',
  'İş Güvenliği',
  'Boya ve Temizlik',
  'Yedek Parçalar',
];

export default function CategoryMenu() {
  const router = useRouter();

  return (
    <div className="mt-6 grid gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => router.push(`/category?category=${encodeURIComponent(category)}`)}
          className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm font-medium text-slate-100 transition hover:border-milwaukee hover:bg-[#191919]"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
