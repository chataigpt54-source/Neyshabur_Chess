'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(3, 'نام کامل الزامی است'),
  phone: z.string().min(10, 'شماره موبایل معتبر وارد کنید').max(15),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  national_id: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationForm({ tournamentId }: { tournamentId: string }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const { error: dbError } = await supabase.from('registrations').insert({
        tournament_id: tournamentId,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        national_id: data.national_id || null,
        notes: data.notes || null,
        status: 'pending',
      });

      if (dbError) throw dbError;
      setSuccess(true);
      reset();
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.'
      );
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-navy-800 mb-2">ثبت‌نام با موفقیت انجام شد</h3>
        <p className="text-slate-500">درخواست شما ثبت شد و پس از بررسی اطلاع‌رسانی خواهد شد.</p>
        <button onClick={() => setSuccess(false)} className="btn-outline mt-6">
          ثبت‌نام جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">نام و نام خانوادگی *</label>
        <input {...register('full_name')} className="input-field" placeholder="مثال: علی رضایی" />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">شماره موبایل *</label>
        <input
          {...register('phone')}
          className="input-field"
          placeholder="09xxxxxxxxx"
          dir="ltr"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">ایمیل</label>
        <input
          {...register('email')}
          type="email"
          className="input-field"
          placeholder="email@example.com"
          dir="ltr"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">کد ملی</label>
        <input
          {...register('national_id')}
          className="input-field"
          placeholder="اختیاری"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1.5">توضیحات</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="input-field resize-none"
          placeholder="توضیحات اضافی (اختیاری)"
        />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
<button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            در حال ثبت...
          </>
        ) : (
          'ثبت‌نام'
        )}
      </button>
    </form>
  );
}