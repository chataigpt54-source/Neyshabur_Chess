import Link from 'next/link';
import {
  Instagram,
  Send,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white mt-auto border-t border-gold-500/20 relative overflow-hidden">
      {/* نور پس‌زمینه ملایم برای حس لوکس */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* معرفی هیأت */}
          <div>
            <h3 className="text-lg font-black text-gold-400 mb-4 flex items-center gap-2">
              <span>هیأت شطرنج شهرستان نیشابور</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              توسعه و ترویج ورزش فکری شطرنج در شهرستان نیشابور با برگزاری مسابقات،
              آموزش تخصصی و پرورش استعدادهای جوان.
            </p>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h3 className="text-lg font-black text-gold-400 mb-4">
              دسترسی سریع
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link
                  href="/news"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  اخبار و رویدادها
                </Link>
              </li>

              <li>
                <Link
                  href="/announcements"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  اطلاعیه‌ها
                </Link>
              </li>

              <li>
                <Link
                  href="/players"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  بازیکنان، مربیان و داوران
                </Link>
              </li>

              <li>
                <Link
                  href="/tournaments"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  تورنمنت‌ها و مسابقات
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  گالری تصاویر
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  درباره هیأت
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-gold-400 transition-colors duration-200"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-lg font-black text-gold-400 mb-4">
              ارتباط با ما
            </h3>

            <ul className="space-y-3.5 text-sm text-slate-300 font-medium">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 mt-1 text-gold-400 flex-shrink-0" />
                <span className="leading-relaxed">
                  خراسان رضوی، نیشابور، خیابان کمال‌الملک، درب شمالی مجموعه
                  ورزشی تختی، طبقه فوقانی سالن سنگ‌نوردی
                </span>
              </li>

              <li className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <div className="space-y-1">
                  <a
                    href="tel:+989153528177"
                    className="hover:text-gold-400 transition-colors block"
                  >
                    مهدی بوژمهرانی — ۰۹۱۵۳۵۲۸۱۷۷
                  </a>

                  <a
                    href="tel:+989155516167"
                    className="hover:text-gold-400 transition-colors block"
                  >
                    مسعود مشایخان — ۰۹۱۵۵۵۱۶۱۶۷
                  </a>
                </div>
              </li>

              <li className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a
                  href="mailto:chesskhayam@gmail.com"
                  className="hover:text-gold-400 transition-colors"
                  dir="ltr"
                >
                  chesskhayam@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div>
            <h3 className="text-lg font-black text-gold-400 mb-4">
              شبکه‌های اجتماعی
            </h3>

            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/chessneyshabur.official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-navy-900 border border-white/10 hover:border-gold-400/50 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>

              <a
                href="https://eitaa.com/CHESSABARSHAHR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-navy-900 border border-white/10 hover:border-gold-400/50 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="ایتا"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>

              <a
                href="https://t.me/Chesskhayyam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-navy-900 border border-white/10 hover:border-gold-400/50 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="تلگرام"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} هیأت شطرنج شهرستان نیشابور — تمامی حقوق محفوظ است
          </p>

          <p className="text-slate-400 text-xs mt-2 font-medium">
            Made and Developed by{' '}
            <Link
              href="/players/15f75a25-62e8-4e3c-a346-2abec8592307"
              className="text-gold-400 hover:underline transition-colors"
            >
              Mehrab Boozhmehrani
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
