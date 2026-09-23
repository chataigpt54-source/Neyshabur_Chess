import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, truncate } from '@/lib/utils';
import { Calendar, Newspaper, Trophy, ArrowLeft, Users } from 'lucide-react';

export const revalidate = 60;

async function getLatestNews() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

async function getTournaments() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .in('status', ['upcoming', 'ongoing'])
      .order('start_date', { ascending: true })
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [news, tournaments] = await Promise.all([getLatestNews(), getTournaments()]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-800 to-turquoise-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border-2 border-gold-400 rounded-full animate-float" />
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-turquoise-300 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gold-500/20 rounded-lg rotate-45" />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gold-300 mb-6 animate-fade-in">
              <Trophy className="w-4 h-4" />
              <span>وب‌سایت رسمی هیأت شطرنج</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
              هیأت شطرنج
              <span className="block text-turquoise-300 mt-2">شهرستان نیشابور</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              مرکز توسعه، آموزش و برگزاری مسابقات شطرنج در نیشابور. 
              همراه ما باشید تا استعدادهای شطرنجی شهرستان را شکوفا کنیم.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/tournaments" className="btn-gold inline-flex items-center gap-2">
                تورنمنت‌ها
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link href="/players" className="btn-outline border-white/40 text-white hover:bg-white/10 inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                بازیکنان
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H0V40Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Latest News */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-turquoise-600" />
            آخرین اخبار
          </h2>
          <Link href="/news" className="text-turquoise-600 hover:text-turquoise-700 text-sm font-medium flex items-center gap-1">
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="card p-12 text-center">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">هنوز خبری منتشر نشده است</p>
            <p className="text-slate-400 text-sm mt-2">اخبار از طریق پنل مدیریت اضافه خواهند شد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="card group hover:-translate-y-1"
              >
                {item.image_url ? (
                  <div className="aspect-video relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-turquoise-100 to-navy-100 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-turquoise-400" />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs text-slate-400">{formatDate(item.published_at)}</time>
                  <h3 className="font-bold text-navy-800 mt-2 group-hover:text-turquoise-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{truncate(item.content, 100)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Current & Upcoming Tournaments */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-2">
              <Calendar className="w-7 h-7 text-turquoise-600" />
              تورنمنت‌های جاری و آینده
            </h2>
            <Link href="/tournaments" className="text-turquoise-600 hover:text-turquoise-700 text-sm font-medium flex items-center gap-1">
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {tournaments.length === 0 ? (
            <div className="card p-12 text-center">
              <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">تورنمنتی در حال حاضر وجود ندارد</p>
              <p className="text-slate-400 text-sm mt-2">تورنمنت‌ها از پنل مدیریت اضافه می‌شوند</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="card p-6 group hover:-translate-y-1 flex gap-5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-turquoise-500 to-navy-600 flex items-center justify-center flex-shrink-0 shadow-soft">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.status === 'ongoing' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.status === 'ongoing' ? 'در حال برگزاری' : 'آینده'}
                      </span>
                      {t.registration_open && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-medium">
                          ثبت‌نام باز
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-navy-800 group-hover:text-turquoise-700 transition-colors truncate">
                      {t.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(t.start_date)}
                      {t.location && ` • ${t.location}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-l from-turquoise-600 to-navy-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-soft-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">به خانواده شطرنج نیشابور بپیوندید</h2>
          <p className="text-turquoise-100 mb-8 max-w-xl mx-auto">
            برای اطلاع از آخرین اخبار، تورنمنت‌ها و فعالیت‌های هیأت، ما را در شبکه‌های اجتماعی دنبال کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/chessneyshabur.official"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              اینستاگرام
            </a>
            <a
              href="https://t.me/Chesskhayyam"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-6 rounded-xl transition-all"
            >
              تلگرام
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
