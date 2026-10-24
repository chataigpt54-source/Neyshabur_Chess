
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Newspaper,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';

interface NewsItem {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  image_url?: string | null;
  published_at: string | null;
}

export default function NewsSlider({ items }: { items: NewsItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const count = items.length;

  const prev = useCallback(() => {
    setCurrent((value) => (value === 0 ? count - 1 : value - 1));
    setProgressKey((value) => value + 1);
  }, [count]);

  const next = useCallback(() => {
    setCurrent((value) => (value === count - 1 ? 0 : value + 1));
    setProgressKey((value) => value + 1);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;

    const timer = window.setTimeout(() => {
      setCurrent((value) => (value === count - 1 ? 0 : value + 1));
      setProgressKey((value) => value + 1);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [count, current, paused]);

  useEffect(() => {
    if (current >= count) {
      setCurrent(Math.max(0, count - 1));
    }
  }, [current, count]);

  if (count === 0) return null;

  const item = items[current];

  const selectSlide = (index: number) => {
    setCurrent(index);
    setProgressKey((value) => value + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const difference = endX - touchStartX.current;

    if (Math.abs(difference) > 50 && count > 1) {
      // حرکت انگشت برای پیمایش خبرها در موبایل
      if (difference > 0) next();
      else prev();
    }

    touchStartX.current = null;
  };

  return (
    <section
      className="news-slider group relative mx-auto w-full max-w-3xl"
      aria-label="آخرین اخبار"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="news-slider-card relative overflow-hidden rounded-3xl">
        <Link
          href={`/news/${item.slug}`}
          className="news-slider-link block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#319795]"
          aria-label={`مطالعه خبر: ${item.title}`}
        >
          <div className="news-slider-image relative aspect-[16/10] overflow-hidden sm:aspect-video">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.image_url}
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a1220] via-[#12333c] to-[#319795]">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                  <Newspaper className="h-12 w-12" strokeWidth={1.5} />
                </div>
              </div>
            )}

            <div className="news-slider-image-overlay absolute inset-0" />

            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#0a1220]/75 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:right-6 sm:top-6">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d4a017]" />
              تازه‌ترین اخبار
            </div>

            {item.published_at && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-white/15 bg-[#0a1220]/70 px-3 py-2 text-xs text-white backdrop-blur-md sm:bottom-6 sm:right-6">
                <CalendarDays className="h-4 w-4 text-[#d4a017]" />
                <time dateTime={item.published_at}>
                  {formatDate(item.published_at)}
                </time>
              </div>
            )}
          </div>

          <div className="news-slider-content relative p-5 sm:p-7">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#319795]">
              <span className="h-1 w-7 rounded-full bg-[#d4a017]" />
              اخبار هیأت شطرنج نیشابور
            </div>

            <h3 className="news-slider-title text-xl font-black leading-9 text-[#0a1220] sm:text-2xl sm:leading-10">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {truncate(item.content, 180)}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#319795] transition-colors group-hover:text-[#0a1220]">
                مطالعه کامل خبر
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </span>

              <span className="text-xs font-medium text-slate-400">
                {current + 1} از {count}
              </span>
            </div>
          </div>
        </Link>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              type="button"
              aria-label="خبر قبلی"
              className="news-slider-arrow absolute left-3 top-[32%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#0a1220]/75 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#319795] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] sm:left-5 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={next}
              type="button"
              aria-label="خبر بعدی"
              className="news-slider-arrow absolute right-3 top-[32%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#0a1220]/75 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#319795] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017] sm:right-5 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="news-slider-progress absolute bottom-0 right-0 z-20 h-1 w-full overflow-hidden bg-slate-200/70">
              {!paused && (
                <span
                  key={progressKey}
                  className="news-slider-progress-bar block h-full w-full origin-right bg-gradient-to-l from-[#d4a017] to-[#319795]"
                />
              )}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((news, index) => (
            <button
              key={news.id}
              type="button"
              onClick={() => selectSlide(index)}
              aria-label={`نمایش خبر شماره ${index + 1}`}
              aria-current={index === current ? 'true' : undefined}
              className={`news-slider-dot h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#319795] focus-visible:ring-offset-2 ${
                index === current
                  ? 'w-8 bg-[#319795]'
                  : 'w-2.5 bg-slate-300 hover:bg-[#d4a017]'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
