import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { Newspaper, Users, Trophy, Image } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'داشبورد | پنل مدیریت' };

async function getStats() {
  const supabase = createServerClient();
  const [news, players, tournaments, gallery] = await Promise.all([
    supabase.from('news').select('id', { count: 'exact', head: true }),
    supabase.from('players').select('id', { count: 'exact', head: true }),
    supabase.from('tournaments').select('id', { count: 'exact', head: true }),
    supabase.from('gallery').select('id', { count: 'exact', head: true }),
  ]);
  return {
    news: news.count || 0,
    players: players.count || 0,
    tournaments: tournaments.count || 0,
    gallery: gallery.count || 0,
  };
}

export default async function AdminDashboard() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect('/admin/login');

  const stats = await getStats();

  const cards = [
    { label: 'اخبار', count: stats.news, href: '/admin/news', icon: Newspaper, color: 'from-turquoise-500 to-turquoise-700' },
    { label: 'بازیکنان', count: stats.players, href: '/admin/players', icon: Users, color: 'from-blue-500 to-navy-600' },
    { label: 'تورنمنت‌ها', count: stats.tournaments, href: '/admin/tournaments', icon: Trophy, color: 'from-gold-400 to-gold-600' },
    { label: 'گالری', count: stats.gallery, href: '/admin/gallery', icon: Image, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-8">داشبورد</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} className="card p-5 hover:-translate-y-1 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{c.label}</p>
                  <p className="text-3xl font-bold text-navy-800 mt-1">{c.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-navy-800 mb-3">راهنما</h2>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>از منوی سمت راست بخش‌های مختلف را مدیریت کنید.</li>
          <li>سایت در حالت اولیه خالی است؛ محتوا را از همین پنل اضافه کنید.</li>
          <li>برای آپلود تصویر، ابتدا در Supabase Storage یک باکت public به نام images بسازید.</li>
          <li>رمز عبور ادمین: Admin / Mazda2933 (قابل تغییر از جدول admins)</li>
        </ul>
      </div>
    </div>
  );
}
