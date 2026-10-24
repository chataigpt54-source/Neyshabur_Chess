import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, truncate } from '@/lib/utils';
import {
  Newspaper,
  ArrowLeft,
  Sparkles,
  CalendarDays,
  BookOpen,
} from 'lucide-react';

export const metadata = {
  title: 'اخبار | هیأت شطرنج شهرستان نیشابور',
  description: 'آخرین اخبار، رویدادها و اطلاعیه‌های هیأت شطرنج شهرستان نیشابور',
};

export const revalidate = 60;

async function getNews() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching news:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-[#f3f6f9] pb-20" dir="rtl">
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#091a30]/95 via-[#0b2342]/95 to-[#071a32]/95" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-300" />
                تازه‌ترین رویدادهای شطرنج نیشابور
              </div>

              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                اخبار هیأت شطرنج
                <span className="mt-3 block text-teal-300">
                  خبرهای مهم، حرکت‌های تازه
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                تازه‌ترین خبرها، گزارش مسابقات و رویدادهای جامعه شطرنج
                شهرستان نیشابور را در این بخش دنبال کنید.
              </p>
            </div>

            <div className="hidden md:flex md:justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20">
                <Newspaper className="h-14 w-14 text-teal-300" strokeWidth={1.4} />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
              <BookOpen className="h-4 w-4 text-teal-300" />
              <span>{news.length.toLocaleString('fa-IR')} خبر منتشرشده</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            تازه‌های هیأت
          </div>

          <h2 className="text-2xl font-black text-[#10233d] sm:text-3xl">
            آخرین اخبار
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            گزارش‌ها و خبرهای منتشرشده را بخوانید.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white px-5 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <Newspaper className="h-9 w-9" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#10233d]">
              هنوز خبری منتشر نشده است
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              اخبار جدید پس از انتشار در این بخش نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/[0.06]"
              >
                <Link
                  href={`/news/${item.id}`}
                  className="relative block overflow-hidden bg-[#e8eef3]"
                  aria-label={`مشاهده خبر ${item.title}`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.title || 'تصویر خبر'}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0b2342] to-[#102f4d]">
                        <Newspaper className="h-14 w-14 text-teal-300/70" strokeWidth={1.3} />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                </Link>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {item.published_at && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays className="h-4 w-4 text-teal-600" />
                      <time dateTime={item.published_at}>
                        {formatDate(item.published_at)}
                      </time>
                    </div>
                  )}

                  <Link href={`/news/${item.id}`}>
                    <h2 className="line-clamp-2 text-lg font-bold leading-8 text-[#10233d] transition-colors group-hover:text-teal-700">
                      {item.title}
                    </h2>
                  </Link>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                    {truncate(item.content || '', 160)}
                  </p>

                  <div className="mt-auto pt-6">
                    <div className="mb-4 h-px bg-slate-100" />

                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:gap-3 hover:text-teal-800"
                    >
                      ادامه مطلب
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
