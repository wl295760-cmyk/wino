import Link from 'next/link';
import { LogoFrame } from '@/components/brand/LogoFrame';
import { Tagline } from '@/components/brand/Tagline';
import { ButtonLink } from '@/components/ui/Button';
import { fetchServices } from '@/lib/client-api';
import { formatPriceKrw } from '@/lib/utils/format';
import { BUSINESS } from '@/lib/constants/business';

export const revalidate = 3600;

export default async function HomePage() {
  const { services } = await fetchServices();
  const featured = [
    services.find((s) => s.id === 'ext-volume'),
    services.find((s) => s.id === 'perm-signature'),
    services.find((s) => s.id === 'ext-double'),
  ].filter(Boolean) as typeof services;

  return (
    <>
      <section className="container-page py-16 md:py-24">
        <LogoFrame size="lg" />
        <Tagline className="mt-12" />
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/booking" size="lg">
            예약하기
          </ButtonLink>
        </div>
      </section>

      <section className="container-page py-20 bg-bg-warm rounded-card">
        <header className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-ink-primary">
            시그니처 메뉴
          </h2>
          <p className="mt-3 text-sm tracking-wide text-ink-secondary">
            정직한 시술, 한결같은 마무리
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((s) => (
            <article
              key={s.id}
              className="rounded-card-inner bg-bg-surface border border-border-soft p-6 transition hover:shadow-card"
            >
              <div className="text-xs tracking-caption text-ink-secondary">
                {s.subCategory === 'PERM' ? '펌' : '연장'}
              </div>
              <h3 className="mt-2 text-xl font-medium text-ink-primary">{s.name}</h3>
              <p className="mt-2 text-sm text-ink-secondary line-clamp-2">{s.description}</p>
              <div className="mt-6 flex items-end justify-between">
                <span className="text-2xl font-medium text-ink-primary">
                  {formatPriceKrw(s.priceKrw)}
                  <span className="text-sm font-normal ml-1">원</span>
                </span>
                <span className="text-xs text-ink-secondary">약 {s.durationMinutes}분</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="text-sm tracking-wide text-ink-primary underline underline-offset-4 hover:text-accent-gold">
            전체 메뉴 보기 →
          </Link>
        </div>
      </section>

      <section className="container-page py-20">
        <header className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-ink-primary">
            갤러리
          </h2>
          <p className="mt-3 text-sm tracking-wide text-ink-secondary">
            한 분 한 분의 결을 살리는 작업
          </p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl"
              style={{ backgroundColor: `hsl(${30 + i * 4}, 25%, ${85 - i * 2}%)` }}
              aria-label={`갤러리 미리보기 ${i}`}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/gallery" className="text-sm tracking-wide text-ink-primary underline underline-offset-4 hover:text-accent-gold">
            갤러리 더보기 →
          </Link>
        </div>
      </section>

      <section className="container-page py-20 bg-bg-warm rounded-card">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-ink-primary">
              오시는 길
            </h2>
            <address className="mt-6 not-italic space-y-3 text-ink-primary">
              <div>📍 {BUSINESS.address}</div>
              <div>
                ☎{' '}
                <a href={BUSINESS.phoneTel} className="underline underline-offset-4">
                  {BUSINESS.phone}
                </a>
              </div>
              <div>
                🕐{' '}
                {BUSINESS.hours.map((h, i) => (
                  <span key={h.day}>
                    {i > 0 && ' · '}
                    {h.day} {h.time}
                  </span>
                ))}
              </div>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="outline" size="sm">
                길찾기
              </ButtonLink>
              <ButtonLink href={BUSINESS.phoneTel} variant="outline" size="sm">
                전화걸기
              </ButtonLink>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-card bg-[#e8dcd1] flex items-center justify-center text-ink-secondary">
            <span>지도 영역 (카카오맵 연동 예정)</span>
          </div>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <div className="text-2xl opacity-50">🌿</div>
        <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-wide text-ink-primary">
          지금 예약하세요
        </h2>
        <p className="mt-4 text-ink-secondary">원하시는 시간에 편하게 방문하실 수 있도록 도와드릴게요.</p>
        <div className="mt-10">
          <ButtonLink href="/booking" size="lg">
            예약 페이지로
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
