import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Newspaper,
  ArrowLeft,
  Megaphone,
  Clock,
  Calendar,
  ArrowUpLeft,
  BookOpen,
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

    if (error) return [];

    return data || [];
  } catch {
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

    if (error) return [];

    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [news, announcements] = await Promise.all([
    getLatestNews(),
    getActiveAnnouncements(),
  ]);

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f3f6f9] text-[#0b2342]"
    >
      {/* بخش اصلی ویدئویی */}
      <section className="hero-video relative isolate flex min-h-[520px] items-center justify-center overflow-hidden bg-[#071a32] py-16 text-white md:min-h-[590px]">
        {/* ویدئوی پس‌زمینه */}
        <div className="absolute inset-0 -z-30">
          <video
            className="h-full w-full object-cover"
            src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000087731%20-%20herminal.com%20compressed.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        {/* لایه تیره روی ویدئو */}
        <div className="absolute inset-0 -z-20 bg-[#06172d]/60" />
        <div className="hero-vignette absolute inset-0 -z-10" />

        <div className="container relative mx-auto w-full px-5 md:px-8">
          <div className="mx-auto flex w-full max-w-4xl justify-center">
            <div className="hero-copy relative z-10 w-full text-center">
              <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-5 py-2.5 text-xs font-semibold text-[#f3d58f] backdrop-blur-md sm:text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#edc66f]" />
                به وب‌سایت رسمی خوش آمدید
              </div>

              <h1 className="hero-title mx-auto text-center text-3xl font-black leading-relaxed tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block">هیأت شطرنج</span>
                <span className="hero-title-accent mt-2 block">
                  شهرستان نیشابور
                </span>
              </h1>

              <p className="mt-6 text-base font-semibold text-[#e6d3a6] sm:text-lg md:text-xl">
                شطرنج؛ زبان مشترک اندیشه‌ها
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-200/90 sm:text-base md:leading-9">
                اینجا جایی است برای علاقه‌مندان شطرنج؛ از مبتدی تا حرفه‌ای،
                برای یادگیری، رقابت و رشد در کنار هم.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/tournaments"
                  className="btn-alive btn-alive-gold group inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-[#10213a] shadow-lg"
                >
                  <span>مشاهده مسابقات</span>
                  <Calendar className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <ArrowUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/news"
                  className="btn-alive btn-alive-outline group inline-flex items-center justify-center gap-3 rounded-full border border-white/35 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
                >
                  <span>آخرین اخبار</span>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* اتصال نرم به بخش روشن */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 65"
            preserveAspectRatio="none"
            className="block h-12 w-full text-[#f3f6f9] md:h-16"
            aria-hidden="true"
          >
            <path
              d="M0 25 C240 70 450 60 720 30 C1000 0 1220 0 1440 25 V65 H0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* اخبار و اطلاعیه‌ها */}
      <section className="container mx-auto space-y-10 px-4 py-10 md:px-8 md:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* ستون اخبار */}
          <div className="min-w-0 space-y-6 lg:col-span-3">
            <div className="section-heading flex items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
              <h2 className="flex items-center gap-3 text-lg font-black text-[#0b2342] md:text-xl">
                <span className="heading-icon flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2342] text-white shadow-md">
                  <Newspaper className="h-5 w-5" />
                </span>
                <span>آخرین اخبار و رویدادها</span>
              </h2>

              <Link
                href="/news"
                className="link-alive inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#176b82] md:text-sm"
              >
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {news.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                <Newspaper className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-medium text-slate-500">
                  هنوز خبری منتشر نشده است.
                </p>
              </div>
            ) : (
              <div className="news-entrance">
                <NewsSlider items={news} />
              </div>
            )}

            {/* اطلاعیه‌های مهم */}
            {announcements.length > 0 && (
              <section className="space-y-4 pt-5">
                <div className="flex items-center gap-3 border-b border-slate-200/90 pb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edc66f]/20 text-[#9b7022]">
                    <Megaphone className="h-5 w-5" />
                  </span>

                  <h3 className="text-lg font-black text-[#0b2342]">
                    اطلاعیه‌های مهم
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {announcements.slice(0, 4).map((item, index) => (
                    <Link
                      key={item.id}
                      href={`/announcements/${item.id}`}
                      style={
                        { '--card-index': index } as React.CSSProperties
                      }
                      className="announcement-card group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
                    >
                      <div className="announcement-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edc66f]/15 text-[#a47b2d]">
                        <Megaphone className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-[#0b2342]">
                          {item.title}
                        </h4>

                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          <time>
                            {new Date(
                              item.published_at || item.created_at
                            ).toLocaleDateString('fa-IR')}
                          </time>
                        </div>
                      </div>

                      <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#a47b2d]" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* شعر عطار نیشابوری */}
          <aside className="quote-card relative flex min-h-[350px] flex-col justify-between overflow-hidden rounded-3xl border border-[#edc66f]/20 bg-gradient-to-br from-[#102b4b] via-[#0b2342] to-[#071a32] p-7 text-white shadow-xl lg:col-span-1">
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold text-[#edc66f]">
                <BookOpen className="h-4 w-4" />
                گنجینه ادب نیشابور
              </div>

              <span className="block text-4xl font-black leading-none text-[#edc66f]">
                «
              </span>

              <blockquote className="mt-2 text-base font-bold leading-9 sm:text-lg">
                چنین گفت این جهان پُر غم و رنج
                <br />
                به عینه آیدم چون نطعِ شطرنج
              </blockquote>

              <div className="mt-5 h-1 w-12 rounded-full bg-[#edc66f]" />
            </div>

            <div className="relative mt-8 border-t border-white/10 pt-4">
              <p className="text-sm font-extrabold text-white">
                عطار نیشابوری
              </p>

              <p className="mt-1 text-xs leading-6 text-slate-300">
                برگرفته از الهی‌نامه
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* انیمیشن‌ها و استایل‌های اختصاصی */}
      <style>{`
        .hero-video {
          isolation: isolate;
        }

        .hero-vignette {
          background:
            radial-gradient(
              ellipse at center,
              transparent 0%,
              rgba(4, 18, 36, .2) 55%,
              rgba(4, 18, 36, .5) 100%
            ),
            linear-gradient(
              0deg,
              rgba(5, 21, 40, .65),
              transparent 45%
            );
        }

        .hero-title {
          overflow-wrap: normal;
          word-break: normal;
          text-wrap: balance;
        }

        .hero-title-accent {
          width: fit-content;
          max-width: 100%;
          margin-inline: auto;
          background: linear-gradient(
            110deg,
            #fff1c5 0%,
            #edc66f 38%,
            #d4a344 65%,
            #f9e4a5 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: title-shimmer 7s linear infinite;
        }

        .btn-alive {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          transition:
            transform .3s cubic-bezier(.2,.8,.2,1),
            box-shadow .3s ease,
            border-color .3s ease,
            background-color .3s ease;
        }

        .btn-alive::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          transform: translateX(130%) skewX(-20deg);
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255,255,255,.38),
            transparent
          );
          transition: transform .65s ease;
        }

        .btn-alive:hover::before {
          transform: translateX(-130%) skewX(-20deg);
        }

        .btn-alive:hover {
          transform: translateY(-3px);
        }

        .btn-alive:active {
          transform: translateY(0) scale(.97);
        }

        .btn-alive-gold {
          background: linear-gradient(
            115deg,
            #f6df9c,
            #edc66f 48%,
            #e4b955
          );
          box-shadow: 0 8px 24px rgba(214,169,74,.2);
        }

        .btn-alive-gold:hover {
          box-shadow: 0 12px 34px rgba(214,169,74,.4);
        }

        .btn-alive-outline:hover {
          border-color: rgba(237,198,111,.8);
          background-color: rgba(255,255,255,.13);
          box-shadow: 0 10px 28px rgba(0,0,0,.15);
        }

        .link-alive {
          transition: color .25s ease;
        }

        .link-alive:hover {
          color: #b48635;
        }

        .link-alive svg {
          transition: transform .25s ease;
        }

        .link-alive:hover svg {
          transform: translateX(-4px);
        }

        .news-entrance {
          animation: content-enter .65s both;
        }

        .section-heading .heading-icon {
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .section-heading:hover .heading-icon {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(11,35,66,.18);
        }

        .announcement-card {
          animation: content-enter .55s both;
          animation-delay: calc(var(--card-index, 0) * 80ms);
          transition:
            transform .3s cubic-bezier(.2,.8,.2,1),
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .announcement-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212,163,68,.55);
          box-shadow: 0 16px 35px rgba(11,35,66,.09);
        }

        .announcement-icon {
          transition: transform .3s ease, background-color .3s ease;
        }

        .announcement-card:hover .announcement-icon {
          transform: scale(1.06);
          background-color: rgba(237,198,111,.25);
        }

        .quote-card {
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .quote-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px rgba(11,35,66,.17);
        }

        @keyframes title-shimmer {
          0% {
            background-position: 200% center;
          }

          100% {
            background-position: -200% center;
          }
        }

        @keyframes content-enter {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .hero-title-accent {
            margin-inline: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-title-accent,
          .news-entrance,
          .announcement-card {
            animation: none !important;
          }

          .btn-alive,
          .quote-card,
          .announcement-card,
          .announcement-icon {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
