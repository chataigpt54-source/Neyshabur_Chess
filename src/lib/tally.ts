
export type TallyParticipant = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
  answers: Record<string, string>;
};

type RawField = {
  label?: string;
  key?: string;
  type?: string;
  value?: unknown;
  answer?: unknown;
  question?: string | { label?: string; title?: string };
  title?: string;
};

type RawSubmission = {
  id?: string;
  submissionId?: string;
  responseId?: string;
  createdAt?: string;
  fields?: RawField[];
  responses?: RawField[];
  data?: {
    fields?: RawField[];
    responses?: RawField[];
    createdAt?: string;
    submissionId?: string;
    responseId?: string;
  };
};

function valueToString(value: unknown): string {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value.map(valueToString).filter(Boolean).join('، ');
  }

  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return valueToString(
      item.text ??
        item.label ??
        item.name ??
        item.value ??
        item.url ??
        '',
    );
  }

  return String(value).trim();
}

export function normalizeTallyLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ي]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[\s\u200c_-]+/g, '')
    .replace(/[‌:：؟?()]/g, '');
}

function getLabel(field: RawField): string {
  if (typeof field.question === 'object' && field.question) {
    return (
      field.label ??
      field.question.label ??
      field.question.title ??
      field.title ??
      field.key ??
      ''
    );
  }

  return (
    field.label ??
    (typeof field.question === 'string' ? field.question : '') ??
    field.title ??
    field.key ??
    ''
  );
}

function getFields(submission: RawSubmission): RawField[] {
  return (
    submission.fields ??
    submission.responses ??
    submission.data?.fields ??
    submission.data?.responses ??
    []
  );
}

function findAnswer(
  answers: Record<string, string>,
  patterns: RegExp[],
): string {
  const entry = Object.entries(answers).find(([label]) => {
    const normalized = normalizeTallyLabel(label);
    return patterns.some((pattern) => pattern.test(normalized));
  });

  return entry?.[1] ?? '';
}

function normalizeSubmission(
  submission: RawSubmission,
  index: number,
): TallyParticipant {
  const answers: Record<string, string> = {};

  for (const field of getFields(submission)) {
    const label = getLabel(field).trim();
    const value = valueToString(field.value ?? field.answer);

    if (label) {
      answers[label] = value;
    }
  }

  const fullName =
    findAnswer(answers, [
      /نام.*نامخانوادگی/,
      /نامخانوادگی/,
      /نامکامل/,
      /^نام$/,
      /fullname/,
      /^name$/,
      /first.*name/,
    ]) ||
    [
      findAnswer(answers, [/^نام$/, /firstname/]),
      findAnswer(answers, [/نامخانوادگی/, /lastname/, /surname/]),
    ]
      .filter(Boolean)
      .join(' ');

  return {
    id: String(
      submission.id ??
        submission.submissionId ??
        submission.responseId ??
        submission.data?.submissionId ??
        submission.data?.responseId ??
        `tally-${index}`,
    ),
    full_name: fullName || 'نام ثبت نشده',
    phone: findAnswer(answers, [
      /شمارهتماس/,
      /شمارهتلفن/,
      /تلفنهمراه/,
      /موبایل/,
      /تلفن/,
      /phone/,
      /mobile/,
    ]),
    email: findAnswer(answers, [/ایمیل/, /email/, /e-mail/]),
    created_at:
      submission.createdAt ?? submission.data?.createdAt ?? '',
    answers,
  };
}

export async function getTallyParticipants(): Promise<TallyParticipant[]> {
  const apiKey = process.env.TALLY_API_KEY;
  const formId = process.env.TALLY_FORM_ID;

  if (!apiKey) {
    throw new Error('متغیر TALLY_API_KEY در تنظیمات سرور تعریف نشده است.');
  }

  if (!formId) {
    throw new Error('متغیر TALLY_FORM_ID در تنظیمات سرور تعریف نشده است.');
  }

  const participants: TallyParticipant[] = [];
  let page = 1;
  const limit = 100;

  while (page <= 1000) {
    const url = new URL(
      `https://api.tally.so/forms/${encodeURIComponent(formId)}/submissions`,
    );

    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'tally-version': '2025-02-01',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Tally API response:', response.status, body);

      if (response.status === 401 || response.status === 403) {
        throw new Error('دسترسی Tally رد شد؛ API Key را بررسی کن.');
      }

      if (response.status === 404) {
        throw new Error(
          'فرم در Tally پیدا نشد؛ شناسه فرم را بررسی کن.',
        );
      }

      throw new Error(`Tally خطای ${response.status} برگرداند.`);
    }

    const result = await response.json();

    const items: RawSubmission[] = Array.isArray(result)
      ? result
      : result.submissions ??
        result.items ??
        result.data?.submissions ??
        result.data?.items ??
        result.data ??
        [];

    if (!Array.isArray(items) || items.length === 0) break;

    participants.push(
      ...items.map((item, index) =>
        normalizeSubmission(item, participants.length + index),
      ),
    );

    const hasMore =
      result.hasMore ??
      result.has_more ??
      result.meta?.hasMore ??
      result.pagination?.hasMore ??
      false;

    if (!hasMore || items.length < limit) break;

    page += 1;
  }

  return participants;
}
