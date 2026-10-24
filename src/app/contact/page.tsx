import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import {
  Phone,
  Instagram,
  Send,
  MessageCircle,
  MapPin,
  Mail,
  ArrowUpLeft,
  Navigation,
  Clock,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'تماس با ما | هیأت شطرنج شهرستان نیشابور',
  description:
    'راه‌های ارتباطی، نشانی، تلفن و شبکه‌های اجتماعی هیأت شطرنج شهرستان نیشابور',
};

export const revalidate = 60;

async function getContact() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'contact')
      .maybeSingle();

    if (error) {
      console.error('خطا در دریافت صفحه تماس:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('خطا در دریافت صفحه تماس:', error);
    return null;
  }
}

const mapUrl = 'https://nshn.ir/sb1QdVWJc-pa';

const contactItems = [
  {
    title: 'مهدی بوژمهرانی',
    phone: '۰۹۱۵۳۵۲۸۱۷۷',
    href: 'tel:+989153528177',
  },
  {
    title: 'مسعود مشایخان',
    phone: '۰۹۱۵۵۵۱۶۱۶۷',
    href: 'tel:+989155516167',
  },
];

const socialItems = [
  {
    title: 'اینستاگرام',
    subtitle: '@chessneyshabur.official',
    href: 'https://www.instagram.com/chessneyshabur.official',
    icon: Instagram,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'ایتا',
    subtitle: 'CHESSABARSHAHR',
    href: 'https://eitaa.com/CHESSABARSHAHR',
    icon: MessageCircle,
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'تلگرام',
    subtitle: '@Chesskhayyam',
    href: 'https://t.me/Chesskhayyam',
    icon: Send,
    color: 'from-sky-500 to-cyan-600',
  },
];

export default async function ContactPage() {
  const page = await getContact();

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6f9] pb-16">
      {/* سربرگ */}
      <section className="relative isolate overflow-hidden bg-[#091a30]">
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 -z-10 h-72 w-72 rounded-full bg-amber-400/[0.07] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#d9bd80]">
              <Phone className="h-7 w-7" />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#d9bd80]">
                <Sparkles className="h-3.5 w-3.5" />
                ارتباط با خانواده شطرنج نیشابور
              </div>

              <h1 className="text-3xl font-black text-white md:text-4xl">
                {page?.title || 'تماس با ما'}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
            برای دریافت اطلاعات، پیگیری برنامه‌ها و ارتباط با هیأت شطرنج
            شهرستان نیشابور، از راه‌های ارتباطی زیر استفاده کنید.
          </p>

          <div className="mt-6 h-px w-full max-w-3xl bg-gradient-to-l from-[#d9bd80]/60 via-white/10 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        {/* توضیحات صفحه */}
        {page?.content && (
          <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
                <MessageCircle className="h-5 w-5" />
              </div>

              <h2 className="font-extrabold text-[#0b2342]">
                درباره ارتباط با ما
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600 md:text-base">
              {page.content}
            </p>
          </section>
        )}

        {/* اطلاعات تماس و نشانی */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* نشانی */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 md:px-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-extrabold text-[#0b2342]">
                  نشانی هیأت
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  محل مراجعه حضوری
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <p className="text-sm leading-8 text-slate-600">
                خراسان رضوی، نیشابور، خیابان کمال‌الملک، درب شمالی مجموعه
                ورزشی تختی، طبقه فوقانی سالن سنگ‌نوردی
              </p>

              <div className="mt-5 rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-1 h-4 w-4 shrink-0 text-[#319795]" />
                  <p className="text-xs leading-6 text-slate-500">
                    برای مشاهده موقعیت و مسیریابی، از لینک زیر استفاده کنید.
                  </p>
                </div>
              </div>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2342] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#15395e]"
                aria-label="مسیریابی به هیأت شطرنج شهرستان نیشابور در نشان"
              >
                <MapPin className="h-4 w-4 text-[#d9bd80]" />
                مسیریابی در نشان
                <ArrowUpLeft className="mr-auto h-4 w-4 text-white/70" />
              </a>
            </div>
          </section>

          {/* تلفن و ایمیل */}
          <div className="grid grid-cols-1 gap-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf5f5] text-[#247c7a]">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-extrabold text-[#0b2342]">
                    تماس تلفنی
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    ارتباط مستقیم
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {contactItems.map((contact) => (
                  <a
                    key={contact.href}
                    href={contact.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#f8fafc] p-4 transition-colors hover:border-[#319795]/30 hover:bg-[#edf5f5]/60"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#0b2342]">
                        {contact.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500" dir="rtl">
                        {contact.phone}
                      </p>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#247c7a] shadow-sm transition-colors group-hover:bg-[#0b2342] group-hover:text-white">
                      <Phone className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#a67a24]">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-[#0b2342]">
                    پست الکترونیکی
                  </h2>

                  <a
                    href="mailto:chesskhayam@gmail.com"
                    dir="ltr"
                    className="mt-2 inline-block break-all text-sm text-slate-500 transition-colors hover:text-[#247c7a]"
                  >
                    chesskhayam@gmail.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* شبکه‌های اجتماعی */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#0b2342]">
              ما را در شبکه‌های اجتماعی دنبال کنید
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              برای دنبال‌کردن اخبار، برنامه‌ها و اطلاعیه‌های شطرنج نیشابور
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socialItems.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${social.color} text-white shadow-sm`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#0b2342] transition-colors group-hover:text-[#247c7a]">
                      {social.title}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-1 truncate text-right text-xs text-slate-400"
                    >
                      {social.subtitle}
                    </p>
                  </div>

                  <ArrowUpLeft className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-[#247c7a]" />
                </a>
              );
            })}
          </div>
        </section>

        {/* پایان صفحه */}
        <div className="mt-12 flex flex-col items-center border-t border-slate-200 pt-8 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d9bd80]/40 bg-white text-[#a67a24]">
            <Clock className="h-5 w-5" />
          </div>

          <p className="text-sm font-bold text-[#0b2342]">
            هیأت شطرنج شهرستان نیشابور
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            برای اطلاع از زمان مراجعه حضوری، در صورت نیاز از طریق تلفن هماهنگ کنید.
          </p>
        </div>
      </div>
    </main>
  );
}
