import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createServerClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: {
    default: 'هیأت شطرنج شهرستان نیشابور',
    template: '%s | هیأت شطرنج نیشابور',
  },
  description: 'وب‌سایت رسمی هیأت شطرنج شهرستان نیشابور — اخبار، بازیکنان، تورنمنت‌ها و گالری',
  keywords: ['شطرنج', 'نیشابور', 'هیأت شطرنج', 'تورنمنت شطرنج', 'chess'],
};

async function getLogo() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'logo_url')
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl = await getLogo();

  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir antialiased flex flex-col min-h-screen">
        <Header logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
