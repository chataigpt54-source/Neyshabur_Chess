import { createServerClient } from '@/lib/supabase';
import { Phone, Instagram, Send, MessageCircle, MapPin, Mail } from 'lucide-react';

export const metadata = { title: 'تماس با ما' };
export const revalidate = 60;

async function getContact() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('pages').select('*').eq('slug', 'contact').single();
    return data;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const page = await getContact();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <Phone className="w-8 h-8 text-turquoise-600" />
        {page?.title || 'تماس با ما'}
      </h1>

      {page?.content && (
        <div className="card p-8 md:p-10 mb-8">
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
            {page.content}
          </div>
        </div>
      )}

      {/* Contact details */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="card p-5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-turquoise-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-turquoise-700" />
          </div>
          <div>
            <h3 className="font-bold text-navy-800 mb-1">نشانی</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              خراسان رضوی، نیشابور، خیابان فلسطین، درب ورودی هیأت فوتبال، طبقه دوم
            </p>
          </div>
        </div>

        <div className="card p-5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-turquoise-100 flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-turquoise-700" />
          </div>
          <div>
            <h3 className="font-bold text-navy-800 mb-2">تلفن</h3>
            <a href="tel:+989153528177" className="block text-slate-600 hover:text-turquoise-600 transition-colors text-sm mb-1">
              مهدی بوژمهرانی — ۰۹۱۵۳۵۲۸۱۷۷
            </a>
            <a href="tel:+989155516167" className="block text-slate-600 hover:text-turquoise-600 transition-colors text-sm">
              مسعود مشایخان — ۰۹۱۵۵۵۱۶۱۶۷
            </a>
          </div>
        </div>

        <div className="card p-5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-turquoise-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-turquoise-700" />
          </div>
          <div>
            <h3 className="font-bold text-navy-800 mb-1">ایمیل</h3>
            <a
              href="mailto:chesskhayam@gmail.com"
              className="text-slate-600 hover:text-turquoise-600 transition-colors text-sm"
              dir="ltr"
            >
              chesskhayam@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://www.instagram.com/chessneyshabur.official"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-5 flex items-center gap-3 hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-navy-800 group-hover:text-turquoise-700">اینستاگرام</p>
            <p className="text-xs text-slate-400">@chessneyshabur.official</p>
          </div>
        </a>
        <a
          href="https://eitaa.com/CHESSABARSHAHR"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-5 flex items-center gap-3 hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-navy-800 group-hover:text-turquoise-700">ایتا</p>
            <p className="text-xs text-slate-400">CHESSABARSHAHR</p>
          </div>
        </a>
        <a
          href="https://t.me/Chesskhayyam"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-5 flex items-center gap-3 hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-navy-800 group-hover:text-turquoise-700">تلگرام</p>
            <p className="text-xs text-slate-400">@Chesskhayyam</p>
          </div>
        </a>
      </div>
    </div>
  );
}
