'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Campaigns' },
  { href: '/compare', label: 'Compare' },
  { href: '/players', label: 'Players' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)',
      }}
    >
      <nav
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.5rem',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
            }}
          >
            Barça UCL
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderLeft: '1px solid var(--color-border)',
              paddingLeft: '0.625rem',
            }}
          >
            Winning Campaigns
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/' || pathname.startsWith('/season')
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
