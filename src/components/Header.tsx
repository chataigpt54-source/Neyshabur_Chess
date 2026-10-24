
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
  { href: '/players', label: 'بازیکنان و مربیان و داوران' },
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
      className="sticky top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div className="mx-auto max-w-7xl">
        <div className="header-glass relative rounded-[24px] border border-white/15 bg-[#0b2342]/90 shadow-[0_12px_40px_rgba(7,26,50,0.18)] backdrop-blur-2xl">
          {/* خط طلایی ظریف */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-[#edc66f]/80 to-transparent"
          />

          <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 md:min-h-[86px]">
            {/* لوگو و نام هیأت */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="group flex min-w-0 items-center gap-3"
              aria-label="صفحه اصلی هیأت شطرنج شهرستان نیشابور"
            >
              <div className="logo-ring relative h-12 w-12 shrink-0 rounded-full p-[2px] sm:h-14 sm:w-14">
                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20 bg-[#102b4b]">
                  <Image
                    src={src}
                    alt="لوگوی هیأت شطرنج شهرستان نیشابور"
                    fill
                    sizes="56px"
                    className="rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="whitespace-nowrap text-sm font-black leading-6 text-white sm:text-base">
                  هیأت شطرنج
                </h1>
                <p className="whitespace-nowrap text-[11px] font-semibold text-[#edc66f] sm:text-xs">
                  شهرستان نیشابور
                </p>
                <div className="mt-1 hidden h-px w-12 bg-gradient-to-l from-[#edc66f] to-transparent sm:block" />
              </div>
            </Link>

            {/* منوی دسکتاپ */}
            <nav
              aria-label="منوی اصلی"
              className="hidden items-center gap-1 xl:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link group relative whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10 hover:text-[#f3d58f] 2xl:px-3.5"
                >
                  {item.label}
                  <span className="absolute bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#edc66f] transition-all duration-300 group-hover:w-1/2" />
                </Link>
              ))}
            </nav>

            {/* دکمه منوی موبایل و تبلت */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] text-white transition-all duration-300 hover:border-[#edc66f]/50 hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edc66f] xl:hidden"
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -70, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 70, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* منوی موبایل */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden xl:hidden"
              >
                <div className="mx-3 mb-3 rounded-[20px] border border-white/10 bg-[#071a32]/75 p-2 shadow-inner sm:mx-4">
                  <nav
                    aria-label="منوی موبایل"
                    className="flex flex-col gap-1"
                  >
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.035,
                          duration: 0.22,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="mobile-nav-link group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/[0.08] hover:text-[#f3d58f]"
                        >
                          <span>{item.label}</span>
                          <ChevronLeft className="h-4 w-4 shrink-0 text-slate-500 transition-all duration-200 group-hover:-translate-x-1 group-hover:text-[#edc66f]" />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="mx-3 mt-2 border-t border-white/10 pt-3 pb-1 text-center">
                    <p className="text-[11px] font-medium text-slate-400">
                      هیأت شطرنج شهرستان نیشابور
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .header-glass {
          -webkit-backdrop-filter: blur(24px);
        }

        .logo-ring {
          background: linear-gradient(
            135deg,
            #f5df9d 0%,
            #edc66f 30%,
            #319795 65%,
            #0b2342 100%
          );
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.035);
          transition:
            box-shadow 0.35s ease,
            transform 0.35s ease;
        }

        .group:hover .logo-ring {
          transform: translateY(-1px);
          box-shadow:
            0 0 0 4px rgba(237, 198, 111, 0.08),
            0 0 22px rgba(237, 198, 111, 0.16);
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-ring,
          .nav-link,
          .mobile-nav-link {
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
}
