import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { formatPriceKrw } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: '예약 접수 완료',
};

type SearchParams = {
  code?: string;
  service?: string;
  time?: string;
  total?: string;
};

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const code = searchParams.code ?? '----';
  const service = searchParams.service ?? '';
  const time = searchParams.time ?? '';
  const total = Number(searchParams.total ?? 0);

  return (
    <div className="container-content py-16 md:py-24 text-center">
      <div className="text-4xl mb-6" aria-hidden="true">🌿</div>
      <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-ink-primary">
        예약 요청이 접수되었습니다
      </h1>
      <p className="mt-4 text-ink-secondary">
        확인 후 카카오톡 또는 전화로 안내드릴게요.
      </p>

      <div className="mt-10 p-6 border border-border rounded-card text-left space-y-3 bg-bg-surface">
        <div>
          <div className="text-xs tracking-caption text-ink-secondary">예약 코드</div>
          <div className="mt-1 text-2xl font-medium text-ink-primary tabular-nums tracking-widest">
            {code}
          </div>
        </div>
        {service && (
          <div className="pt-3 border-t border-border-soft">
            <div className="text-xs tracking-caption text-ink-secondary">서비스</div>
            <div className="mt-1 text-base text-ink-primary">{service}</div>
          </div>
        )}
        {time && (
          <div className="pt-3 border-t border-border-soft">
            <div className="text-xs tracking-caption text-ink-secondary">희망 일시</div>
            <div className="mt-1 text-base text-ink-primary">{time}</div>
          </div>
        )}
        {total > 0 && (
          <div className="pt-3 border-t border-border-soft">
            <div className="text-xs tracking-caption text-ink-secondary">예상 금액</div>
            <div className="mt-1 text-base font-medium text-ink-primary tabular-nums">
              {formatPriceKrw(total)}원
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-secondary">
        예약 코드는 변경/취소 시 사용되니 보관해주세요.
      </p>

      <div className="mt-10 flex justify-center gap-3">
        <ButtonLink href="/" variant="outline">
          홈으로
        </ButtonLink>
        <ButtonLink href="/services">메뉴 더 보기</ButtonLink>
      </div>
    </div>
  );
}
