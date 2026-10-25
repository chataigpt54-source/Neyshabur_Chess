'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/news', label: 'اخبار' },
  { href: '/announcements', label: 'اطلاعیه‌ها' },
  { href: '/players', label: 'بازیکنان، مربیان و داوران' },
  { href: '/tournaments', label: 'تورنمنت‌ها' },
  { href: '/gallery', label: 'گالری' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Header({
  logoUrl,
}: {
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const src = logoUrl || '/logo.png';

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#091a30]/90 shadow-lg backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-7">
        <div className="flex min-h-[82px] items-center justify-between gap-3">

          {/* لوگو و نام هیأت */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="صفحه اصلی هیأت شطرنج شهرستان نیشابور"
            className="group flex shrink-0 items-center gap-2"
          >
            <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
              <Image
                src={src}
                alt="لوگوی هیأت شطرنج شهرستان نیشابور"
                fill
                sizes="48px"
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="hidden flex-col sm:flex">
              <span className="whitespace-nowrap text-sm font-extrabold text-white lg:text-base">
                هیأت شطرنج
              </span>
              <span className="mt-1 whitespace-nowrap text-[11px] text-[#d9bd80] lg:text-xs">
                شهرستان نیشابور
              </span>
            </div>
          </Link>

          {/* منوی دسکتاپ؛ همه دکمه‌ها در یک ردیف */}
          <nav
            aria-label="منوی اصلی"
            className="hidden flex-1 items-center justify-center gap-1 xl:flex 2xl:gap-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-white/60 bg-white/90 px-3 py-2.5 text-[11px] font-bold text-[#0b2342] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:shadow-md lg:px-3.5 lg:text-xs 2xl:px-4 2xl:text-[13px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* دکمه منوی موبایل */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#0b2342] shadow-sm backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd80] xl:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* منوی موبایل */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden xl:hidden"
            >
              <nav
                aria-label="منوی موبایل"
                className="flex flex-wrap justify-center gap-2 border-t border-white/10 py-4"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025, duration: 0.18 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-[#0b2342] shadow-sm backdrop-blur-md transition hover:bg-white"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
