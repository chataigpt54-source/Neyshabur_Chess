import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { Users, User } from 'lucide-react';

export const metadata = { title: 'بازیکنان' };
export const revalidate = 60;

async function getPlayers() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('name', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Users className="w-8 h-8 text-turquoise-600" />
        بازیکنان
      </h1>

      {players.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl">هنوز بازیکنی ثبت نشده است</p>
          <p className="text-slate-400 mt-2">بازیکنان از پنل مدیریت اضافه می‌شوند</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="card group hover:-translate-y-1 text-center"
            >
              <div className="p-6">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-turquoise-100 to-navy-100 shadow-soft mb-4 ring-4 ring-white group-hover:ring-turquoise-200 transition-all">
                  {player.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-turquoise-400" />
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-navy-800 group-hover:text-turquoise-700 transition-colors text-lg">
                  {player.name}
                </h2>
                {player.bio && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{player.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
