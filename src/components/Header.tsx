'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronLeft } from 'lucide-react';
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
      className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#091a30]/90 shadow-[0_5px_24px_rgba(4,15,30,0.10)] backdrop-blur-2xl"
    >
      {/* خط طلایی بسیار ظریف */}
      <div className="h-[2px] w-full bg-gradient-to-l from-transparent via-[#d4b16a]/70 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[78px] items-center justify-between gap-5 lg:min-h-[88px]">

          {/* لوگو و نام مجموعه */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="صفحه اصلی هیأت شطرنج شهرستان نیشابور"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full sm:h-[54px] sm:w-[54px]">
              <Image
                src={src}
                alt="لوگوی هیأت شطرنج شهرستان نیشابور"
                fill
                sizes="54px"
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white sm:text-base">
                هیأت شطرنج
              </span>
              <span className="mt-1 text-[11px] font-medium text-[#d9bd80] sm:text-xs">
                شهرستان نیشابور
              </span>
            </div>
          </Link>

          {/* منوی دسکتاپ */}
          <nav
            aria-label="منوی اصلی"
            className="hidden items-center gap-0.5 xl:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative whitespace-nowrap px-2.5 py-3 text-[12px] font-medium text-slate-300 transition-colors duration-200 hover:text-white 2xl:px-3 2xl:text-[13px]"
              >
                {item.label}

                <span className="absolute bottom-1 right-2.5 left-2.5 h-px origin-right scale-x-0 bg-[#d9bd80] transition-transform duration-200 group-hover:scale-x-100 2xl:right-3 2xl:left-3" />
              </Link>
            ))}
          </nav>

          {/* منوی موبایل */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd80]/70 xl:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* پنل بازشونده موبایل */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.23, ease: 'easeInOut' }}
              className="overflow-hidden xl:hidden"
            >
              <nav
                aria-label="منوی موبایل"
                className="border-t border-white/[0.09] py-3"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025, duration: 0.18 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <span>{item.label}</span>
                      <ChevronLeft className="h-4 w-4 text-slate-500" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-white/[0.07] py-3 text-center">
                <span className="text-[11px] text-slate-500">
                  هیأت شطرنج شهرستان نیشابور
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
