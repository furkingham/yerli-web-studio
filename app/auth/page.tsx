'use client';

import { useState } from 'react';
import { loginUser, registerUser } from '../../lib/auth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      } else if (mode === 'admin') {
        await loginUser('admin@milwaukee.com', password);
        setSuccess('Yönetici girişi başarılı. Yönetim paneline yönlendiriliyorsunuz...');
        window.location.href = '/admin';
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          setError('Lütfen ad ve soyad alanlarını doldurun.');
          return;
        }
        await registerUser(email, password, firstName, lastName);
        setSuccess('Kayıt başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
        window.location.href = '/hesabim';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
      <div className="mb-8 flex flex-col gap-3">
        <div className="inline-flex self-start items-center gap-2 rounded-full bg-milwaukee/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-milwaukee">
          {mode === 'login' ? 'Giriş Yap' : mode === 'admin' ? 'Yönetici Girişi' : 'Kayıt Ol'}
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          {mode === 'admin' ? 'Milwaukee Yönetim Paneli Girişi' : 'Hesabınıza güvenli şekilde erişin'}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          {mode === 'admin' 
            ? 'Yönetici kimliğinizi doğrulamak için şifrenizi girin. Buradan fiyat ve stok yönetimi yapabilirsiniz.' 
            : 'E-posta ve şifre ile kimliğinizi doğrulayın. Kayıt olduktan sonra geçmiş siparişlerinizi ve favorilerinizi yönetebilirsiniz.'
          }
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            if (email === 'admin@milwaukee.com') setEmail('');
          }}
          className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            mode === 'login' ? 'bg-milwaukee text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Giriş
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            if (email === 'admin@milwaukee.com') setEmail('');
          }}
          className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            mode === 'register' ? 'bg-milwaukee text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Kayıt
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('admin');
            setEmail('admin@milwaukee.com');
          }}
          className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
            mode === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Yönetici Girişi
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-600 border border-red-500/20">{error}</div>}
        {success && <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-600 border border-emerald-500/20">{success}</div>}

        {mode === 'register' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Adınız</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Soyadınız</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-milwaukee"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mode === 'admin'}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-milwaukee disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-milwaukee"
          />
        </div>

        <button className="w-full rounded-3xl bg-milwaukee px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-red-600 shadow-md">
          {mode === 'login' ? 'Giriş Yap' : mode === 'admin' ? 'Yönetici Girişi Yap' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
}
