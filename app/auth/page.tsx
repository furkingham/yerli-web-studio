'use client';

import { useState, useEffect } from 'react';
import { loginUser, registerUser, clearAllUsers, resetPassword, isEmailRegistered, validateAdminCode, registerGoogleUser, getCurrentUser } from '../../lib/auth';
import { Eye, EyeOff, X } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { iller, getIlceler } from '../../data/turkiye-lokasyonlari';

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isNotTC, setIsNotTC] = useState(false);


  // İl / İlçe
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Şifremi Unuttum modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetNewPasswordConfirm, setResetNewPasswordConfirm] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // İlk yüklemede eski hesapları temizle (bir kerelik)
  useEffect(() => {
    const cleaned = window.localStorage.getItem('milwaukee_auth_cleaned_v2');
    if (!cleaned) {
      clearAllUsers();
      window.localStorage.setItem('milwaukee_auth_cleaned_v2', 'true');
    }
  }, []);

  // Eğer kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      if (currentUser.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/hesabim');
      }
    }
  }, [router]);

  // Google ile giriş yapıldıysa, LocalStorage'a senkronize et ve yönlendir
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      registerGoogleUser(session.user.email, session.user.name || session.user.email);
      router.push('/hesabim');
    }
  }, [status, session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginUser(email, password);

        // NextAuth session oluştur (Credentials provider)
        await signIn('credentials', {
          email,
          password,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isAdmin: String(user.isAdmin || false),
          redirect: false,
        });

        if (user.isAdmin) {
          setSuccess('Yönetici girişi başarılı. Yönetim paneline yönlendiriliyorsunuz...');
          setTimeout(() => { window.location.href = '/admin'; }, 800);
        } else {
          setSuccess('Giriş başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
          setTimeout(() => { window.location.href = '/hesabim'; }, 800);
        }
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

        const user = await registerUser(email, password, firstName, lastName, false);

        // NextAuth session oluştur
        await signIn('credentials', {
          email,
          password,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isAdmin: 'false',
          redirect: false,
        });

        setSuccess('Kayıt başarılı. Hesabım sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => { window.location.href = '/hesabim'; }, 800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/auth' });
  };

  const handleResetPassword = async () => {
    setResetError(null);
    setResetSuccess(null);

    if (!resetEmail.trim()) {
      setResetError('Lütfen e-posta adresinizi girin.');
      return;
    }

    if (!isEmailRegistered(resetEmail)) {
      setResetError('Bu e-posta adresi kayıtlı değil.');
      return;
    }

    if (!resetNewPassword.trim()) {
      setResetError('Lütfen yeni şifrenizi girin.');
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (resetNewPassword !== resetNewPasswordConfirm) {
      setResetError('Şifreler uyuşmuyor.');
      return;
    }

    const result = await resetPassword(resetEmail, resetNewPassword);
    if (result) {
      setResetSuccess('Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.');
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail('');
        setResetNewPassword('');
        setResetNewPasswordConfirm('');
        setResetSuccess(null);
        setMode('login');
      }, 2000);
    } else {
      setResetError('Şifre sıfırlama başarısız.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-sm border border-slate-200 bg-white p-6 md:p-10 shadow-sm mt-8 mb-16">
      
      <h2 className="mb-8 text-2xl font-extrabold text-slate-900 text-center">
        {mode === 'login' ? 'Üye Girişi' : 'Yeni Üye Kaydı'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded bg-red-50 p-4 text-sm text-red-600 border border-red-200">{error}</div>}
        {success && <div className="rounded bg-green-50 p-4 text-sm text-green-600 border border-green-200">{success}</div>}

        {mode === 'register' ? (
          <>
            {/* Ad */}
            <div>
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
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
                name="lastName"
                autoComplete="family-name"
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
                name="tcKimlik"
                disabled={isNotTC}
                placeholder="T.C. Kimlik No"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-40 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500 disabled:bg-slate-50"
              />
              <div className="absolute right-4 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="notTC" 
                  name="notTC"
                  checked={isNotTC}
                  onChange={(e) => setIsNotTC(e.target.checked)}
                  className="rounded border-slate-300 text-milwaukee focus:ring-milwaukee" 
                />
                <label htmlFor="notTC" className="text-xs text-slate-700 cursor-pointer">T.C. Uyruklu Değilim</label>
              </div>
            </div>

            {/* Cinsiyet */}
            <div>
              <select name="gender" className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-milwaukee appearance-none">
                <option value="">Cinsiyet</option>
                <option value="erkek">Erkek</option>
                <option value="kadin">Kadın</option>
              </select>
            </div>

            {/* E-posta */}
            <div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresi *"
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
              />
            </div>

            {/* İl ve İlçe */}
            <div>
              <select
                name="city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedDistrict('');
                }}
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-milwaukee appearance-none mb-4"
              >
                <option value="">İl Seçiniz</option>
                {iller.map((il) => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
              
              <select
                name="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCity}
                className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-milwaukee appearance-none disabled:bg-slate-50"
              >
                <option value="">İlçe Seçiniz</option>
                {selectedCity && getIlceler(selectedCity).map((ilce) => (
                  <option key={ilce} value={ilce}>{ilce}</option>
                ))}
              </select>
            </div>

            {/* Şifre */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre * (en az 6 karakter)"
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
                name="passwordConfirm"
                autoComplete="new-password"
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
                <input type="checkbox" name="consentEmail" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme e-postalarını almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" name="consentSms" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme sms&apos;lerini almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" name="consentCall" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Ticari Elektronik İleti Onayı</span> metnini okudum, onaylıyorum. Tarafınızdan gönderilecek bilgilendirme aramalarını almak istiyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" name="agreement" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">Üyelik Sözleşmesi&apos;ni</span> okudum ve kabul ediyorum.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" name="kvkk" className="mt-1 rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label className="text-xs text-slate-600 leading-tight">
                  <span className="font-semibold underline decoration-slate-300 underline-offset-2">KVKK Sözleşmesi&apos;ni</span> okudum ve kabul ediyorum.
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'İŞLENİYOR...' : 'KAYIT OL'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full rounded border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                GİRİŞ EKRANINA DÖN
              </button>
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 w-full rounded border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Google ile Kayıt Ol
              </button>
            </div>
          </>
        ) : (
          /* LOGIN FORM */
          <>
            <div>
              <input
                type="email"
                name="email"
                autoComplete="email"
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
                name="password"
                autoComplete="current-password"
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
                <input type="checkbox" id="rememberMe" name="rememberMe" className="rounded border-slate-300 text-milwaukee focus:ring-milwaukee" />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">Beni Hatırla</label>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetError(null);
                  setResetSuccess(null);
                  setResetEmail('');
                  setResetNewPassword('');
                  setResetNewPasswordConfirm('');
                }}
                className="text-sm font-medium text-slate-600 hover:text-milwaukee"
              >
                Şifremi Unuttum
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full rounded border-2 border-milwaukee bg-white px-5 py-3.5 text-sm font-bold text-milwaukee transition hover:bg-red-50"
              >
                KAYIT OL
              </button>
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 w-full rounded border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Google ile Giriş Yap
              </button>
              <button 
                type="button"
                onClick={() => window.location.href = '/checkout'}
                className="w-full rounded bg-[#2b2b2b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black"
              >
                ÜYE OLMADAN DEVAM ET
              </button>
            </div>
          </>
        )}
      </form>

      {/* Şifremi Unuttum Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md mx-4 rounded-lg bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 text-lg font-bold text-slate-900">Şifre Sıfırlama</h2>

            {resetError && (
              <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">{resetError}</div>
            )}
            {resetSuccess && (
              <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600 border border-green-200">{resetSuccess}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">E-posta Adresi</label>
                <input
                  type="email"
                  name="resetEmail"
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Kayıtlı e-posta adresiniz"
                  className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Yeni Şifre</label>
                <div className="relative flex items-center">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    name="resetNewPassword"
                    autoComplete="new-password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Yeni şifreniz (en az 6 karakter)"
                    className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
                  />
                  <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                    {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Yeni Şifre Tekrar</label>
                <input
                  type="password"
                  name="resetNewPasswordConfirm"
                  autoComplete="new-password"
                  value={resetNewPasswordConfirm}
                  onChange={(e) => setResetNewPasswordConfirm(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar giriniz"
                  className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full rounded bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                ŞİFREYİ SIFIRLA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
