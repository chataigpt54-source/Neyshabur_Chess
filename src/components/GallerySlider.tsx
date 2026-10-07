// components/GallerySlider.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string | number;
  image_url: string;
  title?: string | null;
}

export default function GallerySlider({ items }: { items: GalleryItem[] }) {
  const [current, setCurrent] = useState(0);

  // اتوپلی هر ۳ ثانیه
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div className="relative group">
      {/* تصویر فعلی */}
      <div className="aspect-square overflow-hidden rounded-xl card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={items[current].image_url}
          alt={items[current].title || 'تصویر گالری'}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>

      {/* دکمه‌های ناوبری */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="قبلی"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="بعدی"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* نقاط پایین */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`اسلاید ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
