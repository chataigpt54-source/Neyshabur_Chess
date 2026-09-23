'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
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
    <aside className="w-64 bg-navy-900 text-white min-h-screen flex flex-col sticky top-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-navy-900" />
          </div>
          <div>
            <p className="font-bold text-sm">پنل مدیریت</p>
            <p className="text-xs text-turquoise-300">شطرنج نیشابور</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-turquoise-600 text-white shadow-soft'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          خروج
        </button>
      </div>
    </aside>
  );
}
