'use client';

import { X, CheckCircle2, PackageCheck, Truck, Clock, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { CargoStatus } from '../lib/auth';

type CargoTrackerModalProps = {
  orderId: string;
  orderDate: string;
  status?: CargoStatus;
  trackingNumber?: string;
  cargoCompany?: string;
  deliveryDate?: string;
  onClose: () => void;
};

const steps: { key: CargoStatus; title: string; desc: string; icon: any }[] = [
  {
    key: 'Sipariş Alındı',
    title: 'Sipariş Alındı',
    desc: 'Siparişiniz onaylandı, ödeme ikas Sanal POS ile tahsil edildi.',
    icon: CheckCircle2,
  },
  {
    key: 'Hazırlanıyor',
    title: 'Hazırlanıyor & Paketleniyor',
    desc: 'Yetkili depomuzda seri no kaydı yapılarak güvenle paketlendi.',
    icon: PackageCheck,
  },
  {
    key: 'Kargoya Verildi',
    title: 'Kargoda & Dağıtımda',
    desc: 'Kargo acentesine teslim edildi, teslimat adresine doğru yola çıktı.',
    icon: Truck,
  },
  {
    key: 'Teslim Edildi',
    title: 'Teslim Edildi',
    desc: 'Paketiniz alıcıya başarıyla teslim edildi.',
    icon: CheckCircle2,
  },
];

export default function CargoTrackerModal({
  orderId,
  orderDate,
  status = 'Kargoya Verildi',
  trackingNumber = 'MLW839201948TR',
  cargoCompany = 'Yurtiçi Kargo',
  deliveryDate,
  onClose,
}: CargoTrackerModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepIndex = (currentStatus: CargoStatus) => {
    const map: Record<CargoStatus, number> = {
      'Sipariş Alındı': 0,
      'Hazırlanıyor': 1,
      'Kargoya Verildi': 2,
      'Teslim Edildi': 3,
    };
    return map[currentStatus] ?? 2;
  };

  const activeIndex = getStepIndex(status);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-milwaukee">
              Kargo & Teslimat Süreci
            </span>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              Sipariş: <span className="text-milwaukee font-mono">{orderId}</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cargo Summary Bar */}
        <div className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kargo Firması</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{cargoCompany}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Takip Numarası</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-800">{trackingNumber}</span>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="rounded-lg bg-white p-1 text-slate-500 shadow-xs transition hover:text-milwaukee"
                title="Kopyala"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Durum</p>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                status === 'Teslim Edildi'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Visual Timeline Steps */}
        <div className="mt-8 space-y-6">
          <div className="relative pl-6 sm:pl-8">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[1.125rem] sm:left-[1.375rem] top-4 bottom-4 w-1 bg-slate-200 -translate-x-1/2" />

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Step Icon Badge */}
                    <div
                      className={`relative z-10 flex h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-2xl border-2 transition ${
                        isPassed
                          ? 'border-milwaukee bg-milwaukee text-white shadow-md'
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Step Content */}
                    <div
                      className={`flex-1 rounded-2xl p-4 transition ${
                        isCurrent
                          ? 'border border-milwaukee/30 bg-milwaukee/5 shadow-xs'
                          : 'bg-slate-50/70 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-base font-bold ${
                            isPassed ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-milwaukee">
                            <Clock className="h-3 w-3" /> Güncel Aşama
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-8 border-t border-slate-100 pt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
