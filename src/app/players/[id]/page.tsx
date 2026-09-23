import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { ArrowRight, User, Award } from 'lucide-react';

export const revalidate = 60;

async function getPlayer(id: string) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('players').select('*').eq('id', id).single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const player = await getPlayer(params.id);
  return { title: player?.name || 'بازیکن' };
}

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const player = await getPlayer(params.id);
  if (!player) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/players" className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-8 text-sm font-medium">
        <ArrowRight className="w-4 h-4" />
        بازگشت به لیست بازیکنان
      </Link>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-l from-navy-800 to-turquoise-700 h-32 md:h-40" />
        <div className="px-6 md:px-10 pb-10 -mt-16 md:-mt-20">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-soft-lg bg-white">
            {player.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <User className="w-16 h-16 text-slate-400" />
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy-800 mt-6">{player.name}</h1>

          {player.bio && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-navy-700 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-turquoise-600" />
                بیوگرافی
              </h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-5">
                {player.bio}
              </div>
            </section>
          )}

          {player.achievements && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-navy-700 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" />
                مقام‌ها و افتخارات
              </h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-gold-50 rounded-xl p-5 border border-gold-100">
                {player.achievements}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
