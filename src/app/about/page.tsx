import { createServerClient } from '@/lib/supabase';
import {
  Info,
  Download,
  FileText,
  Presentation,
  Sparkles,
  History,
} from 'lucide-react';

export const metadata = {
  title: 'درباره ما | هیأت شطرنج شهرستان نیشابور',
  description:
    'معرفی هیأت شطرنج شهرستان نیشابور، اهداف، فعالیت‌ها و تاریخچه هیأت.',
};

export const revalidate = 60;

async function getAbout() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'about')
      .maybeSingle();

    if (error) {
      console.error('خطا در دریافت صفحه درباره ما:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('خطا در دریافت صفحه درباره ما:', error);
    return null;
  }
}

const defaultContent = `هیأت شطرنج شهرستان نیشابور مرجع رسمی اخبار، مسابقات و فعالیت‌های شطرنج شهرستان نیشابور است.

این هیأت با هدف توسعه و ترویج ورزش فکری شطرنج، برگزاری مسابقات منظم، از جمله جام قهرمانان شطرنج نیشابور، آموزش و شناسایی استعدادهای جوان فعالیت می‌کند.`;

const presidentImage =
  'https://zhfpozztqtscfvxisjfg.supabase.co/storage/v1/object/public/images/Player%2CArbiter%2CCoach/file_000000007f7882309dc226f2f157a083.jpg';

const pdfUrl =
  'https://rykupd7voq6bakre.public.blob.vercel-storage.com/%D8%AA%D8%A7%D8%B1%DB%8C%D8%AE%DA%86%D9%87%20%D9%87%DB%8C%D8%A3%D8%AA%20%D8%B4%D8%B7%D8%B1%D9%86%D8%AC%20%D8%B4%D9%87%D8%B1%D8%B3%D8%AA%D8%A7%D9%86%20%D9%86%DB%8C%D8%B4%D8%A7%D8%A8%D9%88%D8%B1.pdf';

const pptxUrl =
  'https://rykupd7voq6bakre.public.blob.vercel-storage.com/%D8%AA%D8%A7%D8%B1%DB%8C%D8%AE%DA%86%D9%87%20%D9%87%DB%8C%D8%A3%D8%AA%20%D8%B4%D8%B7%D8%B1%D9%86%D8%AC%20%D8%B4%D9%87%D8%B1%D8%B3%D8%AA%D8%A7%D9%86%20%D9%86%DB%8C%D8%B4%D8%A7%D8%A8%D9%88%D8%B1.pptx';

export default async function AboutPage() {
  const page = await getAbout();

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6f9] pb-16">
      {/* سربرگ صفحه */}
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-1/3 -z-10 h-72 w-72 rounded-full bg-amber-400/[0.07] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#d9bd80]">
              <Info className="h-7 w-7" />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#d9bd80]">
                <Sparkles className="h-3.5 w-3.5" />
                آشنایی با خانواده شطرنج نیشابور
              </div>

              <h1 className="text-3xl font-black text-white md:text-4xl">
                {page?.title || 'درباره هیأت'}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
            با اهداف، فعالیت‌ها و تاریخچه هیأت شطرنج شهرستان نیشابور آشنا شوید.
          </p>

          <div className="mt-6 h-px w-full max-w-3xl bg-gradient-to-l from-[#d9bd80]/60 via-white/10 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        {/* معرفی رئیس هیأت */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={presidentImage}
            alt="مهدی بوژمهرانی، رئیس هیأت شطرنج شهرستان نیشابور"
            className="block h-auto max-h-[560px] w-full object-contain object-center"
            loading="eager"
          />
        </section>

        {/* معرفی هیأت */}
        <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#0b2342]">
                معرفی هیأت شطرنج
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                اهداف، مأموریت و فعالیت‌ها
              </p>
            </div>
          </div>

          <div className="whitespace-pre-wrap text-sm leading-9 text-slate-600 md:text-base">
            {page?.content || defaultContent}
          </div>
        </section>

        {/* دانلود تاریخچه */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
                <History className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-[#0b2342]">
                  تاریخچه هیأت
                </h2>

                <p className="mt-1 text-sm leading-7 text-slate-500">
                  تاریخچه هیأت شطرنج شهرستان نیشابور را در قالب فایل دلخواه دریافت کنید.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5 md:p-7">
            {/* دانلود پاورپوینت */}
            <a
              href={pptxUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between gap-4 rounded-xl bg-gradient-to-l from-[#319795] to-[#247c7a] px-5 py-4 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Presentation className="h-5 w-5" />
                </span>

                <span>
                  <span className="block text-sm font-bold">
                    دانلود نسخه پاورپوینت
                  </span>

                  <span className="mt-1 block text-xs text-white/75">
                    PowerPoint · PPTX
                  </span>
                </span>
              </span>

              <Download className="h-5 w-5 shrink-0 transition-transform group-hover:translate-y-0.5" />
            </a>

            {/* دانلود PDF */}
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between gap-4 rounded-xl bg-[#0b2342] px-5 py-4 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#15395e] hover:shadow-md"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#d9bd80]">
                  <FileText className="h-5 w-5" />
                </span>

                <span>
                  <span className="block text-sm font-bold">
                    دانلود نسخه PDF
                  </span>

                  <span className="mt-1 block text-xs text-white/65">
                    PDF · مناسب مطالعه و چاپ
                  </span>
                </span>
              </span>

              <Download className="h-5 w-5 shrink-0 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </section>

        {/* پایان صفحه */}
        <div className="mt-10 border-t border-slate-200 pt-7 text-center">
          <p className="text-sm font-bold text-[#0b2342]">
            هیأت شطرنج شهرستان نیشابور
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            در مسیر توسعه و ترویج ورزش فکری شطرنج
          </p>
        </div>
      </div>
    </main>
  );
}
