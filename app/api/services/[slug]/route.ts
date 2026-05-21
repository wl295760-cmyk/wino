import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, fail, handleError, HTTP } from '@/lib/api';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        durationMinutes: true,
        priceKrw: true,
        imageUrl: true,
        isActive: true,
      },
    });
    if (!service || !service.isActive) {
      return fail({ code: 'NOT_FOUND', message: '서비스를 찾을 수 없습니다.' }, HTTP.NOT_FOUND);
    }
    return ok({ service });
  } catch (err) {
    return handleError(err);
  }
}
