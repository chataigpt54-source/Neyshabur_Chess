import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

export const revalidate = 60;

async function getTournament(id: string) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('tournaments').select('*').eq('id', id).single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const t = await getTournament(params.id);
  return { title: t?.title || 'تورنمنت' };
}

const statusMap = {
  upcoming: { label: 'آینده', class: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'در حال برگزاری', class: 'bg-green-100 text-green-700' },
  past: { label: 'گذشته', class: 'bg-slate-100 text-slate-600' },
};

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const tournament = await getTournament(params.id);
  if (!tournament) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/tournaments" className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-8 text-sm font-medium">
        <ArrowRight className="w-4 h-4" />
        بازگشت به تورنمنت‌ها
      </Link>

      <div className="card overflow-hidden mb-8">
        {tournament.image_url && (
          <div className="aspect-[21/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tournament.image_url} alt={tournament.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusMap[tournament.status].class}`}>
              {statusMap[tournament.status].label}
            </span>
            {tournament.registration_open && tournament.status !== 'past' && (
              <span className="text-sm px-3 py-1 rounded-full bg-gold-100 text-gold-700 font-medium">
                ثبت‌نام باز است
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">{tournament.title}</h1>

          <div className="flex flex-wrap gap-6 text-slate-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-turquoise-600" />
              {formatDate(tournament.start_date)}
              {tournament.end_date && tournament.end_date !== tournament.start_date && (
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
              {tournament.description}
            </div>
          )}
        </div>
      </div>

      {/* Registration Form */}
      {tournament.registration_open && tournament.status !== 'past' && (
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-500" />
            ثبت‌نام در تورنمنت
          </h2>
          <RegistrationForm tournamentId={tournament.id} />
        </div>
      )}
    </div>
  );
}
