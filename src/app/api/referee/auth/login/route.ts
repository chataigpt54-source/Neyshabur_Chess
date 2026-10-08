import { NextRequest, NextResponse } from 'next/server';
import {
  verifyRefereeCredentials,
  createRefereeSession,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'نام کاربری و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    const valid = verifyRefereeCredentials(username, password);

    if (!valid) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    await createRefereeSession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
