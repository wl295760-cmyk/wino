import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants/business';

export const metadata: Metadata = {
  title: '오시는 길',
  description: '위노뷰티 청주 매장 위치 · 영업시간 · 연락처 안내.',
};

export default function ContactPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-medium tracking-brand text-ink-primary">
          오시는 길
        </h1>
        <div className="mx-auto my-6 h-px w-28 bg-ink-primary" />
      </header>

      <div className="grid gap-10 md:grid-cols-5 md:items-start">
        <div className="md:col-span-3">
          <div className="aspect-[4/3] rounded-card bg-[#e8dcd1] flex items-center justify-center text-ink-secondary">
            <div className="text-center px-6">
              <div className="text-3xl mb-3" aria-hidden="true">📍</div>
              <div>카카오맵 / 네이버지도 연동 예정</div>
              <div className="mt-2 text-xs">(NEXT_PUBLIC_KAKAO_MAP_KEY 설정 필요)</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm tracking-caption text-ink-secondary">주소</h2>
            <p className="mt-1 text-base text-ink-primary">{BUSINESS.address}</p>
          </div>
          <div>
            <h2 className="text-sm tracking-caption text-ink-secondary">전화</h2>
            <a
              href={BUSINESS.phoneTel}
              className="mt-1 inline-block text-xl font-medium text-ink-primary tabular-nums underline underline-offset-4"
            >
              {BUSINESS.phone}
            </a>
          </div>
          <div>
            <h2 className="text-sm tracking-caption text-ink-secondary">영업시간</h2>
            <ul className="mt-1 space-y-1 text-base text-ink-primary">
              {BUSINESS.hours.map((h) => (
                <li key={h.day}>
                  <span className="inline-block w-12 text-ink-secondary">{h.day}</span>
                  {h.time}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <ButtonLink href={BUSINESS.phoneTel} size="sm">
              전화걸기
            </ButtonLink>
            <ButtonLink href={BUSINESS.kakaoChannel} variant="outline" size="sm">
              카카오톡 친구추가
            </ButtonLink>
            <ButtonLink href="/booking" variant="outline" size="sm">
              예약하기
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
