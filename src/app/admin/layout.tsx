import { isAdminAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-100" dir="rtl">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}
