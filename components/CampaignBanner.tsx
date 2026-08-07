'use client';

import { useEffect, useState } from 'react';
import { getAdminCampaigns, type Campaign } from '../lib/admin';

export default function CampaignBanner() {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const campaigns = getAdminCampaigns();
    setActiveCampaign(campaigns.find((campaign) => campaign.active) ?? null);
  }, []);

  if (!activeCampaign) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-milwaukee/10 bg-milwaukee/10 p-6 text-white shadow-industrial">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-white/70">Kampanya</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{activeCampaign.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">{activeCampaign.banner}</p>
        </div>
        <div className="rounded-3xl bg-black/20 px-5 py-4 text-center text-sm uppercase tracking-[0.18em] text-white">
          Kod: <span className="font-semibold">{activeCampaign.code}</span>
        </div>
      </div>
    </section>
  );
}
