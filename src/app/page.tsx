import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { Newspaper, Trophy, ArrowLeft, Users } from 'lucide-react';
import NewsSlider from '@/components/NewsSlider';

export const revalidate = 60;

async function getLatestNews() {
  try {
    const supabase = createServerClient();

    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(10);

    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const news = await getLatestNews();

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-800 to-turquoise-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* متن */}
            <div className="max-w-3xl flex-1 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gold-300 mb-6 animate-fade-in">
                <Trophy className="w-4 h-4" />
                <span>وب‌سایت رسمی هیأت شطرنج</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
                هیأت شطرنج
                <span className="block text-turquoise-300 mt-2">
                  شهرستان نیشابور
                </span>
              </h1>

              <p
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed animate-slide-up mx-auto lg:mx-0"
                style={{ animationDelay: '0.1s' }}
              >
                مرکز توسعه، آموزش و برگزاری مسابقات شطرنج در نیشابور.
                همراه ما باشید تا استعدادهای شطرنجی شهرستان را شکوفا کنیم.
              </p>

              <div
                className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <Link
                  href="/tournaments"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  تورنمنت‌ها
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <Link
                  href="/players"
                  className="btn-outline border-white/40 text-white hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  بازیکنان و مربیان و داوران
                </Link>
              </div>
            </div>

            {/* کادر ویدیو */}
            <div className="flex-shrink-0 w-full max-w-[320px] md:max-w-[380px] lg:max-w-[420px] animate-fade-in">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 bg-black/40">

                <video
                  src="https://rykupd7voq6bakre.public.blob.vercel-storage.com/1000087731%20-%20herminal.com%20compressed.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls
                  className="w-full h-auto block"
                >
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>

              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 25C1248 30 1344 50 1392 60L1440 70V80H0V40Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Latest News - Slider */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-turquoise-600" />
            آخرین اخبار
          </h2>

          <Link
            href="/news"
            className="text-turquoise-600 hover:text-turquoise-700 text-sm font-medium flex items-center gap-1"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="card p-12 text-center">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />

            <p className="text-slate-500 text-lg">
              هنوز خبری منتشر نشده است
            </p>

            <p className="text-slate-400 text-sm mt-2">
              اخبار از طریق پنل مدیریت اضافه خواهند شد
            </p>
          </div>
        ) : (
          <NewsSlider items={news} />
        )}
      </section>
    </div>
  );
}
