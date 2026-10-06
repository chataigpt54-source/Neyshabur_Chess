import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, truncate } from '@/lib/utils';
import { Newspaper, Trophy, ArrowLeft, Users } from 'lucide-react';

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

export default async function HomePage() {
  const news = await getLatestNews();

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-800 to-turquoise-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border-2 border-gold-400 rounded-full animate-float" />
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-turquoise-300 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gold-500/20 rounded-lg rotate-45" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* متن */}
            <div className="max-w-3xl flex-1 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gold-300 mb-6 animate-fade-in">
                <Trophy className="w-4 h-4" />
                <span>وب‌سایت رسمی هیأت شطرنج</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
                هیأت شطرنج
                <span className="block text-turquoise-300 mt-2">شهرستان نیشابور</span>
              </h1>

              <p
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed animate-slide-up mx-auto lg:mx-0"
                style={{ animationDelay: '0.1s' }}
              >
                مرکز توسعه، آموزش و برگزاری مسابقات شطرنج در نیشابور.
                همراه ما باشید تا استعدادهای شطرنجی شهرستان را شکوفا کنیم.
              </p>

              <div
                className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <Link href="/tournaments" className="btn-gold inline-flex items-center gap-2">
                  تورنمنت‌ها
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/players"
                  className="btn-outline border-white/40 text-white hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  بازیکنان و مربیان و داوران
                </Link>
              </div>
            </div>

            {/* تصویر آرامگاه خیام */}
            <div className="flex-shrink-0 w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] animate-fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://zhfpozztqtscfvxisjfg.supabase.co/storage/v1/object/public/images/file_00000000184481f486baeb5bf817c9a8.jpg"
                alt="آرامگاه خیام نیشابور"
                className="w-full h-auto drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H0V40Z"
              fill="#f8fafc"
            />
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
          <Link
            href="/news"
            className="text-turquoise-600 hover:text-turquoise-700 text-sm font-medium flex items-center gap-1"
          >
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
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {truncate(item.content, 100)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
