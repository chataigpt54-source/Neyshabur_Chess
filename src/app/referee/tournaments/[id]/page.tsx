
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Download, Users } from 'lucide-react';

import { isRefereeAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import {
  getTallyParticipants,
  type TallyParticipant,
} from '@/lib/tally';

import ParticipantsTable from './ParticipantsTable';

export const dynamic = 'force-dynamic';

export default async function RefereeParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  if (!(await isRefereeAuthenticated())) {
    redirect('/referee/login');
  }

  const supabase = createServerClient();

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', params.id)
    .eq('referee_enabled', true)
    .single();

  if (!tournament) {
    notFound();
  }

  let participants: TallyParticipant[] = [];
  let error: string | null = null;

  try {
    participants = await getTallyParticipants();
  } catch (err) {
    console.error('Tally participants error:', err);

    error =
      err instanceof Error
        ? err.message
        : 'دریافت اطلاعات از Tally ناموفق بود.';
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100">
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-bold">پنل داور</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/referee"
          className="inline-flex items-center gap-2 text-turquoise-600 mb-6 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به مسابقات
        </Link>

        <section className="card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy-800">
                {tournament.title}
              </h2>

              <p className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                <Users className="w-4 h-4" />
                {participants.length} شرکت‌کننده از Tally
              </p>
            </div>

            <a
              href={`/referee/tournaments/${params.id}/export`}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              دانلود Excel تکمیل‌شده
            </a>
          </div>
        </section>

        {error ? (
          <div className="card p-6 text-red-700">
            <p className="font-bold mb-2">
              خطا در دریافت ثبت‌نام‌ها
            </p>

            <p>{error}</p>

            <p className="text-sm mt-3">
              مقدارهای TALLY_API_KEY و TALLY_FORM_ID را در تنظیمات
              Environment Variables در Vercel بررسی کن.
            </p>
          </div>
        ) : (
          <ParticipantsTable participants={participants} />
        )}
      </main>
    </div>
  );
}
