import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, truncate } from '@/lib/utils';
import { Newspaper, ArrowLeft } from 'lucide-react';

export const metadata = { title: 'اخبار' };
export const revalidate = 60;

async function getNews() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title mb-10 flex items-center gap-2">
        <Newspaper className="h-8 w-8 text-turquoise-600" />
        اخبار هیأت
      </h1>

      {news.length === 0 ? (
        <div className="card p-16 text-center">
          <Newspaper className="mx-auto mb-4 h-20 w-20 text-slate-300" />

          <p className="text-xl text-slate-500">
            هنوز خبری منتشر نشده است
          </p>

          <p className="mt-2 text-slate-400">
            اخبار از پنل مدیریت اضافه خواهند شد
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="card group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              <Link
                href={`/news/${item.id}`}
                className="block overflow-hidden"
                aria-label={`مشاهده خبر ${item.title}`}
              >
                {item.image_url ? (
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-turquoise-50 to-navy-50">
                    <Newspaper className="h-12 w-12 text-turquoise-300" />
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-5">
                {item.published_at && (
                  <time className="text-xs text-slate-400">
                    {formatDate(item.published_at)}
                  </time>
                )}

                <Link href={`/news/${item.id}`}>
                  <h2 className="mt-2 line-clamp-2 font-bold text-navy-800 transition-colors group-hover:text-turquoise-700">
                    {item.title}
                  </h2>
                </Link>

                <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-500">
                  {truncate(item.content || '', 140)}
                </p>

                <div className="mt-auto pt-5">
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-turquoise-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-turquoise-700"
                  >
                    ادامه مطلب
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
