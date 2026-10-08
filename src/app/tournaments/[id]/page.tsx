import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Trophy, Calendar, MapPin, Users, Medal } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

export const revalidate = 60;

type TournamentResult = {
  period?: string;
  first?: string;
  second?: string;
  third?: string;
};

function parseResults(value: unknown): TournamentResult[] {
  if (!Array.isArray(value)) {
    return [];
  }

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

    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTournament(params.id);

  return {
    title: t?.title || 'تورنمنت',
  };
}

const statusMap = {
  upcoming: {
    label: 'آینده',
    class: 'bg-blue-100 text-blue-700',
  },
  ongoing: {
    label: 'در حال برگزاری',
    class: 'bg-green-100 text-green-700',
  },
  past: {
    label: 'گذشته',
    class: 'bg-slate-100 text-slate-600',
  },
};

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-turquoise-600 hover:text-turquoise-700 underline break-all"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

export default async function TournamentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await getTournament(params.id);

  if (!tournament) {
    notFound();
  }

  const hasImages = Boolean(
    tournament.image_url || tournament.image_url_2
  );

  const results = parseResults(tournament.results);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-8 text-sm font-medium"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به تورنمنت‌ها
      </Link>

      <div className="card overflow-hidden mb-8">
        {hasImages && (
          <div className="space-y-0">
            {tournament.image_url && (
              <div className="w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tournament.image_url}
                  alt={tournament.title}
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              </div>
            )}

            {tournament.image_url_2 && (
              <div className="w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tournament.image_url_2}
                  alt={tournament.title}
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              </div>
            )}
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                statusMap[
                  tournament.status as keyof typeof statusMap
                ]?.class || statusMap.past.class
              }`}
            >
              {statusMap[
                tournament.status as keyof typeof statusMap
              ]?.label || 'گذشته'}
            </span>

            {tournament.registration_open &&
              tournament.status !== 'past' && (
                <span className="text-sm px-3 py-1 rounded-full bg-gold-100 text-gold-700 font-medium">
                  ثبت‌نام باز است
                </span>
              )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">
            {tournament.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-slate-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-turquoise-600" />

              {formatDate(tournament.start_date)}

              {tournament.end_date &&
                tournament.end_date !== tournament.start_date && (
                  <> تا {formatDate(tournament.end_date)}</>
                )}
            </span>

            {tournament.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-turquoise-600" />
                {tournament.location}
              </span>
            )}

            {tournament.max_participants && (
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-turquoise-600" />
                حداکثر {tournament.max_participants} نفر
              </span>
            )}
          </div>

          {tournament.description && (
            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-6">
              {linkify(tournament.description)}
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="card p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-gold-500" />
            نفرات برتر
          </h2>

          <div className="space-y-8">
            {results.map((result, index) => (
              <div key={index}>
                {result.period && (
                  <h3 className="text-lg font-semibold text-navy-700 mb-3">
                    {result.period}
                  </h3>
                )}

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="py-3 px-4 text-right font-medium w-24">
                          رتبه
                        </th>
                        <th className="py-3 px-4 text-right font-medium">
                          نام
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-gold-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 font-medium text-gold-700">
                            <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-xs">
                              ۱
                            </span>
                            اول
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-navy-800">
                          {result.first || '—'}
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                            <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                              ۲
                            </span>
                            دوم
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-navy-800">
                          {result.second || '—'}
                        </td>
                      </tr>

                      <tr className="hover:bg-orange-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 font-medium text-orange-700">
                            <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">
                              ۳
                            </span>
                            سوم
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-navy-800">
                          {result.third || '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tournament.registration_open &&
        tournament.status !== 'past' && (
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold-500" />
              ثبت‌نام در تورنمنت
            </h2>

            <RegistrationForm
              tournamentId={tournament.id}
              tournamentTitle={tournament.title}
            />
          </div>
        )}
    </div>
  );
}
