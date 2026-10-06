import { createServerClient } from '@/lib/supabase';
import { Info, MapPin } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'درباره ما',
};

export const revalidate = 60;

async function getAbout() {
  try {
    const supabase = createServerClient();

    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'about')
      .single();

    return data;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const page = await getAbout();

  const defaultContent = `هیأت شطرنج شهرستان نیشابور مرجع رسمی اخبار، مسابقات و فعالیت‌های شطرنج شهرستان نیشابور است.

این هیأت با هدف توسعه و ترویج ورزش فکری شطرنج، برگزاری مسابقات منظم (از جمله جام قهرمانان شطرنج نیشابور)، آموزش و شناسایی استعدادهای جوان فعالیت می‌کند.`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">

      {/* عنوان صفحه */}
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Info className="w-8 h-8 text-turquoise-600" />
        {page?.title || 'درباره هیأت'}
      </h1>

      {/* تصویر */}
      <div className="card p-4 mb-6 overflow-hidden">
        <Image
          src="https://zhfpozztqtscfvxisjfg.supabase.co/storage/v1/object/public/images/Player,Arbiter,Coach/file_000000007f7882309dc226f2f157a083.jpg"
          alt="هیأت شطرنج شهرستان نیشابور"
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl object-cover"
          priority
        />
      </div>

      {/* متن درباره هیأت */}
      <div className="card p-8 md:p-10 mb-6">
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
          {page?.content || defaultContent}
        </div>
      </div>

      {/* نشانی هیأت */}
      <div className="card p-5 flex gap-4 items-start">
        <div className="w-12 h-12 rounded-xl bg-turquoise-100 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-turquoise-700" />
        </div>

        <div>
          <h3 className="font-bold text-navy-800 mb-1">
            نشانی هیأت
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم
          </p>
        </div>
      </div>

    </div>
  );
}
