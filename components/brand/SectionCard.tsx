import clsx from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: Props) {
  return (
    <div className={clsx('card-double p-8 md:p-12', className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
