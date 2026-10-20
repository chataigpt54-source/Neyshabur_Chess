
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Megaphone,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import type { Announcement } from '@/types/database';

type FormState = {
  title: string;
  content: string;
  image_url: string;
  published: boolean;
  duration_hours: string;
};

const initialForm: FormState = {
  title: '',
  content: '',
  image_url: '',
  published: true,
  duration_hours: '72',
};

const durations = [
  { value: '6', label: '۶ ساعت' },
  { value: '12', label: '۱۲ ساعت' },
  { value: '24', label: '۱ روز' },
  { value: '72', label: '۳ روز' },
  { value: '168', label: '۷ روز' },
  { value: '336', label: '۱۴ روز' },
  { value: '720', label: '۳۰ روز' },
];

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(
        'دریافت اطلاعیه‌ها ناموفق بود. ابتدا SQL دیتابیس را اجرا کنید. ' +
          queryError.message
      );
      setItems([]);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...initialForm });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEdit(item: Announcement) {
    const remainingHours = Math.max(
      1,
      Math.ceil(
        (new Date(item.expires_at).getTime() - Date.now()) / 3600000
      )
    );

    const matchingDuration = durations.some(
      (duration) => Number(duration.value) === remainingHours
    )
      ? String(remainingHours)
      : '72';

    setEditing(item);
    setForm({
      title: item.title,
      content: item.content || '',
      image_url: item.image_url || '',
      published: item.published,
      duration_hours: matchingDuration,
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function save() {
    setError('');
    setSuccess('');

    if (!form.title.trim()) {
      setError('لطفاً عنوان اطلاعیه را وارد کنید.');
      return;
    }

    const duration = Number(form.duration_hours);

    if (!Number.isFinite(duration) || duration <= 0) {
      setError('مدت اعتبار انتخاب‌شده معتبر نیست.');
      return;
    }

    const imageUrl = form.image_url.trim();

    if (imageUrl) {
      try {
        const parsedUrl = new URL(imageUrl);

        if (
          parsedUrl.protocol !== 'https:' &&
          parsedUrl.protocol !== 'http:'
        ) {
          setError('آدرس عکس باید با http یا https شروع شود.');
          return;
        }
      } catch {
        setError('آدرس عکس معتبر نیست.');
        return;
      }
    }

    setSaving(true);

    const now = new Date();

    const values = {
      title: form.title.trim(),
      content: form.content.trim(),
      image_url: imageUrl || null,
      published: form.published,
      published_at: now.toISOString(),
      expires_at: new Date(
        now.getTime() + duration * 60 * 60 * 1000
      ).toISOString(),
      updated_at: now.toISOString(),
    };

    const result = editing
      ? await supabase
          .from('announcements')
          .update(values)
          .eq('id', editing.id)
      : await supabase
          .from('announcements')
          .insert(values);

    setSaving(false);

    if (result.error) {
      setError('ذخیره انجام نشد: ' + result.error.message);
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm({ ...initialForm });
    setSuccess('اطلاعیه با موفقیت ذخیره شد.');

    await load();
  }

  async function remove(item: Announcement) {
    const confirmed = window.confirm(
      `اطلاعیه «${item.title}» حذف شود؟`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', item.id);

    if (deleteError) {
      setError('حذف انجام نشد: ' + deleteError.message);
      return;
    }

    setSuccess('اطلاعیه حذف شد.');
    await load();
  }

  function isActive(item: Announcement) {
    return (
      item.published &&
      new Date(item.expires_at).getTime() > Date.now()
    );
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-navy-800">
            <Megaphone className="h-7 w-7 text-turquoise-600" />
            مدیریت اطلاعیه‌ها
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            ثبت اطلاعیه، نمایش عکس و تعیین مدت اعتبار
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          اطلاعیه جدید
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <section className="card mb-6 space-y-5 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-navy-800">
              {editing ? 'ویرایش اطلاعیه' : 'ثبت اطلاعیه جدید'}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="بستن فرم"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              عنوان اطلاعیه *
            </label>

            <input
              className="input-field"
              value={form.title}
              maxLength={200}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="مثلاً ثبت‌نام مسابقات شطرنج"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              متن اطلاعیه
            </label>

            <textarea
              className="input-field min-h-[140px]"
              value={form.content}
              maxLength={10000}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              placeholder="متن اطلاعیه را وارد کنید..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              آدرس عکس (URL)
            </label>

            <input
              type="url"
              dir="ltr"
              className="input-field text-left"
              value={form.image_url}
              onChange={(event) =>
                setForm({ ...form, image_url: event.target.value })
              }
              placeholder="https://example.com/announcement.jpg"
            />

            {form.image_url.trim() && (
              <div className="mt-4 rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                  <ImageIcon className="h-4 w-4" />
                  پیش‌نمایش عکس
                </div>

                <img
                  key={form.image_url}
                  src={form.image_url}
                  alt="پیش‌نمایش اطلاعیه"
                  className="max-h-72 w-full rounded-lg object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = 'block';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              مدت اعتبار اطلاعیه
            </label>

            <select
              className="input-field"
              value={form.duration_hours}
              onChange={(event) =>
                setForm({
                  ...form,
                  duration_hours: event.target.value,
                })
              }
            >
              {durations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              اعتبار از لحظه ذخیره محاسبه می‌شود.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                setForm({ ...form, published: event.target.checked })
              }
              className="h-4 w-4"
            />
            <span className="text-sm">انتشار در صفحه اصلی</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {saving ? 'در حال ذخیره...' : 'ذخیره اطلاعیه'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline"
            >
              انصراف
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-turquoise-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <Megaphone className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500">
            هنوز اطلاعیه‌ای ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const active = isActive(item);

            return (
              <article
                key={item.id}
                className="card flex flex-wrap items-center gap-4 p-4"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-100">
                    <ImageIcon className="h-7 w-7 text-slate-400" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy-800">
                      {item.title}
                    </h3>

                    {active ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        <Eye className="ml-1 inline h-3 w-3" />
                        فعال
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                        <EyeOff className="ml-1 inline h-3 w-3" />
                        غیرفعال یا منقضی
                      </span>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {item.content || 'بدون متن'}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    پایان اعتبار:{' '}
                    {new Date(item.expires_at).toLocaleString('fa-IR')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label="ویرایش اطلاعیه"
                    className="rounded-lg p-2 text-navy-600 hover:bg-slate-100"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label="حذف اطلاعیه"
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
