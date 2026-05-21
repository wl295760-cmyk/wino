import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiError = {
  code:
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND'
    | 'SLOT_UNAVAILABLE'
    | 'BOOKING_NOT_CANCELLABLE'
    | 'RATE_LIMITED'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'INTERNAL_ERROR';
  message: string;
  details?: unknown;
};

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json({ ok: true, data }, { status });

export const fail = (error: ApiError, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

export const HTTP: Record<ApiError['code'], number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  SLOT_UNAVAILABLE: 409,
  BOOKING_NOT_CANCELLABLE: 409,
  RATE_LIMITED: 429,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_ERROR: 500,
};

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return fail(
      {
        code: 'VALIDATION_ERROR',
        message: '입력값이 올바르지 않습니다.',
        details: err.flatten(),
      },
      HTTP.VALIDATION_ERROR,
    );
  }
  console.error('[API ERROR]', err);
  return fail(
    { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' },
    HTTP.INTERNAL_ERROR,
  );
}

export function normalizePhone(input: string): string {
  // 010-1234-5678 → +821012345678
  const digits = input.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) return '+82' + digits.slice(1);
  if (digits.startsWith('82')) return '+' + digits;
  return digits;
}

export function maskPhone(phoneE164: string): string {
  // +821012345678 → 010-****-5678
  const local = phoneE164.replace(/^\+82/, '0');
  if (local.length < 8) return local;
  return `${local.slice(0, 3)}-****-${local.slice(-4)}`;
}

export function generateShortCode(): string {
  // 8자 영숫자 (사람이 읽기 쉽게 혼동 글자 제외: 0/O, 1/I)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
