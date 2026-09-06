import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/" style={{ color: 'var(--al-gold)', textDecoration: 'underline' }}>
        Back to home
      </Link>
    </div>
  );
}