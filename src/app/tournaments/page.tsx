import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import {
  Trophy,
  CalendarDays,
  MapPin,
  ArrowLeft,
  Sparkles,
  Users,
  Flag,
} from 'lucide-react';

export const metadata = {
  title: 'تورنمنت‌ها | هیأت شطرنج شهرستان نیشابور',
  description:
    'مشاهده مسابقات شطرنج، زمان برگزاری، محل مسابقه و شرایط ثبت‌نام در شهرستان نیشابور',
};

export const revalidate = 60;

async function getTournaments() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching tournaments:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
}

const statusMap: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  upcoming: {
    label: 'پیش رو',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
  },
  ongoing: {
    label: 'در حال برگزاری',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  past: {
    label: 'برگزارشده',
    className: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
};

function getStatus(status: string | null) {
  return statusMap[status || ''] || statusMap.past;
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  const registrationCount = tournaments.filter(
    (t) => t.registration_open && t.status !== 'past'
  ).length;

  return (
    <main className="min-h-screen bg-[#f3f6f9] pb-20" dir="rtl">
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#091a30]/95 via-[#0b2342]/95 to-[#071a32]/95" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-300" />
                رقابت، تجربه و پیشرفت
              </div>

              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                تورنمنت‌های شطرنج
                <span className="mt-3 block text-teal-300">
                  میدان حرکت‌های هوشمندانه
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                مسابقات و رویدادهای شطرنج شهرستان نیشابور را دنبال کنید؛
                از جزئیات برگزاری و نتایج گرفته تا فرصت‌های ثبت‌نام.
              </p>
            </div>

            <div className="hidden md:flex md:justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20">
                <Trophy
                  className="h-14 w-14 text-amber-300"
                  strokeWidth={1.4}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
              <Flag className="h-4 w-4 text-teal-300" />
              {tournaments.length.toLocaleString('fa-IR')} تورنمنت
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
              <Users className="h-4 w-4 text-amber-300" />
              {registrationCount.toLocaleString('fa-IR')} تورنمنت با ثبت‌نام باز
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            تقویم مسابقات
          </div>

          <h2 className="text-2xl font-black text-[#10233d] sm:text-3xl">
            فهرست تورنمنت‌ها
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            برای مشاهده اطلاعات کامل هر مسابقه، روی کارت آن کلیک کنید.
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white px-5 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <Trophy className="h-9 w-9" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#10233d]">
              تورنمنتی ثبت نشده است
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              اطلاعات مسابقات پس از ثبت در پنل مدیریت در این بخش نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {tournaments.map((t) => {
              const status = getStatus(t.status);
              const hasImages = Boolean(t.image_url || t.image_url_2);

              return (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/[0.06]"
                >
                  {hasImages ? (
                    <div className="grid grid-cols-1 gap-1.5 bg-slate-100 p-1.5 sm:grid-cols-2">
                      {t.image_url && (
                        <div
                          className={`flex min-h-40 items-center justify-center overflow-hidden rounded-xl bg-white ${
                            !t.image_url_2 ? 'sm:col-span-2' : ''
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.image_url}
                            alt={t.title || 'تصویر تورنمنت'}
                            loading="lazy"
                            className="max-h-80 w-full object-contain transition duration-500 group-hover:scale-[1.01]"
                          />
                        </div>
                      )}

                      {t.image_url_2 && (
                        <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.image_url_2}
                            alt={`${t.title || 'تورنمنت'} - تصویر دوم`}
                            loading="lazy"
                            className="max-h-80 w-full object-contain transition duration-500 group-hover:scale-[1.01]"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-gradient-to-l from-[#0b2342] to-[#102f4d] px-6 py-7">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                        <Trophy className="h-7 w-7 text-amber-300" />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">هیأت شطرنج نیشابور</p>
                        <p className="mt-1 font-semibold text-white">رویداد شطرنج</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>

                      {t.registration_open && t.status !== 'past' && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                          ثبت‌نام باز است
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold leading-8 text-[#10233d] transition-colors group-hover:text-teal-700 sm:text-xl">
                      {t.title}
                    </h3>

                    <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
                      {t.start_date && (
                        <div className="flex items-start gap-2.5">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />

                          <span>
                            {formatDate(t.start_date)}
                            {t.end_date && t.end_date !== t.start_date && (
                              <> تا {formatDate(t.end_date)}</>
                            )}
                          </span>
                        </div>
                      )}

                      {t.location && (
                        <div className="flex items-start gap-2.5">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                          <span>{t.location}</span>
                        </div>
                      )}

                      {t.max_participants && (
                        <div className="flex items-start gap-2.5">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                          <span>
                            حداکثر {t.max_participants.toLocaleString('fa-IR')} شرکت‌کننده
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="mb-4 h-px bg-slate-100" />

                      <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition group-hover:gap-3">
                        مشاهده جزئیات تورنمنت
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
