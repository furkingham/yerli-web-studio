'use client';

import { useState } from 'react';
import { loginUser, registerUser } from '../../lib/auth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await loginUser(email, password);
        setSuccess('Giriş başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
        window.location.href = '/hesabim';
      } else {
        await registerUser(email, password);
        setSuccess('Kayıt başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
        window.location.href = '/hesabim';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-[#141414] p-8 shadow-industrial">
      <div className="mb-8 flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-milwaukee/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-milwaukee">
          {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </div>
        <h1 className="text-3xl font-semibold text-white">Hesabınıza güvenli şekilde erişin</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          E-posta ve şifre ile kimliğinizi doğrulayın. Kayıt olduktan sonra geçmiş siparişlerinizi ve favorilerinizi yönetebilirsiniz.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            mode === 'login' ? 'bg-milwaukee text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Giriş
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            mode === 'register' ? 'bg-milwaukee text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Kayıt
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
        {success && <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-milwaukee"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-milwaukee"
          />
        </div>

        <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-red-600">
          {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
}
