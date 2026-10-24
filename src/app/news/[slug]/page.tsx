import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNewsItem(id: string) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching news:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  return {
    title: item?.title
      ? `${item.title} | اخبار هیأت شطرنج نیشابور`
      : 'خبر | هیأت شطرنج شهرستان نیشابور',
    description:
      item?.content?.replace(/\s+/g, ' ').slice(0, 160) ||
      'اخبار و رویدادهای هیأت شطرنج شهرستان نیشابور',
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3f6f9] pb-16" dir="rtl">
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#091a30]/95 via-[#0b2342]/95 to-[#071a32]/95" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/news"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-teal-300/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به اخبار
          </Link>

          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-teal-300">
            <Sparkles className="h-4 w-4 text-amber-300" />
            اخبار هیأت شطرنج شهرستان نیشابور
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-relaxed text-white sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          {item.published_at && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300">
              <CalendarDays className="h-4 w-4 text-teal-300" />
              <time dateTime={item.published_at}>
                {formatDate(item.published_at)}
              </time>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />
      </section>

      <article className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {item.image_url ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-lg shadow-slate-900/[0.06] sm:rounded-3xl sm:p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title || 'تصویر خبر'}
              fetchPriority="high"
              className="max-h-[560px] w-full rounded-xl object-cover sm:rounded-2xl"
            />
          </div>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b2342] to-[#102f4d] sm:min-h-72 sm:rounded-3xl">
            <Newspaper className="h-16 w-16 text-teal-300/70" strokeWidth={1.2} />
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:mt-10 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-teal-500" />
            <h2 className="text-lg font-bold text-[#10233d]">متن خبر</h2>
          </div>

          <div className="whitespace-pre-wrap break-words text-base leading-9 text-slate-700 sm:text-lg sm:leading-10">
            {item.content || 'متنی برای این خبر ثبت نشده است.'}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2342] px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              <ArrowRight className="h-4 w-4" />
              مشاهده همه اخبار
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
