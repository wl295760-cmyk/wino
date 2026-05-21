import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { SectionCard } from '@/components/brand/SectionCard';
import { Tagline } from '@/components/brand/Tagline';
import { fetchServices, type ServiceDTO } from '@/lib/client-api';
import { formatPriceKrw } from '@/lib/utils/format';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '서비스 메뉴',
  description: '위노뷰티 연장 · 펌 시술 메뉴와 가격 안내.',
};

const SUB_LABEL: Record<ServiceDTO['subCategory'], string> = {
  EXTENSION: '연장',
  PERM: '펌',
  REMOVAL: '제거',
};

export default async function ServicesPage() {
  const { services, categoryNotes } = await fetchServices();

  const grouped: Record<ServiceDTO['subCategory'], ServiceDTO[]> = {
    EXTENSION: [],
    PERM: [],
    REMOVAL: [],
  };
  services.forEach((s) => grouped[s.subCategory].push(s));

  return (
    <div className="container-content py-12 md:py-20">
      <header className="text-center mb-10">
        <div className="text-sm tracking-caption text-ink-secondary">WITH NOA ✦ ✦ ✦</div>
        <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-brand text-ink-primary">
          서비스 메뉴
        </h1>
        <div className="mx-auto my-6 h-px w-28 bg-ink-primary" />
      </header>

      <div className="space-y-10">
        {(['EXTENSION', 'PERM', 'REMOVAL'] as const).map((sub) =>
          grouped[sub].length === 0 ? null : (
            <SectionCard key={sub}>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-medium text-ink-primary flex items-center gap-2">
                  {SUB_LABEL[sub]} <span className="text-lg" aria-hidden="true">🌾</span>
                </h2>
                {categoryNotes[sub] && (
                  <p className="mt-1 text-sm text-ink-secondary">({categoryNotes[sub]})</p>
                )}
              </div>
              <ul>
                {grouped[sub].map((s, idx) => (
                  <li
                    key={s.id}
                    className={`flex items-center justify-between py-3 ${
                      idx < grouped[sub].length - 1 ? 'menu-divider' : ''
                    }`}
                  >
                    <span className="text-base tracking-wide text-ink-primary">{s.name}</span>
                    <span className="text-base font-medium text-ink-primary tabular-nums">
                      {formatPriceKrw(s.priceKrw)}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ),
        )}
      </div>

      <div className="mt-12">
        <Tagline withLeaf size="sm" />
      </div>

      <div className="mt-10 text-center">
        <ButtonLink href="/booking" size="lg">
          예약하러 가기
        </ButtonLink>
      </div>
    </div>
  );
}
