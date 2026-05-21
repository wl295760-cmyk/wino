'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { BUSINESS, NAV } from '@/lib/constants/business';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-bg-primary/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-medium tracking-brand text-ink-primary" aria-label="홈으로">
          {BUSINESS.name}
        </Link>

        <nav className="hidden md:block" aria-label="주 내비게이션">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm tracking-wide text-ink-primary hover:text-accent-gold transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={clsx(
          'md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-border-soft',
          open ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav className="container-page py-4" aria-label="모바일 내비게이션">
          <ul className="flex flex-col gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-base tracking-wide text-ink-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
