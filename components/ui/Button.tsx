import Link from 'next/link';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 rounded-full select-none disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-ink-primary text-bg-primary hover:bg-[#5a4d44] hover:scale-[1.02]',
  ghost: 'text-ink-primary hover:bg-bg-warm',
  outline: 'border border-ink-primary text-ink-primary hover:bg-bg-warm',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
};

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

type LinkProps = CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  children,
  ...rest
}: LinkProps) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
