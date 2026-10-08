import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createServerClient } from './supabase';

const ADMIN_COOKIE = 'chess_admin_session';
const SESSION_VALUE = 'authenticated_admin_neyshabur';

const REFEREE_COOKIE = 'chess_referee_session';
const REFEREE_SESSION_VALUE = 'authenticated_referee_neyshabur';

type AdminRow = {
  password_hash: string;
};

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // Prefer DB check
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('username', username)
      .maybeSingle();

    if (!error && data) {
      const admin = data as AdminRow;
      if (admin.password_hash) {
        return bcrypt.compareSync(password, admin.password_hash);
      }
    }
  } catch {
    // fallback to env if table empty or error
  }

  // Fallback to env vars (for first-time setup)
  const envUser = process.env.ADMIN_USERNAME || 'Admin';
  const envPass = process.env.ADMIN_PASSWORD || 'Mazda2933';
  return username === envUser && password === envPass;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  return session?.value === SESSION_VALUE;
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error('Unauthorized');
  }
  return true;
}

// ─── Referee Auth ───────────────────────────────────────────────

export function verifyRefereeCredentials(username: string, password: string): boolean {
  const refUser = process.env.REFEREE_USERNAME || 'Refree';
  const refPass = process.env.REFEREE_PASSWORD || 'NeyshaburRefree123';
  return username === refUser && password === refPass;
}

export async function createRefereeSession() {
  const cookieStore = await cookies();
  cookieStore.set(REFEREE_COOKIE, REFEREE_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function destroyRefereeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(REFEREE_COOKIE);
}

export async function isRefereeAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(REFEREE_COOKIE);
  return session?.value === REFEREE_SESSION_VALUE;
}

export async function requireReferee() {
  const ok = await isRefereeAuthenticated();
  if (!ok) {
    throw new Error('Unauthorized');
  }
  return true;
}
