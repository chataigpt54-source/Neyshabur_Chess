import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Clock,
  Megaphone,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60;

type Announcement = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return 'تاریخ نامشخص';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'تاریخ نامشخص';

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

async function getAnnouncement(id: string): Promise<Announcement | null> {
  try {
    const supabase = createServerClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('announcements')
      .select(
        'id, title, content, image_url, published, published_at, expires_at, created_at'
      )
      .eq('id', id)
      .eq('published', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .maybeSingle();

    if (error) {
      console.error('خطا در دریافت جزئیات اطلاعیه:', error.message);
      return null;
    }

    return data as Announcement | null;
  } catch (error) {
    console.error('خطا در دریافت جزئیات اطلاعیه:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const item = await getAnnouncement(params.id);

  return {
    title: item
      ? `${item.title} | هیأت شطرنج شهرستان نیشابور`
      : 'اطلاعیه | هیأت شطرنج شهرستان نیشابور',
    description:
      item?.content?.slice(0, 160) ||
      'اطلاعیه‌های رسمی هیأت شطرنج شهرستان نیشابور',
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getAnnouncement(params.id);

  if (!item) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6f9] pb-16">
      {/* سربرگ اطلاعیه */}
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="pointer-events-none absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 -z-10 h-72 w-72 rounded-full bg-amber-400/[0.07] blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
          <Link
            href="/announcements"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به اطلاعیه‌ها
          </Link>

          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-[#d9bd80]">
            <Megaphone className="h-5 w-5" />
            اطلاعیه رسمی هیأت شطرنج نیشابور
          </div>

          <h1 className="max-w-4xl text-2xl font-black leading-relaxed text-white md:text-4xl">
            {item.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-300 md:text-sm">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#d9bd80]" />
              انتشار: {formatDate(item.published_at ?? item.created_at)}
            </span>

            {item.expires_at && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#d9bd80]" />
                اعتبار تا: {formatDate(item.expires_at)}
              </span>
            )}
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-l from-[#d9bd80]/70 via-white/10 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 md:pt-10">
        {/* تصویر */}
        {item.image_url && (
          <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-2 shadow-sm md:rounded-3xl md:p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="max-h-[620px] w-full rounded-xl object-contain md:rounded-2xl"
            />
          </div>
        )}

        {/* متن اطلاعیه */}
        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(11,35,66,0.04)] md:rounded-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 md:px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-extrabold text-[#0b2342]">
                متن اطلاعیه
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                هیأت شطرنج شهرستان نیشابور
              </p>
            </div>
          </div>

          <div className="px-5 py-6 md:px-8 md:py-9">
            {item.content ? (
              <div className="whitespace-pre-wrap break-words text-sm leading-9 text-slate-700 md:text-base md:leading-10">
                {item.content}
              </div>
            ) : (
              <p className="text-sm leading-8 text-slate-500">
                برای این اطلاعیه توضیحات بیشتری ثبت نشده است.
              </p>
            )}
          </div>
        </article>

        {/* بازگشت */}
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/announcements"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2342] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#15395e]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به فهرست اطلاعیه‌ها
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#0b2342]"
          >
            صفحه اصلی
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
