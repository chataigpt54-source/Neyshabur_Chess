/**
 * Secure player session management for online tournaments.
 * Players do not create accounts; they receive a high-entropy token
 * that is stored only as a hash on the server.
 */

import { createHash, randomBytes } from 'crypto';

const TOKEN_BYTES = 32;

export function generateSessionToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function validateDisplayName(name: string): { ok: true; name: string } | { ok: false; error: string } {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  if (!cleaned) {
    return { ok: false, error: 'نام نمایشی نمی‌تواند خالی باشد' };
  }
  if (cleaned.length < 2) {
    return { ok: false, error: 'نام نمایشی باید حداقل ۲ کاراکتر باشد' };
  }
  if (cleaned.length > 32) {
    return { ok: false, error: 'نام نمایشی حداکثر ۳۲ کاراکتر مجاز است' };
  }
  // Allow Persian, English letters, numbers, spaces, common punctuation
  if (!/^[\u0600-\u06FFa-zA-Z0-9\s\-_.]+$/.test(cleaned)) {
    return { ok: false, error: 'نام نمایشی شامل کاراکترهای غیرمجاز است' };
  }
  return { ok: true, name: cleaned };
}

export function makeUniqueDisplayName(
  base: string,
  existing: string[]
): string {
  const set = new Set(existing.map((n) => n.toLowerCase()));
  if (!set.has(base.toLowerCase())) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `\( {base} ( \){i})`;
    if (!set.has(candidate.toLowerCase())) return candidate;
  }
  return `\( {base}- \){randomBytes(3).toString('hex')}`;
}
