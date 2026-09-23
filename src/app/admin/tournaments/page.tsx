'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Tournament = {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  registration_open: boolean;
  image_url?: string | null;
  location?: string | null;
  max_participants?: number | null;
  updated_at?: string;
};

type Registration = {
  id: string;
  tournament_id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  status: string;
  created_at?: string;
};

type FormState = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'past';
  registration_open: boolean;
  image_url: string;
  location: string;
  max_participants: string;
};

const emptyForm: FormState = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'upcoming',
  registration_open: true,
  image_url: '',
  location: '',
  max_participants: '',
};

export default function AdminTournamentsPage() {
  const [items, setItems] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [viewRegsId, setViewRegsId] = useState<string | null>(null);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const load = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading tournaments:', error);
      setItems([]);
    } else {
      setItems((data ?? []) as Tournament[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (tournament: Tournament) => {
    setEditing(tournament);

    setForm({
      title: tournament.title ?? '',
      description: tournament.description ?? '',
      start_date: tournament.start_date ?? '',
      end_date: tournament.end_date ?? '',
      status: tournament.status ?? 'upcoming',
      registration_open: tournament.registration_open ?? true,
      image_url: tournament.image_url ?? '',
      location: tournament.location ?? '',
      max_participants:
        tournament.max_participants !== null &&
        tournament.max_participants !== undefined
          ? String(tournament.max_participants)
          : '',
    });

    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      alert('عنوان تورنمنت را وارد کنید.');
      return;
    }

    if (!form.start_date) {
      alert('تاریخ شروع را وارد کنید.');
      return;
    }

    setSaving(true);

    const parsedMaxParticipants = form.max_participants.trim()
      ? Number.parseInt(form.max_participants, 10)
      : null;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      status: form.status,
      registration_open: form.registration_open,
      image_url: form.image_url.trim() || null,
      location: form.location.trim() || null,
      max_participants:
        parsedMaxParticipants !== null &&
        !Number.isNaN(parsedMaxParticipants)
          ? parsedMaxParticipants
          : null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editing) {
        const { error } = await supabase
          .from('tournaments')
          .update(payload)
          .eq('id', editing.id);
if (error) {
          console.error(error);
          alert('خطا در ویرایش تورنمنت.');
          return;
        }
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert(payload);

        if (error) {
          console.error(error);
          alert('خطا در ایجاد تورنمنت.');
          return;
        }
      }

      setShowForm(false);
      setEditing(null);
      setForm({ ...emptyForm });

      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const confirmed = window.confirm(
      'آیا از حذف این تورنمنت مطمئن هستید؟'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('خطا در حذف تورنمنت.');
      return;
    }

    if (viewRegsId === id) {
      setViewRegsId(null);
      setRegs([]);
    }

    await load();
  };

  const viewRegs = async (id: string) => {
    setViewRegsId(id);
    setLoadingRegs(true);

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('tournament_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading registrations:', error);
      setRegs([]);
      alert('خطا در دریافت ثبت‌نام‌ها.');
    } else {
      setRegs((data ?? []) as Registration[]);
    }

    setLoadingRegs(false);
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-navy-800">
          مدیریت تورنمنت‌ها
        </h1>

        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          تورنمنت جدید
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-bold text-lg">
            {editing ? 'ویرایش تورنمنت' : 'تورنمنت جدید'}
          </h2>

          <input
            className="input-field w-full"
            placeholder="عنوان تورنمنت"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />

          <textarea
            className="input-field w-full min-h-28"
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                تاریخ شروع
              </label>

              <input
                type="date"
                className="input-field w-full"
                value={form.start_date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 block mb-1">
                تاریخ پایان
              </label>

              <input
                type="date"
                className="input-field w-full"
                value={form.end_date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
              />
            </div>
          </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="input-field w-full"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as FormState['status'],
                }))
              }
            >
              <option value="upcoming">آینده</option>
              <option value="ongoing">در حال برگزاری</option>
              <option value="past">گذشته</option>
            </select>

            <input
              className="input-field w-full"
              placeholder="محل برگزاری"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
          </div>

          <input
            className="input-field w-full"
            placeholder="آدرس تصویر"
            value={form.image_url}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                image_url: e.target.value,
              }))
            }
            dir="ltr"
          />

          <input
            type="number"
            min="1"
            className="input-field w-full"
            placeholder="حداکثر شرکت‌کننده"
            value={form.max_participants}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                max_participants: e.target.value,
              }))
            }
            dir="ltr"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.registration_open}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  registration_open: e.target.checked,
                }))
              }
            />
            <span>ثبت‌نام باز باشد</span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  در حال ذخیره...
                </>
              ) : (
                'ذخیره'
              )}
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="btn-outline"
              disabled={saving}
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {viewRegsId && (
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              ثبت‌نام‌ها
            </h2>

            <button
              onClick={() => {
                setViewRegsId(null);
                setRegs([]);
              }}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              بستن
            </button>
          </div>

          {loadingRegs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-7 h-7 animate-spin text-turquoise-600" />
            </div>
          ) : regs.length === 0 ? (
            <p className="text-slate-500">
              ثبت‌نامی وجود ندارد.
            </p>
          ) : (
            <div className="space-y-2">
              {regs.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-slate-50 rounded-xl p-3 text-sm"
                >
                  <p className="font-medium">
                    {registration.full_name}
                  </p>
<p className="text-slate-500 mt-1">
                    {registration.phone}

                    {registration.email && (
                      <>
                        {' • '}
                        {registration.email}
                      </>
                    )}
                  </p>

                  <span className="inline-block mt-2 text-xs bg-slate-200 px-2 py-0.5 rounded">
                    {registration.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-turquoise-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          تورنمنتی وجود ندارد
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((tournament) => (
            <div
              key={tournament.id}
              className="card p-4 flex flex-wrap items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-navy-800">
                  {tournament.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(tournament.start_date)} •{' '}
                  {tournament.status === 'upcoming'
                    ? 'آینده'
                    : tournament.status === 'ongoing'
                      ? 'در حال برگزاری'
                      : 'گذشته'}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => viewRegs(tournament.id)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-turquoise-600"
                  title="ثبت‌نام‌ها"
                >
                  <Users className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openEdit(tournament)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                  title="ویرایش"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => remove(tournament.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  title="حذف"
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