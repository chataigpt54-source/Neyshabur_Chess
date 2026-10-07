import { createServerClient } from '@/lib/supabase';
import { Image as ImageIcon } from 'lucide-react';
import GallerySlider from '@/components/GallerySlider';

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

  // گروه‌بندی بر اساس تایتل
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.title?.trim() || 'بدون عنوان';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groups = Object.entries(grouped);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title flex items-center gap-2 mb-10">
        <ImageIcon className="w-8 h-8 text-turquoise-600" />
        گالری تصاویر
      </h1>

      {groups.length === 0 ? (
        <div className="card p-16 text-center">
          <ImageIcon className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl">گالری خالی است</p>
          <p className="text-slate-400 mt-2">تصاویر از پنل مدیریت اضافه می‌شوند</p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map(([title, groupItems]) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-turquoise-500 rounded-full" />
                {title}
                {groupItems.length > 1 && (
                  <span className="text-sm font-normal text-slate-400">
                    ({groupItems.length} تصویر)
                  </span>
                )}
              </h2>

              {/* اگر فقط یک تصویر باشه، ساده نشون بده؛ وگرنه اسلایدر */}
              {groupItems.length === 1 ? (
                <div className="max-w-sm">
                  <div className="card aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={groupItems[0].image_url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="max-w-md">
                  <GallerySlider items={groupItems} />
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
