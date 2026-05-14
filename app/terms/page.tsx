import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', minHeight: '60px' }}>
        <Link
          href="/"
          aria-label="Go back"
          style={{
            display: 'flex', alignItems: 'center',
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <div style={{ maxWidth: '540px', margin: '0 auto', padding: '8px 24px 64px' }}>
        <h1 style={{
          fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
          fontWeight: 500,
          fontSize: '28px',
          color: 'var(--text)',
          marginBottom: '24px',
          lineHeight: 1.2,
        }}>
          Terms of Use
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--muted)', fontWeight: 300 }}>
          This document is being updated. Please check back soon.
        </p>
      </div>
    </div>
  );
}
