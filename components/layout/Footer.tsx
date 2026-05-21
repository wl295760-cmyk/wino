import Link from 'next/link';
import { BUSINESS, NAV } from '@/lib/constants/business';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-soft bg-bg-warm">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-medium tracking-brand text-ink-primary text-lg">
              {BUSINESS.name}
            </div>
            <div className="mt-2 text-sm tracking-caption text-ink-secondary">
              {BUSINESS.brand} · {BUSINESS.location}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-secondary whitespace-pre-line">
              {BUSINESS.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink-primary tracking-wide">사이트 맵</h3>
            <ul className="mt-3 space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink-primary tracking-wide">매장 안내</h3>
            <address className="mt-3 not-italic space-y-1 text-sm text-ink-secondary">
              <div>{BUSINESS.address}</div>
              <div>
                <a href={BUSINESS.phoneTel} className="hover:text-ink-primary">
                  {BUSINESS.phone}
                </a>
              </div>
              {BUSINESS.hours.map((h) => (
                <div key={h.day}>
                  {h.day} · {h.time}
                </div>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-soft text-xs text-ink-secondary flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            사업자등록번호 {BUSINESS.businessNumber} · 대표 {BUSINESS.representative}
          </div>
          <div>© {new Date().getFullYear()} {BUSINESS.name} with NOA. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
