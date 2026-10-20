
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Clock, Megaphone } from 'lucide-react';

export const revalidate = 60;

async function getAnnouncement(id: string) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return data;
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
    title: item?.title || 'اطلاعیه',
    description:
      item?.content?.slice(0, 160) ||
      'اطلاعیه‌های هیأت شطرنج شهرستان نیشابور',
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getAnnouncement(params.id);

  if (!item) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-turquoise-600 transition-colors hover:text-turquoise-700"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به صفحه اصلی
      </Link>

      <header className="mb-8 rounded-2xl border border-gold-200 bg-gradient-to-l from-amber-50 to-white p-6 md:p-8">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gold-600">
          <Megaphone className="h-5 w-5" />
          اطلاعیه هیأت شطرنج نیشابور
        </div>

        <h1 className="text-2xl font-extrabold leading-relaxed text-navy-800 md:text-4xl">
          {item.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <time>
            تاریخ انتشار:{' '}
            {formatDate(item.published_at || item.created_at)}
          </time>

          {item.expires_at && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              اعتبار تا:{' '}
              {new Date(item.expires_at).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </header>

      {item.image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title}
            className="max-h-[520px] w-full object-contain"
          />
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="whitespace-pre-wrap break-words text-base leading-9 text-navy-800 md:text-lg md:leading-10">
          {item.content}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-turquoise-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-turquoise-700"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </article>
  );
}
