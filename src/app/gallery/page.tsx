import { createServerClient } from '@/lib/supabase';
import { Image as ImageIcon } from 'lucide-react';

export const metadata = { title: 'گالری' };
export const revalidate = 60;

async function getGallery() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <ImageIcon className="w-8 h-8 text-turquoise-600" />
        گالری تصاویر
      </h1>

      {items.length === 0 ? (
        <div className="card p-16 text-center">
          <ImageIcon className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl">گالری خالی است</p>
          <p className="text-slate-400 mt-2">تصاویر از پنل مدیریت اضافه می‌شوند</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card group aspect-square overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title || 'تصویر گالری'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
