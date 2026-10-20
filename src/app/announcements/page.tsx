import { createServerClient } from '@/lib/supabase';
import { Megaphone, CalendarDays, Clock } from 'lucide-react';

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
      console.error('Error loading announcements:', error.message);
      return [];
    }

    return (data ?? []) as Announcement[];
  } catch (error) {
    console.error('Unexpected error loading announcements:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="container mx-auto px-4 py-10 md:py-12" dir="rtl">
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-turquoise-50">
            <Megaphone className="w-7 h-7 text-turquoise-600" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-800">
              اطلاعیه‌های هیأت
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              آخرین اطلاعیه‌های هیأت شطرنج شهرستان نیشابور
            </p>
          </div>
        </div>

        <div className="h-1 w-20 rounded-full bg-turquoise-500 mt-5" />
      </div>

      {announcements.length === 0 ? (
        <section className="card p-10 md:p-16 text-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <article
              key={item.id}
              className="card overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1"
            >
              {item.image_url ? (
                <div className="aspect-video overflow-hidden bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-turquoise-50 to-navy-50 flex items-center justify-center">
                  <Megaphone className="w-14 h-14 text-turquoise-300" />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <time dateTime={item.published_at ?? item.created_at}>
                    {formatDate(item.published_at ?? item.created_at)}
                  </time>
                </div>

                <h2 className="text-lg font-bold text-navy-800 leading-8">
                  {item.title}
                </h2>

                {item.content ? (
                  <p className="mt-3 text-sm text-slate-600 leading-7 whitespace-pre-line break-words">
                    {item.content}
                  </p>
                ) : null}

                {item.expires_at ? (
                  <div className="mt-auto pt-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>
                        پایان نمایش: {formatDate(item.expires_at)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
