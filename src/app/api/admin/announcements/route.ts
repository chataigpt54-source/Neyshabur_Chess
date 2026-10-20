
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedDurations = [6, 12, 24, 72, 168, 336, 720];

type AnnouncementValues = {
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  published_at: string;
  expires_at: string;
  updated_at: string;
};

type ValidationResult =
  | { values: AnnouncementValues }
  | { error: string };

async function authorized(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function validateInput(
  body: Record<string, unknown>
): ValidationResult {
  const title =
    typeof body.title === 'string' ? body.title.trim() : '';

  const content =
    typeof body.content === 'string' ? body.content.trim() : '';

  const imageUrl =
    typeof body.image_url === 'string'
      ? body.image_url.trim()
      : '';

  const duration = Number(body.duration_hours);

  if (!title || title.length > 200) {
    return {
      error: 'عنوان الزامی است و باید حداکثر ۲۰۰ کاراکتر باشد.',
    };
  }

  if (content.length > 10000) {
    return {
      error: 'متن اطلاعیه نباید بیشتر از ۱۰۰۰۰ کاراکتر باشد.',
    };
  }

  if (!allowedDurations.includes(duration)) {
    return {
      error: 'مدت اعتبار انتخاب‌شده معتبر نیست.',
    };
  }

  if (imageUrl) {
    try {
      const url = new URL(imageUrl);

      if (
        url.protocol !== 'https:' &&
        url.protocol !== 'http:'
      ) {
        return {
          error: 'آدرس عکس باید با HTTP یا HTTPS شروع شود.',
        };
      }
    } catch {
      return { error: 'آدرس عکس معتبر نیست.' };
    }
  }

  const now = new Date();

  return {
    values: {
      title,
      content,
      image_url: imageUrl || null,
      published: body.published === true,
      published_at: now.toISOString(),
      expires_at: new Date(
        now.getTime() + duration * 60 * 60 * 1000
      ).toISOString(),
      updated_at: now.toISOString(),
    },
  };
}

async function readBody(
  req: NextRequest
): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await req.json();

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

// دریافت اطلاعیه‌ها برای پنل مدیریت
export async function GET() {
  if (!(await authorized())) {
    return jsonError('دسترسی غیرمجاز است. دوباره وارد شوید.', 401);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Announcements GET]', error);
      return jsonError('دریافت اطلاعیه‌ها ناموفق بود.', 500);
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error('[Announcements GET]', error);
    return jsonError('خطای داخلی هنگام دریافت اطلاعیه‌ها.', 500);
  }
}

// ایجاد اطلاعیه
export async function POST(req: NextRequest) {
  if (!(await authorized())) {
    return jsonError('دسترسی غیرمجاز است. دوباره وارد شوید.', 401);
  }

  const body = await readBody(req);

  if (!body) {
    return jsonError('اطلاعات ارسالی معتبر نیست.', 400);
  }

  const validated = validateInput(body);

  if ('error' in validated) {
    return jsonError(validated.error, 400);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert(validated.values)
      .select('*')
      .single();

    if (error) {
      console.error('[Announcements POST]', error);
      return jsonError('ذخیره اطلاعیه در پایگاه داده ناموفق بود.', 500);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[Announcements POST]', error);
    return jsonError('خطای داخلی هنگام ذخیره اطلاعیه.', 500);
  }
}

// ویرایش اطلاعیه
export async function PATCH(req: NextRequest) {
  if (!(await authorized())) {
    return jsonError('دسترسی غیرمجاز است. دوباره وارد شوید.', 401);
  }

  const body = await readBody(req);

  if (!body) {
    return jsonError('اطلاعات ارسالی معتبر نیست.', 400);
  }

  if (
    typeof body.id !== 'string' ||
    !body.id.trim()
  ) {
    return jsonError('شناسه اطلاعیه معتبر نیست.', 400);
  }

  const validated = validateInput(body);

  if ('error' in validated) {
    return jsonError(validated.error, 400);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .update(validated.values)
      .eq('id', body.id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[Announcements PATCH]', error);
      return jsonError('ویرایش اطلاعیه ناموفق بود.', 500);
    }

    if (!data) {
      return jsonError('اطلاعیه موردنظر پیدا نشد.', 404);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Announcements PATCH]', error);
    return jsonError('خطای داخلی هنگام ویرایش اطلاعیه.', 500);
  }
}

// حذف اطلاعیه
export async function DELETE(req: NextRequest) {
  if (!(await authorized())) {
    return jsonError('دسترسی غیرمجاز است. دوباره وارد شوید.', 401);
  }

  const body = await readBody(req);

  if (
    !body ||
    typeof body.id !== 'string' ||
    !body.id.trim()
  ) {
    return jsonError('شناسه اطلاعیه معتبر نیست.', 400);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', body.id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[Announcements DELETE]', error);
      return jsonError('حذف اطلاعیه ناموفق بود.', 500);
    }

    if (!data) {
      return jsonError('اطلاعیه موردنظر پیدا نشد.', 404);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Announcements DELETE]', error);
    return jsonError('خطای داخلی هنگام حذف اطلاعیه.', 500);
  }
}
