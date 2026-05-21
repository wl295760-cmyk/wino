import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ok,
  fail,
  handleError,
  HTTP,
  normalizePhone,
  generateShortCode,
} from '@/lib/api';
import { createBookingSchema, lookupSchema } from '@/lib/schemas';
import { isSlotAvailable } from '@/lib/availability';
// 이메일 알림은 Phase 3로 연기 (team-lead 결정 2026-05-19)

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = createBookingSchema.parse(body);

    const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
    if (!service || !service.isActive) {
      return fail({ code: 'NOT_FOUND', message: '서비스를 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }

    const startAt = new Date(input.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMinutes * 60_000);
    const phoneE164 = normalizePhone(input.customer.phone);

    const result = await prisma.$transaction(async (tx) => {
      const available = await isSlotAvailable(service.id, startAt, service.durationMinutes);
      if (!available) return { conflict: true as const };

      const customer = await tx.customer.upsert({
        where: { phone: phoneE164 },
        create: {
          name: input.customer.name,
          phone: phoneE164,
          email: input.customer.email,
          marketingOk: input.customer.marketingOk,
        },
        update: {
          name: input.customer.name,
          email: input.customer.email,
          marketingOk: input.customer.marketingOk,
        },
      });

      // shortCode 충돌 시 재시도
      let shortCode = generateShortCode();
      for (let i = 0; i < 5; i++) {
        const existing = await tx.reservation.findUnique({ where: { shortCode } });
        if (!existing) break;
        shortCode = generateShortCode();
      }

      const reservation = await tx.reservation.create({
        data: {
          shortCode,
          customerId: customer.id,
          serviceId: service.id,
          startAt,
          endAt,
          notes: input.notes,
          status: 'PENDING',
        },
        include: { service: { select: { name: true, priceKrw: true } } },
      });

      await tx.auditLog.create({
        data: {
          entityType: 'Reservation',
          entityId: reservation.id,
          action: 'CREATE',
          actorType: 'CUSTOMER',
          actorId: customer.id,
          changes: { startAt: startAt.toISOString(), serviceId: service.id },
        },
      });

      return { conflict: false as const, reservation, customer };
    });

    if (result.conflict) {
      return fail(
        { code: 'SLOT_UNAVAILABLE', message: '선택하신 시간은 이미 예약되었습니다.' },
        HTTP.SLOT_UNAVAILABLE,
      );
    }

    const { reservation } = result;

    return ok(
      {
        booking: {
          id: reservation.id,
          shortCode: reservation.shortCode,
          status: reservation.status,
          startAt: reservation.startAt.toISOString(),
          endAt: reservation.endAt.toISOString(),
          service: reservation.service,
        },
      },
      201,
    );
  } catch (err) {
    return handleError(err);
  }
}

// 예약 조회 — GET /api/bookings?phone=...&code=...
export async function GET(req: NextRequest) {
  try {
    const input = lookupSchema.parse({
      phone: req.nextUrl.searchParams.get('phone'),
      code: req.nextUrl.searchParams.get('code'),
    });
    const phoneE164 = normalizePhone(input.phone);
    const reservation = await prisma.reservation.findFirst({
      where: { shortCode: input.code, customer: { phone: phoneE164 } },
      include: {
        service: { select: { name: true, durationMinutes: true, priceKrw: true } },
        customer: { select: { name: true, phone: true, email: true } },
      },
    });
    if (!reservation) {
      return fail({ code: 'NOT_FOUND', message: '예약을 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    return ok({ booking: reservation });
  } catch (err) {
    return handleError(err);
  }
}
