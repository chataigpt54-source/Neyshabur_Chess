'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import type { Tournament, Registration } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function AdminTournamentsPage() {
  const [items, setItems] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', start_date: '', end_date: '', status: 'upcoming' as const,
    registration_open: true, image_url: '', location: '', max_participants: '',
  });
  const [saving, setSaving] = useState(false);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [viewRegsId, setViewRegsId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', start_date: '', end_date: '', status: 'upcoming', registration_open: true, image_url: '', location: '', max_participants: '' });
    setShowForm(true);
  };

  const openEdit = (t: Tournament) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description || '',
      start_date: t.start_date,
      end_date: t.end_date || '',
      status: t.status,
      registration_open: t.registration_open,
      image_url: t.image_url || '',
      location: t.location || '',
      max_participants: t.max_participants?.toString() || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.start_date) return;
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      status: form.status,
      registration_open: form.registration_open,
      image_url: form.image_url || null,
      location: form.location || null,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      await supabase.from('tournaments').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('tournaments').insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('حذف تورنمنت و تمام ثبت‌نام‌ها؟')) return;
    await supabase.from('tournaments').delete().eq('id', id);
    load();
  };

  const viewRegs = async (id: string) => {
    setViewRegsId(id);
    const { data } = await supabase.from('registrations').select('*').eq('tournament_id', id).order('created_at', { ascending: false });
    setRegs(data || []);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-800">مدیریت تورنمنت‌ها</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> تورنمنت جدید</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-bold">{editing ? 'ویرایش' : 'تورنمنت جدید'}</h2>
          <input className="input-field" placeholder="عنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" placeholder="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-500">تاریخ شروع</label>
              <input type="date" className="input-field" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-slate-500">تاریخ پایان</label>
              <input type="date" className="input-field" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
              <option value="upcoming">آینده</option>
              <option value="ongoing">در حال برگزاری</option>
              <option value="past">گذشته</option>
            </select>
            <input className="input-field" placeholder="محل برگزاری" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <input className="input-field" placeholder="آدرس تصویر" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} dir="ltr" />
          <input className="input-field" placeholder="حداکثر شرکت‌کننده" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.registration_open} onChange={(e) => setForm({ ...form, registration_open: e.target.checked })} />
            ثبت‌نام باز باشد
          </label>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary">{saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'ذخیره'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">انصراف</button>
          </div>
        </div>
      )}

      {viewRegsId && (
        <div className="card p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2"><Users className="w-5 h-5" /> ثبت‌نام‌ها</h2>
            <button onClick={() => setViewRegsId(null)} className="text-sm text-slate-500">بستن</button>
          </div>
          {regs.length === 0 ? <p className="text-slate-500">ثبت‌نامی وجود ندارد</p> : (
            <div className="space-y-2">
              {regs.map((r) => (
                <div key={r.id} className="bg-slate-50 rounded-xl p-3 text-sm">
                  <p className="font-medium">{r.full_name}</p>
                  <p className="text-slate-500">{r.phone} {r.email && `• ${r.email}`}</p>
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-turquoise-600" /></div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">تورنمنتی وجود ندارد</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="card p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-navy-800">{t.title}</h3>
                <p className="text-xs text-slate-400">{formatDate(t.start_date)} • {t.status}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => viewRegs(t.id)} className="p-2 rounded-lg hover:bg-slate-100 text-turquoise-600" title="ثبت‌نام‌ها"><Users className="w-4 h-4" /></button>
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-slate-100"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
