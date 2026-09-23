import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, truncate } from '@/lib/utils';
import { Newspaper } from 'lucide-react';

export const metadata = { title: 'اخبار' };
export const revalidate = 60;

async function getNews() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Newspaper className="w-8 h-8 text-turquoise-600" />
        اخبار هیأت
      </h1>

      {news.length === 0 ? (
        <div className="card p-16 text-center">
          <Newspaper className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl">هنوز خبری منتشر نشده است</p>
          <p className="text-slate-400 mt-2">اخبار از پنل مدیریت اضافه خواهند شد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="card group hover:-translate-y-1">
              {item.image_url ? (
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-turquoise-50 to-navy-50 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-turquoise-300" />
                </div>
              )}
              <div className="p-5">
                <time className="text-xs text-slate-400">{formatDate(item.published_at)}</time>
                <h2 className="font-bold text-navy-800 mt-2 group-hover:text-turquoise-700 transition-colors line-clamp-2">{item.title}</h2>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">{truncate(item.content, 140)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
