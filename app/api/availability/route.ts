import { NextRequest } from 'next/server';
import { ok, fail, handleError, HTTP } from '@/lib/api';
import { availabilityQuerySchema } from '@/lib/schemas';
import { getAvailableSlots } from '@/lib/availability';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const parsed = availabilityQuerySchema.parse({
      serviceId: req.nextUrl.searchParams.get('serviceId'),
      date: req.nextUrl.searchParams.get('date'),
    });
    const result = await getAvailableSlots(parsed.serviceId, parsed.date);
    if (!result) {
      return fail({ code: 'NOT_FOUND', message: '서비스를 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    return ok(result);
  } catch (err) {
    return handleError(err);
  }
}
