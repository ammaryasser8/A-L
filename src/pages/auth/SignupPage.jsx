import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import AuthLayout from '../../components/auth/AuthLayout';
import styles from '../../components/auth/AuthForm.module.css';

export default function SignupPage() {
  useDocumentTitle('Create Account');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (event) => setForm((f) => ({ ...f, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password.length < 12 || !/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      setError('Use at least 12 characters, including uppercase, lowercase, and a number.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Those passwords don\u2019t match.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(form);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="AL Guest"
      title="Begin your journey."
      subtitle="Create your AL Guest account."
      footer={<p>Already a guest? <Link to="/login">Sign in</Link></p>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row2}>
          <label className={styles.field}>
            <span>First name</span>
            <input required autoComplete="given-name" value={form.firstName} onChange={update('firstName')} />
          </label>
          <label className={styles.field}>
            <span>Last name</span>
            <input required autoComplete="family-name" value={form.lastName} onChange={update('lastName')} />
          </label>
        </div>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input type="password" required autoComplete="new-password" value={form.password} onChange={update('password')} />
        </label>
        <label className={styles.field}>
          <span>Confirm password</span>
          <input type="password" required autoComplete="new-password" value={form.confirm} onChange={update('confirm')} />
        </label>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
