import { z } from 'zod';

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, '서비스를 선택해주세요.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜를 선택해주세요.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, '시간을 선택해주세요.'),
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(30, '이름은 30자를 초과할 수 없습니다.'),
  phone: z
    .string()
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 휴대전화 번호를 입력하세요.'),
  email: z.string().email('올바른 이메일을 입력하세요.').optional().or(z.literal('')),
  notes: z.string().max(500, '500자 이내로 입력해주세요.').optional(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집·이용 동의가 필요합니다.' }),
  }),
  marketingConsent: z.boolean().default(false),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
