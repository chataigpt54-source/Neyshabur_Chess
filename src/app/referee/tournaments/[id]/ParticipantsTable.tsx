
'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

type Participant = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
};

export default function ParticipantsTable({
  participants,
}: {
  participants: Participant[];
}) {
  const [search, setSearch] = useState('');

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return participants;

    return participants.filter((participant) =>
      [
        participant.full_name,
        participant.phone,
        participant.email,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [participants, search]);

  return (
    <div className="card overflow-hidden">
      {participants.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          هنوز ثبت‌نامی در فرم Tally ثبت نشده است.
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input-field w-full pr-10"
                placeholder="جست‌وجوی نام، تلفن یا ایمیل..."
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              نمایش {filteredParticipants.length} نفر از {participants.length} شرکت‌کننده
            </p>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              نتیجه‌ای برای جست‌وجوی شما پیدا نشد.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="px-4 py-3 text-right">#</th>
                    <th className="px-4 py-3 text-right">
                      نام و نام خانوادگی
                    </th>
                    <th className="px-4 py-3 text-right">تلفن</th>
                    <th className="px-4 py-3 text-right">ایمیل</th>
                    <th className="px-4 py-3 text-right">تاریخ ثبت‌نام</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.map((participant, index) => (
                    <tr
                      key={participant.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy-800">
                        {participant.full_name}
                      </td>
                      <td
                        className="px-4 py-3 text-slate-600"
                        dir="ltr"
                      >
                        {participant.phone || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {participant.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {participant.created_at
                          ? new Date(participant.created_at).toLocaleDateString('fa-IR')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
