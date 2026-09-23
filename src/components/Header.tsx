'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/news', label: 'اخبار' },
  { href: '/players', label: 'بازیکنان' },
  { href: '/tournaments', label: 'تورنمنت‌ها' },
  { href: '/gallery', label: 'گالری' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Header({ logoUrl }: { logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const src = logoUrl || '/logo.png';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-turquoise-400 to-navy-600 p-0.5 shadow-soft group-hover:shadow-gold transition-shadow">
              <Image
                src={src}
                alt="لوگوی هیأت شطرنج شهرستان نیشابور"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold text-navy-800 leading-tight">
                هیأت شطرنج
              </h1>
              <p className="text-xs text-turquoise-600 font-medium">شهرستان نیشابور</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-turquoise-600 
                           hover:bg-turquoise-50 rounded-lg transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="منو"
          >
            {open ? <X className="w-6 h-6 text-navy-700" /> : <Menu className="w-6 h-6 text-navy-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-navy-700 hover:bg-turquoise-50 hover:text-turquoise-700 
                               rounded-xl font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
