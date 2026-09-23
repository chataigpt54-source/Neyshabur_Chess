'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save } from 'lucide-react';
import type { Page } from '@/types/database';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { title: string; content: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('pages').select('*');
    setPages(data || []);
    const map: Record<string, { title: string; content: string }> = {};
    (data || []).forEach((p) => {
      map[p.slug] = { title: p.title, content: p.content };
    });
    setEdits(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (slug: string) => {
    setSaving(slug);
    await supabase
      .from('pages')
      .update({
        title: edits[slug].title,
        content: edits[slug].content,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);
    setSaving(null);
    load();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-turquoise-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-6">مدیریت صفحات ثابت</h1>

      <div className="space-y-8">
        {pages.map((page) => (
          <div key={page.slug} className="card p-6 space-y-4">
            <h2 className="font-bold text-navy-700">/{page.slug}</h2>
            <input
              className="input-field"
              value={edits[page.slug]?.title || ''}
              onChange={(e) => setEdits({ ...edits, [page.slug]: { ...edits[page.slug], title: e.target.value } })}
              placeholder="عنوان"
            />
            <textarea
              className="input-field min-h-[200px]"
              value={edits[page.slug]?.content || ''}
              onChange={(e) => setEdits({ ...edits, [page.slug]: { ...edits[page.slug], content: e.target.value } })}
              placeholder="محتوا"
            />
            <button
              onClick={() => save(page.slug)}
              disabled={saving === page.slug}
              className="btn-primary flex items-center gap-2"
            >
              {saving === page.slug ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
              ذخیره
            </button>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="card p-8 text-center text-slate-500">
            صفحات about و contact هنوز در دیتابیس ایجاد نشده‌اند. اسکریپت SQL را اجرا کنید.
          </div>
        )}
      </div>
    </div>
  );
}
