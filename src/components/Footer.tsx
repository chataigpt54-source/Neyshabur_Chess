import Link from 'next/link';
import { Instagram, Send, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gold-400 mb-4">هیأت شطرنج شهرستان نیشابور</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              توسعه و ترویج ورزش فکری شطرنج در شهرستان نیشابور با برگزاری مسابقات،
              آموزش و پرورش استعدادهای جوان.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gold-400 mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  اخبار
                </Link>
              </li>
              <li>
                <Link href="/players" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  بازیکنان
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  تورنمنت‌ها
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  گالری
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-turquoise-300 transition-colors">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gold-400 mb-4">ارتباط با ما</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 mt-0.5 text-turquoise-400 flex-shrink-0" />
                <span>خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <div>
                  <a href="tel:+989153528177" className="hover:text-turquoise-300 transition-colors block">
                    مهدی بوژمهرانی — ۰۹۱۵۳۵۲۸۱۷۷
                  </a>
                  <a href="tel:+989155516167" className="hover:text-turquoise-300 transition-colors block mt-1">
                    مسعود مشایخان — ۰۹۱۵۵۵۱۶۱۶۷
                  </a>
                </div>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <a href="mailto:chesskhayam@gmail.com" className="hover:text-turquoise-300 transition-colors" dir="ltr">
                  chesskhayam@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-gold-400 mb-4">شبکه‌های اجتماعی</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/chessneyshabur.official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 
                           flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://eitaa.com/CHESSABARSHAHR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-orange-500 
                           flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="ایتا"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/Chesskhayyam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-sky-500 
                           flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="تلگرام"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} هیأت شطرنج شهرستان نیشابور — تمامی حقوق محفوظ است
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Made and Development by Mehrab Boozhmehrani
          </p>
        </div>
      </div>
    </footer>
  );
}
