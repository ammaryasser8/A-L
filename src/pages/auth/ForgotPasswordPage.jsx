import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import AuthLayout from '../../components/auth/AuthLayout';
import styles from '../../components/auth/AuthForm.module.css';

export default function ForgotPasswordPage() {
  useDocumentTitle('Reset Password');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (token) await authService.confirmPasswordReset({ token, password });
      else await authService.requestPasswordReset({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="AL Guest"
      title={token ? 'Choose a new password.' : 'Reset your password.'}
      subtitle={token ? 'Use a strong new password for your AL account.' : "We'll send you a link to get back in."}
      footer={<p>Remembered it after all? <Link to="/login">Sign in</Link></p>}
    >
      {sent ? (
        <p className={styles.success} role="status">
          {token ? 'Your password has been updated. You can now sign in.' : `If an AL Guest account exists for ${email || 'that address'}, a reset link is on its way.`}
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {token ? <label className={styles.field}><span>New password</span><input type="password" required minLength="12" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><small>At least 12 characters with uppercase, lowercase, and a number.</small></label> : <label className={styles.field}><span>Email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? (token ? 'Updating…' : 'Sending…') : (token ? 'Update password' : 'Send reset link')}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
