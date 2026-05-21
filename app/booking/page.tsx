import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { fetchServices } from '@/lib/client-api';

export const metadata: Metadata = {
  title: '예약하기',
  description: '위노뷰티 청주 매장 온라인 예약.',
};

export default async function BookingPage() {
  const { services, options } = await fetchServices();

  return (
    <div className="container-content py-12 md:py-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-medium tracking-brand text-ink-primary">
          예약하기
        </h1>
        <div className="mx-auto my-6 h-px w-28 bg-ink-primary" />
        <p className="text-sm text-ink-secondary">
          원하시는 서비스와 시간을 선택해주세요.
        </p>
      </header>

      <BookingForm services={services} options={options} />
    </div>
  );
}
