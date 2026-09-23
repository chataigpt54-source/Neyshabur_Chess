import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { Trophy, Calendar, MapPin } from 'lucide-react';

export const metadata = { title: 'تورنمنت‌ها' };
export const revalidate = 60;

async function getTournaments() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

const statusMap = {
  upcoming: { label: 'آینده', class: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'در حال برگزاری', class: 'bg-green-100 text-green-700' },
  past: { label: 'گذشته', class: 'bg-slate-100 text-slate-600' },
};

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Trophy className="w-8 h-8 text-turquoise-600" />
        تورنمنت‌ها
      </h1>

      {tournaments.length === 0 ? (
        <div className="card p-16 text-center">
          <Trophy className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl">تورنمنتی ثبت نشده است</p>
          <p className="text-slate-400 mt-2">تورنمنت‌ها از پنل مدیریت اضافه می‌شوند</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="card p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center hover:-translate-y-0.5 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-turquoise-500 to-navy-600 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusMap[t.status].class}`}>
                    {statusMap[t.status].label}
                  </span>
                  {t.registration_open && t.status !== 'past' && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-700 font-medium">
                      ثبت‌نام باز است
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-navy-800 group-hover:text-turquoise-700 transition-colors text-lg">
                  {t.title}
                </h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(t.start_date)}
                    {t.end_date && t.end_date !== t.start_date && ` تا ${formatDate(t.end_date)}`}
                  </span>
                  {t.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {t.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
