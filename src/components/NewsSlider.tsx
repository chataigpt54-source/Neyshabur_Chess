// components/NewsSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';

interface NewsItem {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  image_url?: string | null;
  published_at: string;
}

export default function NewsSlider({ items }: { items: NewsItem[] }) {
  const [current, setCurrent] = useState(0);

  // اتوپلی هر ۵ ثانیه
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  const item = items[current];

  return (
    <div className="relative group max-w-2xl mx-auto">
      <Link
        href={`/news/${item.slug}`}
        className="card block overflow-hidden hover:-translate-y-1 transition-transform"
      >
        {item.image_url ? (
          <div className="aspect-video relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-turquoise-100 to-navy-100 flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-turquoise-400" />
          </div>
        )}
        <div className="p-5">
          <time className="text-xs text-slate-400">{formatDate(item.published_at)}</time>
          <h3 className="font-bold text-navy-800 mt-2 line-clamp-2">{item.title}</h3>
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
            {truncate(item.content, 100)}
          </p>
        </div>
      </Link>

      {/* دکمه‌های ناوبری */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-[30%] -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="قبلی"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-[30%] -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="بعدی"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* نقاط پایین */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-turquoise-500 w-4' : 'bg-slate-300'
                }`}
                aria-label={`خبر ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
