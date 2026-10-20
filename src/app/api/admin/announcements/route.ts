
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function authorize() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json(
      { error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin Announcements GET]', error);
    return NextResponse.json(
      { error: 'دریافت اطلاعیه‌ها ناموفق بود' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) {
    return NextResponse.json(
      { error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const title =
      typeof body.title === 'string' ? body.title.trim() : '';

    if (!title || title.length > 200) {
      return NextResponse.json(
        { error: 'عنوان الزامی است و نباید بیشتر از ۲۰۰ کاراکتر باشد' },
        { status: 400 }
      );
    }

    const now = new Date();
    const duration = Number(body.duration_hours);

    if (
      !Number.isFinite(duration) ||
      ![6, 12, 24, 72, 168, 336, 720].includes(duration)
    ) {
      return NextResponse.json(
        { error: 'مدت اعتبار نامعتبر است' },
        { status: 400 }
      );
    }

    const imageUrl =
      typeof body.image_url === 'string'
        ? body.image_url.trim()
        : '';

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('invalid protocol');
        }
      } catch {
        return NextResponse.json(
          { error: 'آدرس عکس نامعتبر است' },
          { status: 400 }
        );
      }
    }

    const content =
      typeof body.content === 'string' ? body.content.trim() : '';

    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'متن اطلاعیه بیش از حد طولانی است' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        title,
        content,
        image_url: imageUrl || null,
        published: body.published === true,
        published_at: now.toISOString(),
        expires_at: new Date(
          now.getTime() + duration * 3600000
        ).toISOString(),
        updated_at: now.toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('[Admin Announcements POST]', error);
      return NextResponse.json(
        { error: 'ذخیره اطلاعیه ناموفق بود' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[Admin Announcements POST]', error);
    return NextResponse.json(
      { error: 'درخواست نامعتبر است' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await authorize())) {
    return NextResponse.json(
      { error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    if (typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json(
        { error: 'شناسه اطلاعیه الزامی است' },
        { status: 400 }
      );
    }

    const title =
      typeof body.title === 'string' ? body.title.trim() : '';

    if (!title || title.length > 200) {
      return NextResponse.json(
        { error: 'عنوان نامعتبر است' },
        { status: 400 }
      );
    }

    const duration = Number(body.duration_hours);

    if (
      !Number.isFinite(duration) ||
      ![6, 12, 24, 72, 168, 336, 720].includes(duration)
    ) {
      return NextResponse.json(
        { error: 'مدت اعتبار نامعتبر است' },
        { status: 400 }
      );
    }

    const content =
      typeof body.content === 'string' ? body.content.trim() : '';

    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'متن اطلاعیه بیش از حد طولانی است' },
        { status: 400 }
      );
    }

    const imageUrl =
      typeof body.image_url === 'string'
        ? body.image_url.trim()
        : '';

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error('invalid protocol');
        }
      } catch {
        return NextResponse.json(
          { error: 'آدرس عکس نامعتبر است' },
          { status: 400 }
        );
      }
    }

    const now = new Date();

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .update({
        title,
        content,
        image_url: imageUrl || null,
        published: body.published === true,
        published_at: now.toISOString(),
        expires_at: new Date(
          now.getTime() + duration * 3600000
        ).toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', body.id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[Admin Announcements PATCH]', error);
      return NextResponse.json(
        { error: 'ویرایش اطلاعیه ناموفق بود' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'اطلاعیه پیدا نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Admin Announcements PATCH]', error);
    return NextResponse.json(
      { error: 'درخواست نامعتبر است' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await authorize())) {
    return NextResponse.json(
      { error: 'دسترسی غیرمجاز' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    if (typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json(
        { error: 'شناسه اطلاعیه الزامی است' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', body.id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[Admin Announcements DELETE]', error);
      return NextResponse.json(
        { error: 'حذف اطلاعیه ناموفق بود' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'اطلاعیه پیدا نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin Announcements DELETE]', error);
    return NextResponse.json(
      { error: 'درخواست نامعتبر است' },
      { status: 400 }
    );
  }
}
