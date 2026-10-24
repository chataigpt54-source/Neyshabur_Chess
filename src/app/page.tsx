import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Newspaper,
  Trophy,
  ArrowLeft,
  Search,
  Megaphone,
  Clock,
  Calendar,
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
      {/* 1. Hero Banner - بنر هدر عریض همراه با پس‌زمینه ویدیویی و اوورلی سرمه‌ای */}
      <section className="relative overflow-hidden bg-navy-950 text-white min-h-[520px] lg:min-h-[580px] flex flex-col justify-between pb-16 pt-6">
        
        {/* ویدیوی افقی پس‌زمینه با لایه نیمه‌شفاف سرمه‌ای */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000087731%20-%20herminal.com%20compressed.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          {/* اوورلی گرادیان سرمه‌ای تیره */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/80 to-navy-900/85 backdrop-blur-[2px]" />
        </div>

        {/* حاشیه دکوراتیو هندسی سفید در سمت چپ هدر (مطابق طرح) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-36 bg-gradient-to-r from-[#f3f6f9] to-transparent opacity-20 pointer-events-none z-10 -skew-x-12 transform -translate-x-10" />

        <div className="container relative z-20 mx-auto px-4 my-auto">
          {/* نوار بالای بنر شامل دکمه سرچ شیشه‌ای */}
          <div className="flex justify-end mb-8">
            <button
              aria-label="جستجو"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* محتوای متنی و دکمه‌های شیشه‌ای */}
          <div className="max-w-2xl mr-auto text-center lg:text-right">
            <p className="text-xs md:text-sm text-gold-400 font-semibold mb-2 tracking-wide">
              به وب‌سایت رسمی
            </p>

            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl text-white">
              هیأت شطرنج
              <span className="mt-1 block bg-gradient-to-l from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                نیشابور
              </span>
            </h1>

            <p className="mb-3 text-sm md:text-base text-gold-200/90 font-medium">
              شطرنج؛ زبان مشترک اندیشه‌ها
            </p>

            <p className="mb-8 text-xs md:text-sm leading-relaxed text-slate-300 max-w-xl">
              اینجا جایی است برای علاقه‌مندان شطرنج؛ از مبتدی تا حرفه‌ای، برای یادگیری، رقابت و رشد در کنار هم.
            </p>

            {/* دکمه‌های شیشه‌ای گرد */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/tournaments"
                className="btn-gold btn-alive-gold !rounded-full px-8 py-3 font-bold text-sm flex items-center gap-2 shadow-gold/30 hover:shadow-gold/50"
              >
                <span>مشاهده مسابقات</span>
                <Calendar className="h-4 w-4" />
              </Link>

              <Link
                href="/news"
                className="bg-navy-900/60 hover:bg-navy-800/80 text-white border border-white/20 hover:border-gold-400/50 backdrop-blur-md px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <span>آخرین اخبار</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* انحنای سفید پایین هدر (Wave Cut) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-[#f3f6f9]"
          >
            <path
              d="M0 35C240 70 480 70 720 35C960 0 1200 0 1440 35V70H0V35Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* 2. بخش اصلی محتوا: اخبار، اطلاعیه‌ها و بنر نقل‌قول */}
      <div className="container mx-auto px-4 pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* سمت راست (3 ستون): اخبار و اطلاعیه‌ها */}
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

            {/* اطلاعیه‌ها */}
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

          {/* سمت چپ (1 ستون): بنر سرمه‌ای نقل‌قول (دقیقاً مطابق طرح) */}
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
