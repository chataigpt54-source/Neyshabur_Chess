
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  const src = logoUrl || '/logo.png';

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#091a30]/85 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-[1700px] px-3 sm:px-5 lg:px-7">
        <div className="flex min-h-[86px] items-center gap-4">

          {/* لوگو و نام هیأت */}
          <Link
            href="/"
            aria-label="صفحه اصلی هیأت شطرنج شهرستان نیشابور"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <motion.div
              whileHover={{ scale: 1.07, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12"
            >
              <Image
                src={src}
                alt="لوگوی هیأت شطرنج شهرستان نیشابور"
                fill
                sizes="48px"
                priority
                className="object-contain"
              />
            </motion.div>

            <div className="hidden flex-col sm:flex">
              <span className="whitespace-nowrap text-sm font-extrabold text-white lg:text-base">
                هیأت شطرنج
              </span>
              <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-[#d9bd80] lg:text-xs">
                شهرستان نیشابور
              </span>
            </div>
          </Link>

          {/* تمام گزینه‌ها کنار لوگو؛ بدون منوی سه‌خطی */}
          <nav
            aria-label="منوی اصلی"
            className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-1.5 py-3 lg:gap-2"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.045,
                  ease: 'easeOut',
                }}
                whileHover={{ y: -3, scale: 1.045 }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0"
              >
                <Link
                  href={item.href}
                  className="group relative flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-white/60 bg-white/[0.88] px-3 py-2.5 text-[11px] font-bold text-[#0b2342] shadow-[0_3px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-white hover:shadow-[0_8px_22px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd80] lg:px-3.5 lg:text-xs 2xl:px-4 2xl:text-[13px]"
                >
                  {/* درخشش متحرک شیشه */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]"
                  />

                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#164e63]">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
