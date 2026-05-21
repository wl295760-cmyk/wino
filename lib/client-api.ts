import servicesData from '@/data/services.json';

export type ServiceDTO = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory: 'EXTENSION' | 'PERM' | 'REMOVAL';
  priceKrw: number;
  durationMinutes: number;
  description: string;
};

export type ServiceOptionDTO = {
  id: string;
  name: string;
  priceKrw: number;
  appliesTo: 'EXTENSION' | 'PERM' | 'REMOVAL';
};

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export async function fetchServices(): Promise<{
  services: ServiceDTO[];
  options: ServiceOptionDTO[];
  categoryNotes: Record<string, string>;
}> {
  // Phase 2: mock 데이터. Phase 4에 GET /api/services 호출로 교체
  return Promise.resolve(servicesData as never);
}

export type CreateBookingPayload = {
  serviceId: string;
  startAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    marketingOk: boolean;
  };
  consents: {
    privacy: boolean;
    marketing: boolean;
  };
  notes?: string;
};

export type CreateBookingResult = {
  shortCode: string;
  startAt: string;
  estimatedTotalKrw: number;
};

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<ApiResponse<CreateBookingResult>> {
  // Phase 2: mock 응답. Phase 4에 POST /api/reservations 호출로 교체
  await new Promise((r) => setTimeout(r, 600));
  const code = Array.from({ length: 8 }, () =>
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.charAt(Math.floor(Math.random() * 32)),
  ).join('');
  const service = (servicesData as { services: ServiceDTO[] }).services.find(
    (s) => s.id === payload.serviceId,
  );
  return {
    ok: true,
    data: {
      shortCode: code,
      startAt: payload.startAt,
      estimatedTotalKrw: service?.priceKrw ?? 0,
    },
  };
}
