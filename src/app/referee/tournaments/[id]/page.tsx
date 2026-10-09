
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Download, Users } from 'lucide-react';

import { isRefereeAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import ParticipantsTable from './ParticipantsTable';

export const dynamic = 'force-dynamic';

type TallyField = {
  label?: string;
  key?: string;
  type?: string;
  value?: unknown;
};

type TallySubmission = {
  id?: string;
  submissionId?: string;
  responseId?: string;
  createdAt?: string;
  fields?: TallyField[];
};

type Participant = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
};

function fieldText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.map(fieldText).filter(Boolean).join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return fieldText(obj.text ?? obj.label ?? obj.value ?? '');
  }
  return String(value);
}

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[\s\u200c_-]+/g, '')
    .replace(/[‌:：؟?()]/g, '');
}

function getField(
  fields: TallyField[],
  patterns: RegExp[],
): string {
  const found = fields.find((field) => {
    const label = normalizeLabel(field.label || '');
    return patterns.some((pattern) => pattern.test(label));
  });

  return found ? fieldText(found.value) : '';
}

function mapSubmission(
  submission: TallySubmission,
  index: number,
): Participant {
  const fields = submission.fields || [];

  const fullName =
    getField(fields, [
      /نامو.*نامخانوادگی/,
      /نامخانوادگی/,
      /نامکامل/,
      /^نام$/,
      /fullname/,
      /full_name/,
      /name/,
    ]) || 'نام ثبت نشده';

  const phone = getField(fields, [
    /شمارهتماس/,
    /شمارهتلفن/,
    /تلفنهمراه/,
    /موبایل/,
    /تلفن/,
    /phone/,
    /mobile/,
  ]);

  const email = getField(fields, [/ایمیل/, /email/, /e-mail/]);

  return {
    id: String(
      submission.id ||
      submission.submissionId ||
      submission.responseId ||
      `tally-${index}`,
    ),
    full_name: fullName,
    phone,
    email,
    created_at: submission.createdAt || '',
  };
}

async function getTallyParticipants(): Promise<{
  participants: Participant[];
  error: string | null;
}> {
  const apiKey = process.env.TALLY_API_KEY;
  const formId = process.env.TALLY_FORM_ID || 'Zjpy2z';

  if (!apiKey) {
    return {
      participants: [],
      error: 'کلید API تالی در تنظیمات سرور تعریف نشده است.',
    };
  }

  const participants: Participant[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (true) {
      const url = new URL(
        `https://api.tally.so/forms/${encodeURIComponent(formId)}/submissions`,
      );
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'tally-version': '2025-02-01',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(
          'Tally API error:',
          response.status,
          await response.text(),
        );

        if (response.status === 401 || response.status === 403) {
          return {
            participants: [],
            error: 'دسترسی به Tally تأیید نشد؛ API Key را بررسی کن.',
          };
        }

        if (response.status === 404) {
          return {
            participants: [],
            error:
              'فرم در Tally پیدا نشد؛ شناسه TALLY_FORM_ID را بررسی کن.',
          };
        }

        return {
          participants: [],
          error: 'دریافت ثبت‌نام‌ها از Tally ناموفق بود.',
        };
      }

      const result = await response.json();

      const items: TallySubmission[] = Array.isArray(result)
        ? result
        : result.items ||
          result.submissions ||
          result.data ||
          [];

      participants.push(
        ...items.map((item, index) =>
          mapSubmission(item, participants.length + index),
        ),
      );

      const hasMore = Boolean(result.hasMore);

      if (!hasMore || items.length === 0) break;

      page += 1;

      // جلوگیری از حلقه بی‌نهایت در صورت پاسخ غیرمنتظره API
      if (page > 1000) break;
    }

    return { participants, error: null };
  } catch (error) {
    console.error('Unable to fetch Tally submissions:', error);
    return {
      participants: [],
      error: 'ارتباط با Tally برقرار نشد؛ بعداً دوباره تلاش کن.',
    };
  }
}

export default async function RefereeParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const authenticated = await isRefereeAuthenticated();

  if (!authenticated) {
    redirect('/referee/login');
  }

  const supabase = createServerClient();

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', params.id)
    .eq('referee_enabled', true)
    .single();

  if (!tournament) notFound();

  const { participants, error } = await getTallyParticipants();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100">
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-bold">پنل داور</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/referee"
          className="inline-flex items-center gap-2 text-turquoise-600 hover:text-turquoise-700 mb-6 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به مسابقات
        </Link>

        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy-800">
                {tournament.title}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                <Users className="w-4 h-4" />
                {participants.length} شرکت‌کننده از Tally
              </div>
            </div>

            {tournament.referee_file_url && (
              <a
                href={tournament.referee_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                دانلود فایل Excel
              </a>
            )}
          </div>
        </div>

        {error ? (
          <div className="card p-6 text-center text-red-700">
            {error}
          </div>
        ) : (
          <ParticipantsTable participants={participants} />
        )}
      </main>
    </div>
  );
}
