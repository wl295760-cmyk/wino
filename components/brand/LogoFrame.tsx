import clsx from 'clsx';
import { BUSINESS } from '@/lib/constants/business';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const padding: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-8 py-10',
  md: 'px-10 py-14 md:px-14 md:py-16',
  lg: 'px-14 py-20 md:px-20 md:py-24',
};

const titleSize: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-[56px]',
};

export function LogoFrame({ size = 'md', className }: Props) {
  return (
    <div className={clsx('text-center', className)}>
      <div className={clsx('frame-circle', padding[size])}>
        <div className="text-sm font-light tracking-caption text-ink-primary">
          {BUSINESS.brand}
          <span className="ml-2 text-xs">✦ ✦ ✦</span>
        </div>
        <h1
          className={clsx(
            'mt-5 font-medium tracking-brand text-ink-primary',
            titleSize[size],
          )}
        >
          {BUSINESS.name}
        </h1>
        <div className="mx-auto my-6 h-px w-28 bg-ink-primary" />
        <div className="my-4 text-2xl opacity-60" aria-hidden="true">
          🌿
        </div>
        <div className="text-base font-light tracking-wide6 text-ink-primary">
          {BUSINESS.location}
        </div>
      </div>
    </div>
  );
}
