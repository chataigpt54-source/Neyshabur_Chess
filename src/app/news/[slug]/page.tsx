import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNewsItem(id: string) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching news:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  return {
    title: item?.title || 'خبر',
    description:
      item?.content?.slice(0, 160) ||
      'اخبار هیأت شطرنج شهرستان نیشابور',
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // مقدار مسیر فقط شناسه خبر است؛ هیچ جست‌وجویی با slug انجام نمی‌شود.
  const item = await getNewsItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-turquoise-600 hover:text-turquoise-700"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به اخبار
      </Link>

      <header className="mb-8">
        {item.published_at && (
          <time className="text-sm text-slate-400">
            {formatDate(item.published_at)}
          </time>
        )}

        <h1 className="mt-2 text-3xl font-bold leading-tight text-navy-800 md:text-4xl">
          {item.title}
        </h1>
      </header>

      {item.image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title || 'تصویر خبر'}
            className="max-h-[480px] w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-navy-800">
        {item.content}
      </div>
    </article>
  );
}
