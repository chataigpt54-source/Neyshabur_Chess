import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Newspaper,
  Trophy,
  ArrowLeft,
  Users,
  Megaphone,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  ChevronDown,
  Info,
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
    <div className="min-h-screen bg-[#f3f6f9] text-navy-950 pb-16">
      {/* 1. Hero Banner - بخش اصلی ویدیویی و متنی هدر */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white pb-24 pt-10 md:pt-16">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-turquoise-500/10 blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            
            {/* سمت راست: عنوان و متون معرفی */}
            <div className="max-w-2xl flex-1 text-center lg:text-right">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-900/80 border border-gold-500/30 px-4 py-1.5 text-xs md:text-sm font-semibold text-gold-400 backdrop-blur-md">
                <Trophy className="h-4 w-4 text-gold-400" />
                <span>وب‌سایت رسمی هیأت شطرنج</span>
              </div>

              <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl text-white">
                هیأت شطرنج
                <span className="mt-2 block bg-gradient-to-l from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                  شهرستان نیشابور
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base lg:mx-0">
                مرکز رسمی توسعه، آموزش تخصصی و برگزاری مسابقات شطرنج در نیشابور. همراه ما باشید تا استعدادهای شطرنجی شهرستان را شکوفا کنیم.
              </p>

              {/* دکمه‌های اصلی */}
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/tournaments"
                  className="btn-gold btn-alive-gold shadow-gold/40 hover:shadow-gold/60"
                >
                  <span>شروع بازی / مسابقات</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <Link
                  href="/tournaments"
                  className="btn-secondary hover:border-gold-500/50 hover:text-gold-400"
                >
                  <Calendar className="h-4 w-4 text-gold-400" />
                  <span>جدول مسابقات</span>
                </Link>
              </div>
            </div>

            {/* سمت چپ: فیلم‌ها (افقی + عمودی) */}
            <div className="w-full max-w-[600px] flex-shrink-0 lg:w-[48%]">
              <div className="grid grid-cols-2 items-center gap-3 p-2.5 rounded-3xl bg-navy-900/60 border border-gold-500/20 backdrop-blur-md shadow-2xl">
                {/* ویدیوی افقی */}
                <div className="min-w-0 overflow-hidden rounded-2xl bg-black/60 shadow-xl ring-1 ring-gold-500/30 group">
                  <video
                    src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000087731%20-%20herminal.com%20compressed.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                    className="block aspect-video w-full object-contain"
                  >
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                </div>

                {/* ویدیوی عمودی */}
                <div className="min-w-0 overflow-hidden rounded-2xl bg-black/60 shadow-xl ring-1 ring-gold-500/30 group">
                  <video
                    src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000089296%20-%20herminal.com%20compressed.webm"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                    className="block aspect-[9/16] w-full object-contain"
                  >
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-1 animate-float">
            <div className="w-7 h-10 rounded-full border-2 border-gold-400/50 flex items-start justify-center p-1 bg-navy-900/40 backdrop-blur-sm">
              <ChevronDown className="h-4 w-4 text-gold-400 animate-bounce" />
            </div>
            <span className="text-[11px] text-slate-300 font-medium">به پایین اسکرول کنید</span>
          </div>
        </div>

        {/* انحنای انتهای هدر */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-[#f3f6f9]"
          >
            <path
              d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H0V40Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-20 space-y-12">
        
        {/* 2. نوار دسترسی سریع شناور */}
        <div className="bg-white rounded-2xl p-3 shadow-soft border border-slate-200/80 flex items-center justify-between overflow-x-auto gap-3 scrollbar-none">
          <div className="bg-navy-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap shrink-0 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-400" />
            <span>دسترسی سریع</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full">
            <Link href="/about" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 text-navy-900 transition-colors text-xs font-bold whitespace-nowrap border border-transparent hover:border-slate-200">
              <Info className="h-4 w-4 text-gold-600" />
              <span>معرفی هیأت و باشگاه</span>
            </Link>

            <Link href="/tournaments" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 text-navy-900 transition-colors text-xs font-bold whitespace-nowrap border border-transparent hover:border-slate-200">
              <BookOpen className="h-4 w-4 text-turquoise-600" />
              <span>آموزش شطرنج</span>
            </Link>

            <Link href="/players" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 text-navy-900 transition-colors text-xs font-bold whitespace-nowrap border border-transparent hover:border-slate-200">
              <Users className="h-4 w-4 text-navy-700" />
              <span>رده‌بندی بازیکنان</span>
            </Link>

            <Link href="/tournaments" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 text-navy-900 transition-colors text-xs font-bold whitespace-nowrap border border-transparent hover:border-slate-200">
              <Trophy className="h-4 w-4 text-gold-600" />
              <span>مسابقات و نتائج</span>
            </Link>
          </div>
        </div>

        {/* 3. اخبار، اطلاعیه‌ها و بنر نقل‌قول */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-turquoise-600" />
                <span>آخرین اخبار و رویدادها</span>
              </h2>

              <Link href="/news" className="text-xs font-bold text-turquoise-600 hover:text-turquoise-700 flex items-center gap-1">
                <span>مشاهده همه</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            {news.length === 0 ? (
              <div className="card p-8 text-center border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">هنوز خبری منتشر نشده است.</p>
              </div>
            ) : (
              <NewsSlider items={news} />
            )}

            {announcements.length > 0 && (
              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-gold-600" />
                    <span>اطلاعیه‌های مهم</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcements.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/announcements/${item.id}`}
                      className="card p-4 flex gap-4 items-center hover:border-gold-500/40"
                    >
                      <div className="p-3 bg-gold-500/10 rounded-xl text-gold-600 shrink-0">
                        <Megaphone className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-navy-950 truncate">{item.title}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <Clock className="h-3 w-3" />
                          <time>{new Date(item.published_at || item.created_at).toLocaleDateString('fa-IR')}</time>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 rounded-2xl p-6 text-white shadow-xl border border-gold-500/20 relative overflow-hidden flex flex-col justify-between h-full min-h-[320px]">
              <div>
                <span className="text-gold-400 text-3xl font-black block mb-2">«</span>
                <h3 className="text-xl font-black leading-relaxed text-white">
                  هر حرکت،<br />
                  یک قدم عمق است »
                </h3>
                <div className="w-12 h-1 bg-gold-500 rounded-full mt-4" />
              </div>

              <div className="mt-8 text-xs text-slate-300 font-medium leading-relaxed border-t border-white/10 pt-4">
                توسعه تفکر استراتژیک و هوش محاسباتی در هیأت شطرنج شهرستان نیشابور.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
