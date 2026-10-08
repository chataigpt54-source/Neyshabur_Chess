import { isRefereeAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RefereeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isRefereeAuthenticated();

  return (
    <div dir="rtl">
      {children}
    </div>
  );
}
