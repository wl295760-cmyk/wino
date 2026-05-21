import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-content py-24 text-center">
      <div className="text-5xl mb-6 opacity-40" aria-hidden="true">🌿</div>
      <h1 className="text-3xl font-medium tracking-wide text-ink-primary">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 text-ink-secondary">
        요청하신 페이지가 이동했거나 존재하지 않아요.
      </p>
      <div className="mt-10">
        <ButtonLink href="/">홈으로 돌아가기</ButtonLink>
      </div>
    </div>
  );
}
