import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

async function getNewsItem(slug: string) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getNewsItem(params.slug);
  return { title: item?.title || 'خبر' };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await getNewsItem(params.slug);
  if (!item) notFound();

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-8 text-sm font-medium"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به اخبار
      </Link>

      <header className="mb-8">
        <time className="text-sm text-slate-400">{formatDate(item.published_at)}</time>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mt-2 leading-tight">
          {item.title}
        </h1>
      </header>

      {item.image_url && (
        <div className="rounded-2xl overflow-hidden mb-8 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-navy-800 leading-relaxed whitespace-pre-wrap">
        {item.content}
      </div>
    </article>
  );
}