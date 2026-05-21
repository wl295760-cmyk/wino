import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, handleError } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category') ?? undefined;
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category as any } : {}),
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        durationMinutes: true,
        priceKrw: true,
        imageUrl: true,
      },
    });
    return ok({ services });
  } catch (err) {
    return handleError(err);
  }
}
