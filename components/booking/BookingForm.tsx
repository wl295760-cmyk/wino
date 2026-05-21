'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validators/booking';
import {
  createBooking,
  type ServiceDTO,
  type ServiceOptionDTO,
} from '@/lib/client-api';
import { formatPhoneInput, formatPriceKrw } from '@/lib/utils/format';

type Props = {
  services: ServiceDTO[];
  options: ServiceOptionDTO[];
};

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
];

function tomorrowYmd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ services }: Props) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: services[0]?.id ?? '',
      date: tomorrowYmd(),
      time: '11:00',
      name: '',
      phone: '',
      email: '',
      notes: '',
      privacyConsent: false as unknown as true,
      marketingConsent: false,
    },
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [selectedServiceId, services],
  );

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    const startAt = new Date(`${values.date}T${values.time}:00+09:00`).toISOString();

    const res = await createBooking({
      serviceId: values.serviceId,
      startAt,
      customer: {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        marketingOk: values.marketingConsent,
      },
      consents: {
        privacy: values.privacyConsent,
        marketing: values.marketingConsent,
      },
      notes: values.notes || undefined,
    });

    if (!res.ok) {
      setSubmitError(res.error.message);
      return;
    }

    const params = new URLSearchParams({
      code: res.data.shortCode,
      service: selectedService?.name ?? '',
      time: `${values.date} ${values.time}`,
      total: String(res.data.estimatedTotalKrw),
    });
    router.push(`/booking/success?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-ink-primary mb-2">
          1. 서비스 선택
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.id}
              className={clsx(
                'flex items-center justify-between p-4 border rounded-card-inner cursor-pointer transition-colors',
                'has-[:checked]:border-ink-primary has-[:checked]:bg-bg-warm',
                'border-border-soft',
              )}
            >
              <span>
                <span className="block text-base text-ink-primary">{s.name}</span>
                <span className="block text-xs text-ink-secondary mt-0.5">
                  약 {s.durationMinutes}분
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-medium text-ink-primary tabular-nums">
                  {formatPriceKrw(s.priceKrw)}원
                </span>
                <input
                  type="radio"
                  value={s.id}
                  {...register('serviceId')}
                  className="sr-only"
                />
              </span>
            </label>
          ))}
        </div>
        {errors.serviceId && (
          <p className="text-sm text-feedback-error">{errors.serviceId.message}</p>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-ink-primary mb-2">
          2. 날짜 / 시간
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm text-ink-secondary mb-1">날짜</span>
            <input
              type="date"
              min={tomorrowYmd()}
              {...register('date')}
              className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none"
            />
            {errors.date && (
              <span className="block mt-1 text-sm text-feedback-error">
                {errors.date.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="block text-sm text-ink-secondary mb-1">시간</span>
            <select
              {...register('time')}
              className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.time && (
              <span className="block mt-1 text-sm text-feedback-error">
                {errors.time.message}
              </span>
            )}
          </label>
        </div>
        <p className="text-xs text-ink-secondary">
          * 실제 예약 가능 시간은 매장 확인 후 카카오톡으로 안내드립니다.
        </p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-ink-primary mb-2">
          3. 연락처
        </legend>

        <label className="block">
          <span className="block text-sm text-ink-secondary mb-1">이름</span>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none"
            placeholder="홍길동"
            autoComplete="name"
          />
          {errors.name && (
            <span className="block mt-1 text-sm text-feedback-error">
              {errors.name.message}
            </span>
          )}
        </label>

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <label className="block">
              <span className="block text-sm text-ink-secondary mb-1">전화번호</span>
              <input
                type="tel"
                inputMode="numeric"
                value={field.value}
                onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                onBlur={field.onBlur}
                className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none tabular-nums"
                placeholder="010-0000-0000"
                autoComplete="tel"
              />
              {errors.phone && (
                <span className="block mt-1 text-sm text-feedback-error">
                  {errors.phone.message}
                </span>
              )}
            </label>
          )}
        />

        <label className="block">
          <span className="block text-sm text-ink-secondary mb-1">이메일 (선택)</span>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none"
            placeholder="example@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <span className="block mt-1 text-sm text-feedback-error">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="block">
          <span className="block text-sm text-ink-secondary mb-1">요청사항 (선택)</span>
          <textarea
            rows={3}
            {...register('notes')}
            className="w-full p-3 border border-border-soft rounded-2xl bg-bg-surface focus:border-ink-primary outline-none resize-none"
            placeholder="처음 방문이에요"
          />
          {errors.notes && (
            <span className="block mt-1 text-sm text-feedback-error">
              {errors.notes.message}
            </span>
          )}
        </label>
      </fieldset>

      <fieldset className="space-y-3 p-5 bg-bg-warm rounded-card-inner">
        <legend className="text-lg font-medium text-ink-primary mb-2">
          4. 동의
        </legend>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('privacyConsent')}
            className="mt-1 h-4 w-4 accent-ink-primary"
          />
          <span className="text-sm text-ink-primary">
            <strong>(필수)</strong> 예약 처리를 위한 개인정보(이름, 연락처) 수집·이용에 동의합니다.
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="text-sm text-feedback-error pl-7">
            {errors.privacyConsent.message as string}
          </p>
        )}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('marketingConsent')}
            className="mt-1 h-4 w-4 accent-ink-primary"
          />
          <span className="text-sm text-ink-primary">
            (선택) 이벤트·할인 안내 마케팅 정보 수신에 동의합니다.
          </span>
        </label>
      </fieldset>

      {selectedService && (
        <div className="p-5 border border-border-soft rounded-card-inner bg-bg-surface">
          <div className="text-sm text-ink-secondary">예상 결제 금액</div>
          <div className="mt-1 text-2xl font-medium text-ink-primary tabular-nums">
            {formatPriceKrw(selectedService.priceKrw)}원
          </div>
          <div className="mt-1 text-xs text-ink-secondary">
            (실제 옵션 추가 시 금액이 달라질 수 있습니다.)
          </div>
        </div>
      )}

      {submitError && (
        <p className="text-sm text-feedback-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? '예약 요청 중...' : '예약 확정'}
        </Button>
      </div>
    </form>
  );
}
