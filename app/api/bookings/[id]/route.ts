import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, fail, handleError, HTTP, normalizePhone } from '@/lib/api';
import { cancelBookingSchema, patchBookingSchema } from '@/lib/schemas';
import { isSlotAvailable } from '@/lib/availability';

export const dynamic = 'force-dynamic';

const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;

async function findOwnedBooking(idOrCode: string, phoneE164: string) {
  return prisma.reservation.findFirst({
    where: {
      OR: [{ id: idOrCode }, { shortCode: idOrCode }],
      customer: { phone: phoneE164 },
    },
    include: { service: true, customer: true },
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const phoneRaw = req.nextUrl.searchParams.get('phone');
    if (!phoneRaw) {
      return fail({ code: 'UNAUTHORIZED', message: '전화번호가 필요합니다.' }, HTTP.UNAUTHORIZED);
    }
    const phoneE164 = normalizePhone(phoneRaw);
    const booking = await findOwnedBooking(params.id, phoneE164);
    if (!booking) {
      return fail({ code: 'NOT_FOUND', message: '예약을 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    return ok({ booking });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const input = patchBookingSchema.parse(body);
    const phoneE164 = normalizePhone(input.phone);

    const existing = await findOwnedBooking(params.id, phoneE164);
    if (!existing) {
      return fail({ code: 'NOT_FOUND', message: '예약을 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    if (existing.status !== 'PENDING') {
      return fail(
        { code: 'FORBIDDEN', message: '확정된 예약은 직접 변경할 수 없습니다. 매장으로 문의해 주세요.' },
        HTTP.FORBIDDEN,
      );
    }
    if (existing.startAt.getTime() - Date.now() < CANCEL_WINDOW_MS) {
      return fail(
        { code: 'BOOKING_NOT_CANCELLABLE', message: '시작 24시간 전에는 변경이 불가합니다.' },
        HTTP.BOOKING_NOT_CANCELLABLE,
      );
    }

    let newStartAt = existing.startAt;
    let newEndAt = existing.endAt;
    if (input.startAt) {
      newStartAt = new Date(input.startAt);
      newEndAt = new Date(newStartAt.getTime() + existing.service.durationMinutes * 60_000);
      const available = await isSlotAvailable(
        existing.serviceId,
        newStartAt,
        existing.service.durationMinutes,
      );
      if (!available) {
        return fail(
          { code: 'SLOT_UNAVAILABLE', message: '선택하신 시간은 이미 예약되었습니다.' },
          HTTP.SLOT_UNAVAILABLE,
        );
      }
    }

    const updated = await prisma.reservation.update({
      where: { id: existing.id },
      data: {
        startAt: newStartAt,
        endAt: newEndAt,
        notes: input.notes ?? existing.notes,
      },
    });
    await prisma.auditLog.create({
      data: {
        entityType: 'Reservation',
        entityId: updated.id,
        action: 'UPDATE',
        actorType: 'CUSTOMER',
        actorId: existing.customerId,
        changes: { startAt: newStartAt.toISOString(), notes: input.notes },
      },
    });
    return ok({ booking: updated });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const input = cancelBookingSchema.parse(body);
    const phoneE164 = normalizePhone(input.phone);

    const existing = await findOwnedBooking(params.id, phoneE164);
    if (!existing) {
      return fail({ code: 'NOT_FOUND', message: '예약을 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
      return fail(
        { code: 'FORBIDDEN', message: '이미 취소되었거나 완료된 예약입니다.' },
        HTTP.FORBIDDEN,
      );
    }
    if (existing.startAt.getTime() - Date.now() < CANCEL_WINDOW_MS) {
      return fail(
        { code: 'BOOKING_NOT_CANCELLABLE', message: '시작 24시간 전에는 취소가 불가합니다. 매장으로 연락 주세요.' },
        HTTP.BOOKING_NOT_CANCELLABLE,
      );
    }

    const cancelled = await prisma.reservation.update({
      where: { id: existing.id },
      data: {
        status: 'CANCELLED',
        cancelReason: input.reason,
        cancelledAt: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        entityType: 'Reservation',
        entityId: cancelled.id,
        action: 'CANCEL',
        actorType: 'CUSTOMER',
        actorId: existing.customerId,
        changes: { reason: input.reason },
      },
    });
    return ok({ booking: { id: cancelled.id, status: cancelled.status } });
  } catch (err) {
    return handleError(err);
  }
}
