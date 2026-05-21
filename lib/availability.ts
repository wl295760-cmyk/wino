import { prisma } from './prisma';

const SLOT_MINUTES = 30;
const KST_OFFSET_MIN = 9 * 60;

function kstDateToUtcRange(dateStr: string): { startUtc: Date; endUtc: Date } {
  // dateStr "YYYY-MM-DD" (KST) 의 [00:00, 24:00) → UTC 구간
  const [y, m, d] = dateStr.split('-').map(Number);
  const kstMidnight = Date.UTC(y, m - 1, d) - KST_OFFSET_MIN * 60_000;
  return {
    startUtc: new Date(kstMidnight),
    endUtc: new Date(kstMidnight + 24 * 60 * 60_000),
  };
}

function getKstDayOfWeek(utc: Date): number {
  const kst = new Date(utc.getTime() + KST_OFFSET_MIN * 60_000);
  return kst.getUTCDay();
}

function parseHHMM(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(':').map(Number);
  return { h, m };
}

export async function getAvailableSlots(serviceId: string, dateStr: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) return null;

  const { startUtc, endUtc } = kstDateToUtcRange(dateStr);

  const holiday = await prisma.holiday.findFirst({
    where: { date: { gte: startUtc, lt: endUtc } },
  });
  if (holiday) return { date: dateStr, slots: [] };

  const dow = getKstDayOfWeek(startUtc);
  const hours = await prisma.businessHour.findUnique({ where: { dayOfWeek: dow } });
  if (!hours || hours.isClosed) return { date: dateStr, slots: [] };

  const { h: openH, m: openM } = parseHHMM(hours.openTime);
  const { h: closeH, m: closeM } = parseHHMM(hours.closeTime);

  const dayStart = new Date(startUtc.getTime() + (openH * 60 + openM - KST_OFFSET_MIN) * 60_000 + KST_OFFSET_MIN * 60_000);
  const dayEnd = new Date(startUtc.getTime() + (closeH * 60 + closeM - KST_OFFSET_MIN) * 60_000 + KST_OFFSET_MIN * 60_000);

  // 기존 활성 예약
  const existing = await prisma.reservation.findMany({
    where: {
      startAt: { lt: endUtc },
      endAt: { gt: startUtc },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    select: { startAt: true, endAt: true },
  });

  const slots: { startAt: string; available: boolean }[] = [];
  const now = Date.now();
  for (
    let t = dayStart.getTime();
    t + service.durationMinutes * 60_000 <= dayEnd.getTime();
    t += SLOT_MINUTES * 60_000
  ) {
    const slotStart = t;
    const slotEnd = t + service.durationMinutes * 60_000;
    if (slotStart < now) continue;

    const conflict = existing.some(
      (r) => r.startAt.getTime() < slotEnd && r.endAt.getTime() > slotStart,
    );
    slots.push({
      startAt: new Date(slotStart).toISOString(),
      available: !conflict,
    });
  }

  return { date: dateStr, slots };
}

export async function isSlotAvailable(
  serviceId: string,
  startAt: Date,
  durationMinutes: number,
): Promise<boolean> {
  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

  // 영업시간/휴무 검증
  const dow = getKstDayOfWeek(startAt);
  const hours = await prisma.businessHour.findUnique({ where: { dayOfWeek: dow } });
  if (!hours || hours.isClosed) return false;

  const conflict = await prisma.reservation.findFirst({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    select: { id: true },
  });
  return !conflict;
}
