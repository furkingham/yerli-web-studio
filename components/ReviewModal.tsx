'use client';

import { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { addProductReview } from '../lib/reviews';

type ReviewModalProps = {
  productId: string;
  productName: string;
  userEmail: string;
  userName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ReviewModal({
  productId,
  productName,
  userEmail,
  userName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [durabilityRating, setDurabilityRating] = useState(5);
  const [materialRating, setMaterialRating] = useState(5);
  const [performanceRating, setPerformanceRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Lütfen ürün hakkında kısa bir değerlendirme metni yazın.');
      return;
    }

    addProductReview({
      productId,
      productName,
      userEmail,
      userName: userName || userEmail.split('@')[0],
      overallRating,
      durabilityRating,
      materialRating,
      performanceRating,
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1800);
  };

  const renderStarInput = (
    label: string,
    value: number,
    onChange: (val: number) => void
  ) => {
    return (
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1 transition hover:scale-110 focus:outline-none"
              aria-label={`${label} ${star} yıldız`}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= value
                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-600 min-w-[2.5rem] text-right">
            {value} / 5
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-milwaukee">
              Doğrulanmış Satın Alım Değerlendirmesi
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{productName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 animate-bounce" />
            <h4 className="text-2xl font-bold text-slate-900">Yorumunuz Yayınlandı!</h4>
            <p className="text-sm text-slate-500">
              Değerlendirmeniz ve puanlarınız ürün sayfasına başarıyla eklendi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2.5">
              {renderStarInput('Genel Memnuniyet', overallRating, setOverallRating)}
              {renderStarInput('Dayanıklılık & Sağlamlık', durabilityRating, setDurabilityRating)}
              {renderStarInput('Materyal & Gövde Kalitesi', materialRating, setMaterialRating)}
              {renderStarInput('Performans & Güç', performanceRating, setPerformanceRating)}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Deneyiminiz ve Yorumunuz
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürünün sahada kullanımı, dayanıklılığı, tork gücü ve malzeme kalitesi hakkındaki düşünceleriniz..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-milwaukee"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-milwaukee py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-red-600"
              >
                Değerlendirmeyi Yayınla
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Vazgeç
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
