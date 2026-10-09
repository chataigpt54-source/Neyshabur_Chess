
'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { TallyParticipant } from '@/lib/tally';

export default function ParticipantsTable({
  participants,
}: {
  participants: TallyParticipant[];
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return participants;

    return participants.filter((participant) =>
      [
        participant.full_name,
        participant.phone,
        participant.email,
        ...Object.entries(participant.answers).flat(),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [participants, search]);

  return (
    <section className="card overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field w-full pr-10"
            placeholder="جست‌وجوی نام، تلفن، ایمیل یا سایر اطلاعات..."
          />
        </div>

        <p className="text-xs text-slate-500 mt-3">
          نمایش {filtered.length} نفر از {participants.length} شرکت‌کننده
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-slate-500">
          {participants.length === 0
            ? 'هنوز پاسخی از فرم Tally دریافت نشده است.'
            : 'موردی مطابق جست‌وجوی شما پیدا نشد.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-4 py-3 text-right">#</th>
                <th className="px-4 py-3 text-right">نام و نام خانوادگی</th>
                <th className="px-4 py-3 text-right">تلفن</th>
                <th className="px-4 py-3 text-right">ایمیل</th>
                <th className="px-4 py-3 text-right">اطلاعات ثبت‌نام</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((participant, index) => (
                <tr key={participant.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-800">
                    {participant.full_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600" dir="ltr">
                    {participant.phone || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {participant.email || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer text-turquoise-700">
                        مشاهده همه فیلدها
                      </summary>
                      <div className="mt-2 space-y-1 min-w-52">
                        {Object.entries(participant.answers).map(
                          ([label, value]) => (
                            <p key={label} className="text-slate-600">
                              <strong>{label}:</strong> {value || '—'}
                            </p>
                          ),
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
