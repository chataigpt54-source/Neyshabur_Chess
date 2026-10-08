import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  ArrowRight,
  Download,
  Search,
  Users,
} from 'lucide-react';

import { isRefereeAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function RefereeParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const authenticated = await isRefereeAuthenticated();

  if (!authenticated) {
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

  const { data: registrations } = await supabase
    .from('registrations')
    .select('*')
    .eq('tournament_id', params.id)
    .order('created_at', {
      ascending: true,
    });

  const participants = registrations || [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100"
    >

      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-bold">
            پنل داور
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        <Link
          href="/referee"
          className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-6 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به مسابقات
        </Link>

        <div className="card p-6 mb-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-navy-800">
                {tournament.title}
              </h2>

              <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                <Users className="w-4 h-4" />
                {participants.length} شرکت‌کننده
              </div>
            </div>

            {tournament.referee_file_url && (
              <a
                href={tournament.referee_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                دانلود Excel
              </a>
            )}

          </div>

        </div>

        <div className="card overflow-hidden">

          {participants.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              هنوز ثبت‌نامی برای این مسابقه ثبت نشده است.
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-100">

                <div className="relative max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    className="input-field w-full pr-10"
                    placeholder="جست‌وجوی نام شرکت‌کننده..."
                  />
                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-slate-50 text-slate-600">

                      <th className="px-4 py-3 text-right">
                        #
                      </th>

                      <th className="px-4 py-3 text-right">
                        نام و نام خانوادگی
                      </th>

                      <th className="px-4 py-3 text-right">
                        تلفن
                      </th>

                      <th className="px-4 py-3 text-right">
                        ایمیل
                      </th>

                      <th className="px-4 py-3 text-right">
                        وضعیت
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {participants.map((participant, index) => (
                      <tr
                        key={participant.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-4 py-3 text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-navy-800">
                          {participant.full_name}
                        </td>

                        <td className="px-4 py-3 text-slate-600" dir="ltr">
                          {participant.phone}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {participant.email || '—'}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={
                              participant.status === 'approved'
                                ? 'text-green-700 bg-green-100 px-2 py-1 rounded-lg text-xs'
                                : participant.status === 'rejected'
                                  ? 'text-red-700 bg-red-100 px-2 py-1 rounded-lg text-xs'
                                  : 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded-lg text-xs'
                            }
                          >
                            {participant.status === 'approved'
                              ? 'تأیید شده'
                              : participant.status === 'rejected'
                                ? 'رد شده'
                                : 'در انتظار'}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </>
          )}

        </div>

      </main>

    </div>
  );
}
