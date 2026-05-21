import clsx from 'clsx';
import { BUSINESS } from '@/lib/constants/business';

type Props = {
  className?: string;
  size?: 'sm' | 'md';
  withLeaf?: boolean;
};

export function Tagline({ className, size = 'md', withLeaf = false }: Props) {
  const text = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={clsx('text-center text-ink-primary', text, className)}>
      {withLeaf && (
        <div className="my-4 text-xl opacity-50" aria-hidden="true">
          🌿
        </div>
      )}
      <p className="leading-loose tracking-wide whitespace-pre-line">{BUSINESS.tagline}</p>
    </div>
  );
}
