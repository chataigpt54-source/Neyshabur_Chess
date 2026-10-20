
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Newspaper,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Users,
  Megaphone,
  Clock,
} from 'lucide-react';
import NewsSlider from '@/components/NewsSlider';
import type { Announcement } from '@/types/database';

export const revalidate = 60;

async function getLatestNews() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('خطا در دریافت اخبار:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('خطا در دریافت اخبار:', error);
    return [];
  }
}

async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('published', true)
      .gt('expires_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('خطا در دریافت اطلاعیه‌ها:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('خطا در دریافت اطلاعیه‌ها:', error);
    return [];
  }
}

export default async function HomePage() {
  const [news, announcements] = await Promise.all([
    getLatestNews(),
    getActiveAnnouncements(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-800 to-turquoise-800 text-white">
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            <div className="max-w-3xl flex-1 text-center lg:text-right">
              <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-gold-300 backdrop-blur-sm">
                <Trophy className="h-4 w-4" />
                <span>وب‌سایت رسمی هیأت شطرنج</span>
              </div>

              <h1 className="mb-6 animate-slide-up text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                هیأت شطرنج
                <span className="mt-2 block text-turquoise-300">
                  شهرستان نیشابور
                </span>
              </h1>

              <p
                className="mx-auto mb-10 max-w-xl animate-slide-up text-lg leading-relaxed text-slate-300 md:text-xl lg:mx-0"
                style={{ animationDelay: '0.1s' }}
              >
                مرکز توسعه، آموزش و برگزاری مسابقات شطرنج در نیشابور.
                همراه ما باشید تا استعدادهای شطرنجی شهرستان را شکوفا کنیم.
              </p>

              <div
                className="flex animate-slide-up flex-wrap justify-center gap-4 lg:justify-start"
                style={{ animationDelay: '0.2s' }}
              >
                <Link
                  href="/tournaments"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  تورنمنت‌ها
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href="/players"
                  className="btn-outline inline-flex items-center gap-2 border-white/40 text-white hover:bg-white/10"
                >
                  <Users className="h-4 w-4" />
                  بازیکنان و مربیان و داوران
                </Link>
              </div>
            </div>

            {/* Video */}
            <div className="w-full max-w-[320px] flex-shrink-0 animate-fade-in md:max-w-[380px] lg:max-w-[420px]">
              <div className="overflow-hidden rounded-2xl bg-black/40 shadow-2xl ring-2 ring-white/20">
                <video
                  src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000087731%20-%20herminal.com%20compressed.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls
                  className="block h-auto w-full"
                >
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H0V40Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="container mx-auto px-4 pt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="section-title flex items-center gap-2">
              <Megaphone className="h-7 w-7 text-gold-600" />
              اطلاعیه‌های مهم
            </h2>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
              {announcements.length} اطلاعیه
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="card group overflow-hidden border border-gold-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {item.image_url ? (
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
                    <Megaphone className="h-12 w-12 text-gold-600" />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-4 w-4 shrink-0" />
                    <time>
                      {new Date(
                        item.published_at || item.created_at
                      ).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <h3 className="line-clamp-2 font-bold leading-7 text-navy-800 transition-colors group-hover:text-turquoise-700">
                    {item.title}
                  </h3>

                  {item.content && (
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-7 text-slate-500">
                      {item.content}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-turquoise-700">
                      ادامه مطلب
                    </span>

                    <ArrowLeft className="h-4 w-4 text-turquoise-700 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="section-title flex items-center gap-2">
            <Newspaper className="h-7 w-7 text-turquoise-600" />
            آخرین اخبار
          </h2>

          <Link
            href="/news"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-turquoise-600 hover:text-turquoise-700"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="card p-12 text-center">
            <Newspaper className="mx-auto mb-4 h-16 w-16 text-slate-300" />

            <p className="text-lg text-slate-500">
              هنوز خبری منتشر نشده است
            </p>

            <p className="mt-2 text-sm text-slate-400">
              اخبار از طریق پنل مدیریت اضافه خواهند شد
            </p>
          </div>
        ) : (
          <NewsSlider items={news} />
        )}
      </section>
    </div>
  );
}
