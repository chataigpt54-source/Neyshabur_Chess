'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Lock,
  Gavel,
} from 'lucide-react';

export default function RefereeLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/referee/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'خطا در ورود');
        return;
      }

      router.push('/referee');
      router.refresh();
    } catch {
      setError('خطای شبکه. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-navy-900 to-turquoise-900 p-4"
    >
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500 flex items-center justify-center shadow-gold mb-4">
            <Gavel className="w-8 h-8 text-navy-900" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            پنل داور
          </h1>

          <p className="text-turquoise-200 text-sm mt-2">
            هیأت شطرنج شهرستان نیشابور
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-soft-lg p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              نام کاربری
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Refree"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              رمز عبور
            </label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ورود...
              </>
            ) : (
              'ورود به پنل داور'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
