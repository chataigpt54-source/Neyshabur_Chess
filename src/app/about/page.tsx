import { createServerClient } from '@/lib/supabase';
import { Info, Download, FileText, Presentation } from 'lucide-react';

export const metadata = { title: 'درباره ما' };
export const revalidate = 60;

async function getAbout() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('pages').select('*').eq('slug', 'about').single();
    return data;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const page = await getAbout();

  const defaultContent = `هیأت شطرنج شهرستان نیشابور مرجع رسمی اخبار، مسابقات و فعالیت‌های شطرنج شهرستان نیشابور است.

این هیأت با هدف توسعه و ترویج ورزش فکری شطرنج، برگزاری مسابقات منظم (از جمله جام قهرمانان شطرنج نیشابور)، آموزش و شناسایی استعدادهای جوان فعالیت می‌کند.`;

  // آدرس عکس با encoding درست
  const presidentImage =
    'https://zhfpozztqtscfvxisjfg.supabase.co/storage/v1/object/public/images/Player%2CArbiter%2CCoach/file_000000007f7882309dc226f2f157a083.jpg';

  // لینک‌های دانلود تاریخچه
  const pdfUrl =
    'https://rykupd7voq6bakre.public.blob.vercel-storage.com/%D8%AA%D8%A7%D8%B1%DB%8C%D8%AE%DA%86%D9%87%20%D9%87%DB%8C%D8%A3%D8%AA%20%D8%B4%D8%B7%D8%B1%D9%86%D8%AC%20%D8%B4%D9%87%D8%B1%D8%B3%D8%AA%D8%A7%D9%86%20%D9%86%DB%8C%D8%B4%D8%A7%D8%A8%D9%88%D8%B1.pdf';
  const pptxUrl =
    'https://rykupd7voq6bakre.public.blob.vercel-storage.com/%D8%AA%D8%A7%D8%B1%DB%8C%D8%AE%DA%86%D9%87%20%D9%87%DB%8C%D8%A3%D8%AA%20%D8%B4%D8%B7%D8%B1%D9%86%D8%AC%20%D8%B4%D9%87%D8%B1%D8%B3%D8%AA%D8%A7%D9%86%20%D9%86%DB%8C%D8%B4%D8%A7%D8%A8%D9%88%D8%B1.pptx';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Info className="w-8 h-8 text-turquoise-600" />
        {page?.title || 'درباره هیأت'}
      </h1>

      {/* تصویر رئیس هیأت */}
      <div className="card overflow-hidden mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={presidentImage}
          alt="مهدی بوژمهرانی - رئیس هیأت شطرنج شهرستان نیشابور"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="card p-8 md:p-10 mb-6">
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
          {page?.content || defaultContent}
        </div>
      </div>

      {/* دکمه‌های دانلود تاریخچه */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-navy-800 mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-turquoise-600" />
          دانلود تاریخچه هیأت شطرنج شهرستان نیشابور
        </h3>

        <a
          href={pptxUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-l from-turquoise-600 to-turquoise-500 text-white font-medium shadow-md hover:shadow-lg hover:from-turquoise-700 hover:to-turquoise-600 transition-all duration-200"
        >
          <span className="flex items-center gap-3">
            <Presentation className="w-6 h-6 flex-shrink-0" />
            دانلود به صورت PowerPoint
          </span>
          <Download className="w-5 h-5 opacity-80" />
        </a>

        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-l from-navy-700 to-navy-600 text-white font-medium shadow-md hover:shadow-lg hover:from-navy-800 hover:to-navy-700 transition-all duration-200"
        >
          <span className="flex items-center gap-3">
            <FileText className="w-6 h-6 flex-shrink-0" />
            دانلود به صورت PDF
          </span>
          <Download className="w-5 h-5 opacity-80" />
        </a>
      </div>
    </div>
  );
}
