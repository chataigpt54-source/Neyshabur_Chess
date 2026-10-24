import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Megaphone,
  CalendarDays,
  Clock,
  ArrowLeft,
  BellRing,
  Sparkles,
  ArrowUpLeft,
} from 'lucide-react';

export const metadata = {
  title: 'اطلاعیه‌ها | هیأت شطرنج شهرستان نیشابور',
  description: 'آخرین اطلاعیه‌ها و اخبار رسمی هیأت شطرنج شهرستان نیشابور',
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
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

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
    <main dir="rtl" className="min-h-screen bg-[#f3f6f9] pb-16">
      {/* سربرگ صفحه */}
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="pointer-events-none absolute -left-24 -top-28 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 right-1/4 -z-10 h-80 w-80 rounded-full bg-amber-400/[0.07] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-slate-300">
                <Sparkles className="h-4 w-4 text-[#d9bd80]" />
                مرجع اطلاعیه‌های رسمی
              </div>

              <h1 className="text-3xl font-black leading-relaxed text-white md:text-5xl">
                اطلاعیه‌های هیأت
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                آخرین اطلاعیه‌ها، فراخوان‌ها و اخبار رسمی هیأت شطرنج شهرستان
                نیشابور را دنبال کنید.
              </p>

              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-l from-[#d9bd80] to-[#319795]" />
            </div>

            <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] text-[#d9bd80]">
                <BellRing className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">
                  {announcements.length.toLocaleString('fa-IR')}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  اطلاعیه فعال
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        {announcements.length === 0 ? (
          <section className="rounded-3xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm md:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#edf5f5] text-[#319795]">
              <Megaphone className="h-9 w-9" />
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-[#0b2342]">
              در حال حاضر اطلاعیه‌ای منتشر نشده است
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-slate-500">
              اطلاعیه‌های جدید پس از انتشار در این صفحه قرار خواهند گرفت.
              برای اطلاع از سایر مطالب سایت می‌توانید اخبار را هم مشاهده کنید.
            </p>

            <Link
              href="/news"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b2342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15395e]"
            >
              مشاهده اخبار
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-[#0b2342]">
                  آخرین اطلاعیه‌ها
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  اطلاعیه‌های منتشرشده توسط هیأت
                </p>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
                {announcements.length.toLocaleString('fa-IR')} مورد
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {announcements.map((item) => (
                <Link
                  key={item.id}
                  href={`/announcements/${item.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(11,35,66,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#319795]/40 hover:shadow-[0_14px_35px_rgba(11,35,66,0.09)]"
                >
                  {/* تصویر اطلاعیه */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#0b2342] to-[#176b70]">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Megaphone className="h-14 w-14 text-white/50" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071a32]/60 to-transparent" />

                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#091a30]/75 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d9bd80]" />
                      اطلاعیه رسمی
                    </span>
                  </div>

                  {/* محتوای کارت */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays className="h-4 w-4 text-[#319795]" />
                      <time dateTime={item.published_at ?? item.created_at}>
                        {formatDate(item.published_at ?? item.created_at)}
                      </time>
                    </div>

                    <h2 className="line-clamp-2 text-lg font-extrabold leading-8 text-[#0b2342] transition-colors group-hover:text-[#247c7a]">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 whitespace-pre-line break-words text-sm leading-7 text-slate-500">
                      {item.content ||
                        'برای مشاهده جزئیات کامل این اطلاعیه وارد صفحه آن شوید.'}
                    </p>

                    <div className="mt-auto pt-5">
                      {item.expires_at && (
                        <div className="mb-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>
                            اعتبار تا {formatDate(item.expires_at)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-bold text-[#176b70]">
                          مشاهده جزئیات
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5f5] text-[#176b70] transition duration-300 group-hover:bg-[#0b2342] group-hover:text-white">
                          <ArrowUpLeft className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
