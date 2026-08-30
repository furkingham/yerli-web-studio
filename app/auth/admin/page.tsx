'use client';

import { useState } from 'react';
import { loginUser } from '../../../lib/auth';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminAuthPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      if (!user.isAdmin) {
        throw new Error('Bu hesabın yönetici yetkisi bulunmuyor. Yönetici yetkisi almak için Üye Kayıt ekranından yönetici kodunuzla yeni kayıt açınız.');
      }

      // NextAuth session oluştur (Credentials provider)
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

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-sm border border-slate-200 bg-white p-6 md:p-10 shadow-sm mt-8 mb-16">
      
      <div className="flex flex-col items-center justify-center mb-8 pb-6 border-b border-slate-200 text-center">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8 text-milwaukee" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Yönetici Girişi</h1>
        <p className="text-sm text-slate-500">Bu alan yalnızca yetkili Kaswa Makine yöneticileri içindir.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded bg-red-50 p-4 text-sm text-red-600 border border-red-200">{error}</div>}
        {success && <div className="rounded bg-green-50 p-4 text-sm text-green-600 border border-green-200">{success}</div>}

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">E-Posta</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Yönetici E-Posta Adresi"
            className="w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
          />
        </div>

        <div className="relative flex flex-col">
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Şifre</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yönetici Şifreniz"
              className="w-full rounded border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-milwaukee placeholder:text-slate-500"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded bg-milwaukee px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 shadow-md shadow-red-900/20"
          >
            {loading ? 'GİRİŞ YAPILIYOR...' : 'YÖNETİCİ OLARAK GİRİŞ YAP'}
          </button>
          
          <button 
            type="button"
            onClick={() => router.push('/auth')}
            className="w-full rounded bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            NORMAL KULLANICI GİRİŞİNE DÖN
          </button>
        </div>
      </form>
    </div>
  );
}
