import { NextResponse } from 'next/server';
import { destroyRefereeSession } from '@/lib/auth';

export async function POST() {
  await destroyRefereeSession();

  return NextResponse.json({
    success: true,
  });
}
