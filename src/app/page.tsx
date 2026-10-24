import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Newspaper,
  ArrowLeft,
  Megaphone,
  Clock,
  Calendar,
  ArrowUpLeft,
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
      {/* Hero: video background */}
      <section className="hero-video relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#071a32] py-16 text-white md:min-h-[590px]">
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

        {/* Keep the actual video visible under the navy overlay */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-l from-[#06172d]/90 via-[#071c36]/55 to-[#06172d]/30" />
        <div className="hero-vignette absolute inset-0 -z-10" />

        {/* Geometric triangular decoration */}
        <div
          aria-hidden="true"
          className="hero-triangle hero-triangle-one pointer-events-none absolute -left-24 -top-24 h-[340px] w-[340px] rotate-[30deg] border border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-transparent backdrop-blur-[2px]"
        />
        <div
          aria-hidden="true"
          className="hero-triangle hero-triangle-two pointer-events-none absolute -left-32 top-36 h-[250px] w-[250px] rotate-[30deg] border border-white/15 bg-gradient-to-br from-white/15 to-transparent"
        />

        {/* Subtle golden light lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06172d]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-gold-line pointer-events-none absolute inset-x-0 bottom-5 h-px"
        />

        <div className="container relative mx-auto px-5 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Visual side: no chess-piece illustration or extra buttons */}
            <div className="hero-visual order-2 hidden min-h-[280px] lg:block">
              <div className="relative h-[310px]">
                <div className="hero-glass-panel absolute bottom-2 left-3 h-40 w-64 rounded-3xl border border-white/20 bg-white/[0.06] backdrop-blur-md" />
                <div className="hero-glass-panel absolute left-24 top-2 h-44 w-52 rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-sm" />
                <div className="absolute bottom-12 left-20 h-24 w-24 rounded-full bg-[#d9ad54]/15 blur-3xl" />
                <div className="absolute bottom-8 left-12 max-w-52 rounded-2xl border border-white/15 bg-[#071a32]/45 p-5 backdrop-blur-md">
                  <p className="text-sm font-bold text-white">شهر نیشابور</p>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    شهری با تاریخ، فرهنگ و اندیشه
                  </p>
                </div>
                <div className="absolute right-4 top-10 h-32 w-32 rotate-45 border border-[#edc66f]/30" />
                <div className="absolute right-12 top-20 h-20 w-20 rotate-45 border border-white/20" />
              </div>
            </div>

            {/* Main text */}
            <div className="hero-copy relative z-10 mx-auto w-full max-w-2xl text-center lg:order-2 lg:mx-0 lg:text-right">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-[#f3d58f] backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#edc66f]" />
                به وب‌سایت رسمی
              </div>

              <h1 className="text-4xl font-black leading-[1.5] tracking-tight sm:text-5xl lg:text-6xl">
                هیأت شطرنج
                <span className="hero-title-accent mt-1 block">
                  نیشابور
                </span>
              </h1>

              <p className="mt-5 text-base font-semibold text-[#e6d3a6] sm:text-lg">
                شطرنج؛ زبان مشترک اندیشه‌ها
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-slate-200/90 lg:mx-0">
                اینجا جایی است برای علاقه‌مندان شطرنج؛ از مبتدی تا حرفه‌ای،
                برای یادگیری، رقابت و رشد در کنار هم.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/tournaments"
                  className="btn-alive btn-alive-gold group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold text-[#10213a] shadow-lg"
                >
                  <span>مشاهده مسابقات</span>
                  <Calendar className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6" />
                  <ArrowUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/news"
                  className="btn-alive btn-alive-outline group inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md"
                >
                  <span>آخرین اخبار</span>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Curved transition into the existing light background */}
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

      {/* News and announcements */}
      <section className="container mx-auto space-y-10 px-4 py-10 md:px-8 md:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
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
                      style={{ '--card-index': index } as React.CSSProperties}
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

          {/* Quote card */}
          <aside className="quote-card relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl border border-[#edc66f]/20 bg-gradient-to-br from-[#102b4b] via-[#0b2342] to-[#071a32] p-7 text-white shadow-xl lg:col-span-1">
            <div className="quote-decoration pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full border border-white/10" />
            <div className="quote-decoration pointer-events-none absolute -bottom-5 -left-3 h-32 w-32 rounded-full border border-[#edc66f]/20" />

            <div className="relative">
              <span className="mb-2 block text-4xl font-black text-[#edc66f]">
                «
              </span>
              <h3 className="text-xl font-black leading-9">
                هر حرکت،
                <br />
                یک قدم عمق است
              </h3>
              <div className="mt-4 h-1 w-12 rounded-full bg-[#edc66f]" />
            </div>

            <p className="relative mt-8 border-t border-white/10 pt-4 text-xs font-medium leading-7 text-slate-300">
              توسعه تفکر استراتژیک و هوش محاسباتی در هیأت شطرنج شهرستان
              نیشابور.
            </p>
          </aside>
        </div>
      </section>

      <style>{`
        .hero-video {
          isolation: isolate;
        }

        .hero-vignette {
          background:
            radial-gradient(ellipse at 25% 35%, transparent 0%, rgba(4, 18, 36, .2) 48%, rgba(4, 18, 36, .65) 100%),
            linear-gradient(0deg, rgba(5, 21, 40, .72), transparent 38%);
        }

        .hero-triangle {
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          transition: transform .8s cubic-bezier(.2,.8,.2,1);
        }

        .hero-triangle-one {
          animation: triangle-float 9s ease-in-out infinite alternate;
        }

        .hero-triangle-two {
          animation: triangle-float 11s ease-in-out infinite alternate-reverse;
        }

        .hero-gold-line {
          background: linear-gradient(90deg, transparent, #edc66f, rgba(255,255,255,.5), transparent);
          opacity: .8;
          box-shadow: 0 0 18px rgba(237,198,111,.3);
        }

        .hero-glass-panel {
          box-shadow: 0 24px 80px rgba(0,0,0,.12);
          animation: glass-float 7s ease-in-out infinite alternate;
        }

        .hero-glass-panel:nth-child(2) {
          animation-delay: -3s;
        }

        .hero-title-accent {
          width: fit-content;
          margin-right: 0;
          background: linear-gradient(110deg, #fff1c5 0%, #edc66f 38%, #d4a344 65%, #f9e4a5 100%);
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
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.38), transparent);
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
          background: linear-gradient(115deg, #f6df9c, #edc66f 48%, #e4b955);
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
          transition: color .25s ease, gap .25s ease;
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
          transform: translateY(-2px) rotate(-4deg);
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
          transform: scale(1.06) rotate(-5deg);
          background-color: rgba(237,198,111,.25);
        }

        .quote-card {
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .quote-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px rgba(11,35,66,.17);
        }

        .quote-decoration {
          transition: transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .quote-card:hover .quote-decoration {
          transform: scale(1.12) translate(5px, -5px);
        }

        @keyframes triangle-float {
          from { transform: rotate(30deg) translate3d(0, 0, 0); }
          to { transform: rotate(34deg) translate3d(10px, -8px, 0); }
        }

        @keyframes glass-float {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-8px) rotate(1deg); }
        }

        @keyframes title-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes content-enter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-triangle-one,
          .hero-triangle-two,
          .hero-glass-panel,
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
