
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Megaphone,
  CalendarDays,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const metadata = {
  title: 'اطلاعیه‌ها | هیأت شطرنج شهرستان نیشابور',
  description: 'آخرین اطلاعیه‌های هیأت شطرنج شهرستان نیشابور',
};

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

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = createServerClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('announcements')
      .select(
        'id, title, content, image_url, published, published_at, expires_at, created_at'
      )
      .eq('published', true)
      .gt('expires_at', now)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('خطا در دریافت اطلاعیه‌ها:', error.message);
      return [];
    }

    return (data ?? []) as Announcement[];
  } catch (error) {
    console.error('خطا در دریافت اطلاعیه‌ها:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main
      className="container mx-auto px-4 py-10 md:py-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-turquoise-50">
            <Megaphone className="h-7 w-7 text-turquoise-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-navy-800 md:text-3xl">
              اطلاعیه‌های هیأت
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              آخرین اطلاعیه‌های هیأت شطرنج شهرستان نیشابور
            </p>
          </div>
        </div>

        <div className="mt-5 h-1 w-20 rounded-full bg-turquoise-500" />
      </div>

      {/* Empty state */}
      {announcements.length === 0 ? (
        <section className="card p-10 text-center md:p-16">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <Megaphone className="h-10 w-10 text-slate-300" />
          </div>

          <h2 className="text-xl font-bold text-navy-800">
            در حال حاضر اطلاعیه فعالی وجود ندارد
          </h2>

          <p className="mt-3 text-slate-500">
            اطلاعیه‌های جدید پس از انتشار در این صفحه نمایش داده خواهند شد.
          </p>
        </section>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {announcements.length} اطلاعیه فعال
            </p>
          </div>

          {/* Announcement cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="card group flex flex-col overflow-hidden border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                {item.image_url ? (
                  <div className="aspect-video overflow-hidden bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-turquoise-50 to-navy-50">
                    <Megaphone className="h-14 w-14 text-turquoise-300" />
                  </div>
                )}

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays className="h-4 w-4 shrink-0" />

                    <time dateTime={item.published_at ?? item.created_at}>
                      {formatDate(item.published_at ?? item.created_at)}
                    </time>
                  </div>

                  <h2 className="line-clamp-2 text-lg font-bold leading-8 text-navy-800 transition-colors group-hover:text-turquoise-700">
                    {item.title}
                  </h2>

                  {item.content ? (
                    <p className="mt-2 line-clamp-3 break-words whitespace-pre-line text-sm leading-7 text-slate-600">
                      {item.content}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      برای مشاهده جزئیات اطلاعیه وارد صفحه آن شوید.
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-5">
                    {item.expires_at && (
                      <div className="mb-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
                        <Clock className="h-4 w-4 shrink-0" />

                        <span>
                          پایان اعتبار: {formatDate(item.expires_at)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-turquoise-700">
                        ادامه مطلب
                      </span>

                      <ArrowLeft className="h-4 w-4 text-turquoise-700 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
