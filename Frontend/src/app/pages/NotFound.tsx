import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--color-background)' }}>
      <p style={{ fontSize: '64px' }}>🌿</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: 'var(--color-foreground)' }}>Page Not Found</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'var(--color-muted-foreground)' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-4 px-8 py-3 rounded-full text-white" style={{ background: '#1E5631', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
        ← Go Home
      </Link>
    </div>
  );
}
