import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import AuthLayout from '../../components/auth/AuthLayout';
import styles from '../../components/auth/AuthForm.module.css';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const { login, continueWithProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/account';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ ...form, remember });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProvider(provider) {
    setError('');
    setSubmitting(true);
    try {
      await continueWithProvider(provider);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'We could not continue with that provider.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="AL Guest"
      title="Welcome back."
      subtitle="Continue your journey."
      footer={<p>New to AL? <Link to="/signup">Create an account</Link></p>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
          />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <div className={styles.passwordRow}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm((f) => ({ ...f, password: event.target.value }))}
            />
            <button type="button" className={styles.toggle} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className={styles.link}>Forgot password?</Link>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div className={styles.providerDivider}><span>or continue with</span></div>
        <div className={styles.providers}>
          <button type="button" className={styles.provider} disabled={submitting} onClick={() => handleProvider('google')}>
            <span aria-hidden="true">G</span> Google
          </button>
          <button type="button" className={styles.provider} disabled={submitting} onClick={() => handleProvider('facebook')}>
            <span aria-hidden="true">f</span> Facebook
          </button>
        </div>
      </form>

      <p className={styles.demoHint}>Google and Facebook sign-in will be available when OAuth is configured. Use your AL account email and password.</p>
    </AuthLayout>
  );
}
