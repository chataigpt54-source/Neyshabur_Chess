import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Calendar,
  Download,
  Gavel,
  LogOut,
  Users,
  Trophy,
} from 'lucide-react';

import {
  isRefereeAuthenticated,
} from '@/lib/auth';

import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function RefereeDashboard() {
  const authenticated = await isRefereeAuthenticated();

  if (!authenticated) {
    redirect('/referee/login');
  }

  const supabase = createServerClient();

  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('referee_enabled', true)
    .order('start_date', {
      ascending: false,
    });

  const items = tournaments || [];

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold-500 flex items-center justify-center">
              <Gavel className="w-6 h-6 text-navy-900" />
            </div>

            <div>
              <h1 className="font-bold">
                پنل داور
              </h1>

              <p className="text-xs text-turquoise-200">
                هیأت شطرنج شهرستان نیشابور
              </p>
            </div>
          </div>

          <form action="/api/referee/auth/logout" method="POST">
            <button
              className="flex items-center gap-2 text-sm text-red-200 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </form>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-800">
            مسابقات فعال
          </h2>

          <p className="text-slate-500 mt-1">
            مسابقاتی که برای داور فعال شده‌اند
          </p>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy className="w-12 h-12 mx-auto text-slate-300 mb-4" />

            <h3 className="font-bold text-navy-800 mb-2">
              مسابقه فعالی وجود ندارد
            </h3>

            <p className="text-sm text-slate-500">
              در حال حاضر مسابقه‌ای برای پنل داور فعال نشده است.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {items.map((tournament) => (
              <div
                key={tournament.id}
                className="card p-6"
              >

                <div className="flex items-start justify-between gap-3 mb-5">

                  <div className="w-11 h-11 rounded-xl bg-turquoise-50 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-turquoise-600" />
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    فعال
                  </span>

                </div>

                <h3 className="font-bold text-lg text-navy-800 mb-4">
                  {tournament.title}
                </h3>

                <div className="space-y-2 text-sm text-slate-500 mb-6">

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-turquoise-600" />
                    {tournament.start_date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-turquoise-600" />
                    مشاهده شرکت‌کنندگان
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-2">

                  <Link
                    href={`/referee/tournaments/${tournament.id}`}
                    className="btn-primary text-center text-sm"
                  >
                    شرکت‌کنندگان
                  </Link>

                  {tournament.referee_file_url && (
                    <a
                      href={tournament.referee_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-navy-700 hover:bg-slate-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Excel
                    </a>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}
