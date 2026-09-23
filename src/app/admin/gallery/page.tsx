'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { GalleryItem } from '@/types/database';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!url.trim()) return;
    setSaving(true);
    await supabase.from('gallery').insert({ image_url: url, title: title || null });
    setUrl('');
    setTitle('');
    setSaving(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('حذف تصویر؟')) return;
    await supabase.from('gallery').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-6">مدیریت گالری</h1>

      <div className="card p-6 mb-6 space-y-3">
        <input className="input-field" placeholder="آدرس تصویر (URL)" value={url} onChange={(e) => setUrl(e.target.value)} dir="ltr" />
        <input className="input-field" placeholder="عنوان (اختیاری)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={add} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
          افزودن
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-turquoise-600" /></div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">گالری خالی است</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card relative group aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover" />
              <button
                onClick={() => remove(item.id)}
                className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
