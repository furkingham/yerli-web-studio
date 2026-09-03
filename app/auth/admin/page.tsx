'use client';

import { useState } from 'react';
import { loginUser, registerUser, validateAdminCode } from '../../../lib/auth';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminAuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        // Giriş
        const user = await loginUser(email, password);

        if (!user.isAdmin) {
          throw new Error('Bu hesabın yönetici yetkisi bulunmuyor. Lütfen yönetici kodu ile kayıt olun.');
        }

        await signIn('credentials', {
          email,
          password,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isAdmin: String(user.isAdmin || false),
          redirect: false,
        });

        setSuccess('Yönetici girişi başarılı. Yönetim paneline yönlendiriliyorsunuz...');
        setTimeout(() => { window.location.href = '/admin'; }, 800);

      } else {
        // Kayıt
        if (!firstName.trim() || !lastName.trim()) {
          setError('Lütfen ad ve soyad alanlarını doldurun.');
          setLoading(false);
          return;
        }
        if (password !== passwordConfirm) {
          setError('Şifreler uyuşmuyor.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Şifre en az 6 karakter olmalıdır.');
          setLoading(false);
          return;
        }
        if (!adminCode.trim()) {
          setError('Yönetici kodu zorunludur.');
          setLoading(false);
          return;
        }
        if (!validateAdminCode(adminCode.trim())) {
          setError('Geçersiz yönetici kodu.');
          setLoading(false);
          return;
        }

        const user = await registerUser(email, password, firstName, lastName, true);

        await signIn('credentials', {
          email,
          password,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isAdmin: 'true',
          redirect: false,
        });

        setSuccess('Yönetici kayıt başarılı. Yönetim paneline yönlendiriliyorsunuz...');
        setTimeout(() => { window.location.href = '/admin'; }, 800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Image
              src="/kaswa-logo.png"
              alt="Kaswa Makine"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Yönetici Paneli</h1>
          <p className="text-sm text-slate-500">Bu alan yalnızca yetkili Kaswa Makine yöneticileri içindir.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-lg">
          {/* Tabs */}
          <div className="mb-6 flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`pb-3 px-4 font-bold text-sm tracking-wide transition ${
                mode === 'login' ? 'border-b-2 border-milwaukee text-milwaukee' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              GİRİŞ YAP
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
              className={`pb-3 px-4 font-bold text-sm tracking-wide transition ${
                mode === 'register' ? 'border-b-2 border-milwaukee text-milwaukee' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              KAYIT OL
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3.5 text-sm text-red-600 border border-red-200 font-medium">{error}</div>}
            {success && <div className="rounded-lg bg-green-50 p-3.5 text-sm text-green-600 border border-green-200 font-medium">{success}</div>}

            {mode === 'register' && (
              <>
                {/* Ad */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ad</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Adınız"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
                  />
                </div>
                {/* Soyad */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Soyad</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Soyadınız"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
                  />
                </div>
              </>
            )}

            {/* E-posta */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">E-Posta</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Yönetici E-Posta Adresi"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
              />
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Şifre</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Şifre (en az 6 karakter)' : 'Yönetici Şifreniz'}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                {/* Şifre Tekrar */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Şifre Tekrar</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Şifreyi tekrar giriniz"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                      {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Yönetici Kodu */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-milwaukee" />
                      Yönetici Kodu
                    </span>
                  </label>
                  <input
                    type="password"
                    autoComplete="off"
                    required
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Yönetici kodunuzu giriniz"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-400"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">Yönetici kodu, yetkili personele özel olarak verilir.</p>
                </div>
              </>
            )}

            {/* Submit */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 shadow-md shadow-red-900/20"
              >
                {loading
                  ? (mode === 'login' ? 'GİRİŞ YAPILIYOR...' : 'KAYIT YAPILIYOR...')
                  : (mode === 'login' ? 'YÖNETİCİ OLARAK GİRİŞ YAP' : 'YÖNETİCİ OLARAK KAYIT OL')
                }
              </button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full rounded-xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                MAĞAZAYA DÖN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
