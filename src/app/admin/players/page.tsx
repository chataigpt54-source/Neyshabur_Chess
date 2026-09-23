'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Loader2, User } from 'lucide-react';
import type { Player } from '@/types/database';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [form, setForm] = useState({ name: '', photo_url: '', bio: '', achievements: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('players').select('*').order('name');
    setPlayers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', photo_url: '', bio: '', achievements: '' });
    setShowForm(true);
  };

  const openEdit = (p: Player) => {
    setEditing(p);
    setForm({ name: p.name, photo_url: p.photo_url || '', bio: p.bio || '', achievements: p.achievements || '' });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing) {
      await supabase.from('players').update({
        name: form.name,
        photo_url: form.photo_url || null,
        bio: form.bio || null,
        achievements: form.achievements || null,
        updated_at: new Date().toISOString(),
      }).eq('id', editing.id);
    } else {
      await supabase.from('players').insert({
        name: form.name,
        photo_url: form.photo_url || null,
        bio: form.bio || null,
        achievements: form.achievements || null,
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('حذف این بازیکن؟')) return;
    await supabase.from('players').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-800">مدیریت بازیکنان</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> بازیکن جدید
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-bold">{editing ? 'ویرایش' : 'بازیکن جدید'}</h2>
          <input className="input-field" placeholder="نام کامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="آدرس عکس (URL)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} dir="ltr" />
          <textarea className="input-field min-h-[100px]" placeholder="بیوگرافی" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <textarea className="input-field min-h-[80px]" placeholder="مقام‌ها و افتخارات" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary">{saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'ذخیره'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">انصراف</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-turquoise-600" /></div>
      ) : players.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">بازیکنی ثبت نشده</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-6 h-6 text-slate-400" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-navy-800 truncate">{p.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-slate-100"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
