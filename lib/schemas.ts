import { z } from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 휴대전화 번호를 입력하세요.');

export const nameSchema = z
  .string()
  .min(2, '이름은 2자 이상이어야 합니다.')
  .max(30, '이름은 30자를 초과할 수 없습니다.');

export const emailSchema = z.string().email('올바른 이메일을 입력하세요.');

export const customerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  marketingOk: z.boolean().default(false),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  startAt: z
    .string()
    .datetime()
    .refine((d) => new Date(d).getTime() > Date.now(), '예약 시각은 미래여야 합니다.'),
  customer: customerSchema,
  notes: z.string().max(500).optional(),
});

export const cancelBookingSchema = z.object({
  phone: phoneSchema,
  reason: z.string().max(500).optional(),
});

export const lookupSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(8),
});

export const availabilityQuerySchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다.'),
});

export const patchBookingSchema = z.object({
  phone: phoneSchema,
  startAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});
