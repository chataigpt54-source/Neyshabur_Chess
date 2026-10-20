
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Users,
  Trophy,
  Image,
  FileText,
  LogOut,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/news', label: 'اخبار', icon: Newspaper },
  {
    href: '/admin/announcements',
    label: 'اطلاعیه‌ها',
    icon: Megaphone,
  },
  { href: '/admin/players', label: 'بازیکنان', icon: Users },
  { href: '/admin/tournaments', label: 'تورنمنت‌ها', icon: Trophy },
  { href: '/admin/gallery', label: 'گالری', icon: Image },
  { href: '/admin/pages', label: 'صفحات ثابت', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="sticky top-0 flex min-h-screen w-64 flex-col bg-navy-900 text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500">
            <Crown className="h-5 w-5 text-navy-900" />
          </div>

          <div>
            <p className="text-sm font-bold">پنل مدیریت</p>
            <p className="text-xs text-turquoise-300">
              شطرنج نیشابور
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/admin' &&
              pathname.startsWith(link.href));

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-turquoise-600 text-white shadow-soft'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200"
        >
          <LogOut className="h-5 w-5" />
          خروج
        </button>
      </div>
    </aside>
  );
}
