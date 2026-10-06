'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { News } from '@/types/database';

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image_url: '',
    published: false,
    published_at: '',
  });
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  // برای drag & drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setForm({
      title: '',
      content: '',
      image_url: '',
      published: false,
      published_at: local,
    });
    setShowForm(true);
  };

  const openEdit = (item: News) => {
    setEditing(item);
    let publishedAt = '';
    if (item.published_at) {
      const d = new Date(item.published_at);
      publishedAt = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    setForm({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
      published: item.published,
      published_at: publishedAt,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    const slug =
      form.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF\-]+/g, '')
        .slice(0, 80) +
      '-' +
      Date.now().toString(36);

    const publishedAtValue = form.published_at
      ? new Date(form.published_at).toISOString()
      : form.published
        ? new Date().toISOString()
        : null;

    if (editing) {
      await supabase
        .from('news')
        .update({
          title: form.title,
          content: form.content,
          image_url: form.image_url || null,
          published: form.published,
          published_at: publishedAtValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editing.id);
    } else {
      await supabase.from('news').insert({
        title: form.title,
        slug,
        content: form.content,
        image_url: form.image_url || null,
        published: form.published,
        published_at: publishedAtValue,
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('آیا از حذف این خبر مطمئن هستید؟')) return;
    await supabase.from('news').delete().eq('id', id);
    load();
  };

  // ——— Drag & Drop ———
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const items = [...news];
    const dragged = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragged);

    setNews(items);
    dragItem.current = null;
    dragOverItem.current = null;

    // ترتیب جدید رو با به‌روزرسانی published_at ذخیره می‌کنیم
    // (هرچه بالاتر باشد، تاریخ جدیدتر)
    setReordering(true);
    const now = Date.now();
    const updates = items.map((item, index) => {
      // فاصله ۱ دقیقه بین هر خبر تا ترتیب حفظ شود
      const newDate = new Date(now - index * 60_000).toISOString();
      return supabase
        .from('news')
        .update({ published_at: newDate, updated_at: new Date().toISOString() })
        .eq('id', item.id);
    });
    await Promise.all(updates);
    setReordering(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">مدیریت اخبار</h1>
          <p className="text-sm text-slate-500 mt-1">
            برای جابه‌جایی ترتیب، آیکون ≡ را بکشید
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          خبر جدید
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-bold text-navy-800">
            {editing ? 'ویرایش خبر' : 'خبر جدید'}
          </h2>
          <input
            className="input-field"
            placeholder="عنوان خبر"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input-field min-h-[150px]"
            placeholder="متن خبر"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="آدرس تصویر (URL)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            dir="ltr"
          />

          {/* فیلد تاریخ انتشار */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">
              تاریخ و ساعت انتشار
            </label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              dir="ltr"
            />
            <p className="text-xs text-slate-400 mt-1">
              این تاریخ ترتیب نمایش خبر در سایت را هم تعیین می‌کند
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">منتشر شود</span>
          </label>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ذخیره'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">
              انصراف
            </button>
          </div>
        </div>
      )}

      {loading || reordering ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-turquoise-600" />
        </div>
      ) : news.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">هیچ خبری وجود ندارد</div>
      ) : (
        <div className="space-y-3">
          {news.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="card p-4 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none"
            >
              {/* دستگیره جابه‌جایی */}
              <div className="text-slate-400 hover:text-navy-600 flex-shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-navy-800 truncate">{item.title}</h3>
                  {item.published ? (
                    <Eye className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {item.published_at
                    ? formatDate(item.published_at)
                    : formatDate(item.created_at)}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-navy-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
