'use client';

import { useState } from 'react';
import { loginUser, registerUser } from '../../lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New state variables for the requested layout
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isNotTC, setIsNotTC] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        if (password === 'kaswamakina') {
           await loginUser(email, password);
           setSuccess('Yönetici girişi başarılı. Yönetim paneline yönlendiriliyorsunuz...');
           window.location.href = '/admin';
           return;
        }

        await loginUser(email, password);
        setSuccess('Giriş başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
        window.location.href = '/hesabim';
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          setError('Lütfen ad ve soyad alanlarını doldurun.');
          return;
        }
        if (password !== passwordConfirm) {
          setError('Şifreler uyuşmuyor.');
          return;
        }
        await registerUser(email, password, firstName, lastName);
        if (password === 'kaswamakina') {
           setSuccess('Yönetici kayıt başarılı. Yönetim paneline yönlendiriliyorsunuz...');
           window.location.href = '/admin';
        } else {
           setSuccess('Kayıt başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
           window.location.href = '/hesabim';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-sm border border-slate-200 bg-white p-6 md:p-10 shadow-sm mt-8 mb-16">
      
      {/* Tabs */}
      <div className="mb-8 flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`pb-4 px-2 font-bold text-sm tracking-wide ${
            mode === 'register' ? 'border-b-2 border-milwaukee text-milwaukee' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ÜYE KAYIT
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`pb-4 ml-6 px-2 font-bold text-sm tracking-wide ${
            mode === 'login' ? 'border-b-2 border-milwaukee text-milwaukee' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ÜYE GİRİŞİ
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded bg-red-50 p-4 text-sm text-red-600 border border-red-200">{error}</div>}
        {success && <div className="rounded bg-green-50 p-4 text-sm text-green-600 border border-green-200">{success}</div>}

        {mode === 'register' ? (
          <>
            {/* Ad */}
            <div>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ad *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>

            {/* Soyad */}
            <div>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Soyad *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>

            {/* T.C. Kimlik */}
            <div className="relative flex items-center">
              <input
                type="text"
                disabled={isNotTC}
                placeholder="T.C. Kimlik No"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-40 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500 disabled:bg-slate-50"
              />
              <div className="absolute right-4 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="notTC" 
                  checked={isNotTC}
                  onChange={(e) => setIsNotTC(e.target.checked)}
                  className="rounded border-slate-300 text-milwaukee focus:ring-milwaukee" 
                />
                <label htmlFor="notTC" className="text-xs text-slate-700 cursor-pointer">T.C. Uyruklu Değilim</label>
              </div>
            </div>

            {/* Cinsiyet */}
            <div>
              <select className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-milwaukee appearance-none">
                <option value="">Cinsiyet</option>
                <option value="erkek">Erkek</option>
                <option value="kadin">Kadın</option>
              </select>
            </div>

            {/* E-posta */}
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresi *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>

            {/* İl ve İlçe */}
            <div>
              <select className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-milwaukee appearance-none mb-4">
                <option value="">İl Seçiniz</option>
                <option value="antalya">Antalya</option>
                <option value="istanbul">İstanbul</option>
                <option value="ankara">Ankara</option>
                <option value="izmir">İzmir</option>
              </select>
              
              <input
                type="text"
                placeholder="İlçe"
                className="w-full rounded border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>

            {/* Şifre */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Şifre Tekrar */}
            <div className="relative flex items-center">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Şifre Tekrar *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Checkboxes */}
            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme e-postalarını almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme sms'lerini almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme aramalarını almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Üyelik Sözleşmesi'ni</span> okudum ve kabul ediyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">KVKK Sözleşmesi'ni</span> okudum ve kabul ediyorum.
                </label>
              </div>
            </div>

            <button className="w-full rounded bg-milwaukee px-5 py-3.5 mt-2 text-sm font-bold text-white transition hover:bg-red-700">
              KAYIT OL
            </button>
          </>
        ) : (
          /* LOGIN FORM */
          <>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi giriniz"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi giriniz"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="rememberMe" className="rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">Beni Hatırla</label>
              </div>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-milwaukee">Şifremi Unuttum</a>
            </div>

            <div className="pt-4 space-y-3">
              <button className="w-full rounded bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700">
                GİRİŞ YAP
              </button>
              <button 
                type="button"
                onClick={() => window.location.href = '/checkout'}
                className="w-full rounded bg-[#2b2b2b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black"
              >
                ÜYE OLMADAN DEVAM ET
              </button>
              <button 
                type="button"
                onClick={async () => {
                  try {
                    await loginUser('admin@milwaukee.com', 'admin');
                    setSuccess('Yönetici girişi başarılı. Yönetim paneline yönlendiriliyorsunuz...');
                    window.location.href = '/admin';
                  } catch (err) {
                    setError('Yönetici girişi başarısız.');
                  }
                }}
                className="w-full rounded border border-slate-300 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                YÖNETİCİ OLARAK GİRİŞ YAP
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
