import { createServerClient } from '@/lib/supabase';
import { Image as ImageIcon, Images, ArrowDown, Sparkles } from 'lucide-react';
import GallerySlider from '@/components/GallerySlider';

export const metadata = {
  title: 'گالری تصاویر | هیأت شطرنج شهرستان نیشابور',
  description: 'مجموعه‌ای از تصاویر مسابقات، رویدادها و فعالیت‌های هیأت شطرنج شهرستان نیشابور',
};

export const revalidate = 60;

async function getGallery() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطا در دریافت گالری:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('خطا در دریافت گالری:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGallery();

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.title?.trim() || 'تصاویر منتخب';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groups = Object.entries(grouped);
  const totalImages = items.length;
  const totalAlbums = groups.length;

  return (
    <main className="min-h-screen bg-[#f3f6f9] pb-20" dir="rtl">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-36 -left-16 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,26,48,0.97),rgba(11,35,66,0.94),rgba(7,26,50,0.98))]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>لحظه‌هایی از دنیای شطرنج نیشابور</span>
              </div>

              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                گالری تصاویر
                <span className="mt-3 block text-teal-300">
                  خاطراتی ماندگار، حرکت‌هایی هوشمندانه
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                نگاهی به لحظه‌های به‌یادماندنی مسابقات، رویدادها و فعالیت‌های
                جامعه شطرنج شهرستان نیشابور؛ روایت تصویری از تلاش، رقابت و
                دوستی.
              </p>

              <a
                href="#gallery-content"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-950/20 transition hover:-translate-y-0.5 hover:bg-teal-400"
              >
                مشاهده تصاویر
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] border border-white/[0.08]" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-300">
                  <Images className="h-8 w-8" />
                </div>

                <p className="mt-6 text-sm font-medium text-slate-400">
                  آرشیو تصویری هیأت
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4">
                    <p className="text-3xl font-black text-white">
                      {totalImages.toLocaleString('fa-IR')}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">تصویر</p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4">
                    <p className="text-3xl font-black text-white">
                      {totalAlbums.toLocaleString('fa-IR')}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">مجموعه تصویری</p>
                  </div>
                </div>

                <div className="mt-5 h-px bg-gradient-to-l from-teal-400/60 via-white/10 to-transparent" />

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  تصاویر این بخش از طریق پنل مدیریت سایت به‌روزرسانی می‌شوند.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-l from-transparent via-amber-300/70 to-transparent" />
      </section>

      {/* Gallery */}
      <section
        id="gallery-content"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              آرشیو دیداری
            </div>
            <h2 className="text-2xl font-black text-[#10233d] sm:text-3xl">
              لحظه‌های ثبت‌شده
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              مجموعه‌ها را مرور کنید و خاطرات شطرنج نیشابور را دوباره ببینید.
            </p>
          </div>

          {totalImages > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
              <ImageIcon className="h-4 w-4 text-teal-600" />
              <span>
                {totalImages.toLocaleString('fa-IR')} تصویر در{' '}
                {totalAlbums.toLocaleString('fa-IR')} مجموعه
              </span>
            </div>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <ImageIcon className="h-9 w-9" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-[#10233d]">
              هنوز تصویری در گالری ثبت نشده است
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              به‌محض اضافه‌شدن تصاویر از طریق پنل مدیریت، مجموعه‌های تصویری
              اینجا نمایش داده خواهند شد.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map(([title, groupItems], index) => (
              <section key={title}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-[#10233d] sm:text-xl">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        مجموعه شماره { (index + 1).toLocaleString('fa-IR') }
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                    {groupItems.length.toLocaleString('fa-IR')} تصویر
                  </span>
                </div>

                {groupItems.length === 1 ? (
                  <div className="max-w-xl">
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={groupItems[0].image_url}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full rounded-xl object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-x-1.5 bottom-1.5 h-24 rounded-b-xl bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl">
                    <GallerySlider items={groupItems} />
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
