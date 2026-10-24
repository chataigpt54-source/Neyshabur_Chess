import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  Trophy,
  CalendarDays,
  MapPin,
  Users,
  Medal,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

type TournamentResult = {
  period?: string;
  first?: string;
  second?: string;
  third?: string;
};

function parseResults(value: unknown): TournamentResult[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is TournamentResult =>
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item)
  );
}

async function getTournament(id: string) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching tournament:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const tournament = await getTournament(id);

  return {
    title: tournament?.title
      ? `${tournament.title} | تورنمنت‌های شطرنج نیشابور`
      : 'تورنمنت | هیأت شطرنج شهرستان نیشابور',
    description:
      tournament?.description?.replace(/\s+/g, ' ').slice(0, 160) ||
      'جزئیات مسابقات و تورنمنت‌های هیأت شطرنج شهرستان نیشابور',
  };
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

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
        >
          {part}
          <ExternalLink className="mr-1 inline h-3.5 w-3.5" />
        </a>
      );
    }

    return part;
  });
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tournament = await getTournament(id);

  if (!tournament) notFound();

  const status = statusMap[tournament.status] || statusMap.past;
  const hasImages = Boolean(tournament.image_url || tournament.image_url_2);
  const results = parseResults(tournament.results);
  const registrationAvailable =
    tournament.registration_open && tournament.status !== 'past';

  return (
    <main className="min-h-screen bg-[#f3f6f9] pb-20" dir="rtl">
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#091a30]/95 via-[#0b2342]/95 to-[#071a32]/95" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/tournaments"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به تورنمنت‌ها
          </Link>

          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-teal-300">
            <Sparkles className="h-4 w-4 text-amber-300" />
            هیأت شطرنج شهرستان نیشابور
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {registrationAvailable && (
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                ثبت‌نام باز است
              </span>
            )}
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-relaxed text-white sm:text-4xl lg:text-5xl">
            {tournament.title}
          </h1>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4 text-sm text-slate-300">
            {tournament.start_date && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-teal-300" />
                <span>
                  {formatDate(tournament.start_date)}
                  {tournament.end_date &&
                    tournament.end_date !== tournament.start_date &&
                    <> تا {formatDate(tournament.end_date)}</>}
                </span>
              </div>
            )}

            {tournament.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-300" />
                {tournament.location}
              </div>
            )}

            {tournament.max_participants && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-300" />
                حداکثر {tournament.max_participants.toLocaleString('fa-IR')} نفر
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:rounded-3xl">
          {hasImages && (
            <div className="space-y-2 bg-slate-100 p-2 sm:p-3">
              {tournament.image_url && (
                <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tournament.image_url}
                    alt={tournament.title || 'تصویر تورنمنت'}
                    fetchPriority="high"
                    className="max-h-[600px] w-full object-contain"
                  />
                </div>
              )}

              {tournament.image_url_2 && (
                <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tournament.image_url_2}
                    alt={`${tournament.title || 'تورنمنت'} - تصویر دوم`}
                    loading="lazy"
                    className="max-h-[600px] w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-teal-500" />
              <h2 className="text-xl font-black text-[#10233d]">درباره تورنمنت</h2>
            </div>

            {tournament.description ? (
              <div className="whitespace-pre-wrap break-words text-base leading-9 text-slate-600">
                {linkify(tournament.description)}
              </div>
            ) : (
              <p className="text-sm leading-7 text-slate-500">
                توضیحات تکمیلی برای این تورنمنت ثبت نشده است.
              </p>
            )}
          </div>
        </section>

        {results.length > 0 && (
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Medal className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#10233d]">نفرات برتر</h2>
                <p className="mt-1 text-sm text-slate-500">
                  نتایج ثبت‌شده این تورنمنت
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {results.map((result, index) => (
                <div key={`${result.period || 'results'}-${index}`}>
                  {result.period && (
                    <h3 className="mb-3 font-bold text-[#10233d]">
                      {result.period}
                    </h3>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[280px] text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="w-28 px-4 py-3 text-right font-semibold">
                            رتبه
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            نام شرکت‌کننده
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {[
                          { label: 'اول', value: result.first, style: 'bg-amber-50 text-amber-700', number: '۱' },
                          { label: 'دوم', value: result.second, style: 'bg-slate-100 text-slate-600', number: '۲' },
                          { label: 'سوم', value: result.third, style: 'bg-orange-50 text-orange-700', number: '۳' },
                        ].map((winner) => (
                          <tr key={winner.label} className="transition hover:bg-slate-50">
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-2 font-medium text-slate-600">
                                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${winner.style}`}>
                                  {winner.number}
                                </span>
                                {winner.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-[#10233d]">
                              {winner.value || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {registrationAvailable && (
          <section className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm sm:rounded-3xl">
            <div className="bg-gradient-to-l from-[#0b2342] to-[#102f4d] p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08]">
                  <Trophy className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    ثبت‌نام در تورنمنت
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    فرم زیر را برای ثبت درخواست شرکت در مسابقه تکمیل کنید.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <RegistrationForm
                tournamentId={tournament.id}
                tournamentTitle={tournament.title}
              />
            </div>
          </section>
        )}

        <div className="pb-4 text-center">
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#10233d] shadow-sm transition hover:border-teal-200 hover:text-teal-700"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به فهرست تورنمنت‌ها
          </Link>
        </div>
      </div>
    </main>
  );
}
