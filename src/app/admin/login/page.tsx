'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, Crown } from 'lucide-react';

const schema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'خطا در ورود');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('خطای شبکه. دوباره تلاش کنید.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-navy-900 to-turquoise-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500 flex items-center justify-center shadow-gold mb-4">
            <Crown className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">پنل مدیریت</h1>
          <p className="text-turquoise-200 text-sm mt-1">هیأت شطرنج شهرستان نیشابور</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-soft-lg p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">نام کاربری</label>
            <input {...register('username')} className="input-field" placeholder="Admin" autoComplete="username" />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">رمز عبور</label>
            <input
              {...register('password')}
              type="password"
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ورود...
              </>
            ) : (
              'ورود به پنل'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
