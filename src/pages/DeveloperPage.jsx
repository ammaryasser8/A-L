import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/apiClient';
import { useAuth } from '../hooks/useAuth';
import styles from './GuestPortal.module.css';
import './GuestPortalExtras.css';
import './DeveloperPage.css';

const tabs = ['Overview', 'Accounts', 'Applications', 'Security'];
const formatDate = (value) => value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';

function Notice({ children, error = false }) { return children ? <p className={error ? 'developerNotice developerError' : 'developerNotice'} role={error ? 'alert' : 'status'}>{children}</p> : null; }

export default function DeveloperPage() {
  const { session } = useAuth();
  const [tab, setTab] = useState('Overview');
  const [overview, setOverview] = useState(null);
  const [accounts, setAccounts] = useState({ users: [], total: 0, page: 1 });
  const [applications, setApplications] = useState({ applications: [], total: 0 });
  const [security, setSecurity] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', tier: '' });
  const [selected, setSelected] = useState(null);
  const [inspectReason, setInspectReason] = useState('');
  const [decision, setDecision] = useState({});
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(async () => setOverview(await api('/developer/overview')), []);
  const loadAccounts = useCallback(async (page = 1) => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (query.trim()) params.set('q', query.trim());
    if (filters.status) params.set('status', filters.status);
    if (filters.tier) params.set('tier', filters.tier);
    setAccounts(await api(`/developer/users?${params}`));
  }, [filters.status, filters.tier, query]);
  const loadApplications = useCallback(async () => setApplications(await api('/developer/membership-applications')), []);
  const loadSecurity = useCallback(async () => { const data = await api('/developer/security-events'); setSecurity(data.events); }, []);
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { await Promise.all([loadOverview(), loadAccounts(), loadApplications(), loadSecurity()]); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [loadAccounts, loadApplications, loadOverview, loadSecurity]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const activeAccounts = useMemo(() => accounts.users.filter((user) => user.status === 'active').length, [accounts]);
  async function inspect(user) {
    if (inspectReason.trim().length < 5) { setError('Provide an inspection reason of at least five characters.'); return; }
    setError('');
    try { const data = await api(`/developer/users/${encodeURIComponent(user.id)}?reason=${encodeURIComponent(inspectReason.trim())}`); setSelected(data); setNotice(`Inspection recorded for ${data.user.email}.`); }
    catch (err) { setError(err.message); }
  }
  async function updateStatus(user, status) {
    const reason = window.prompt(`Reason for ${status === 'suspended' ? 'suspending' : 'restoring'} this account (minimum five characters):`);
    if (!reason) return;
    try { await api(`/developer/users/${encodeURIComponent(user.id)}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }); setNotice(`Account ${status}.`); setSelected(null); await Promise.all([loadAccounts(accounts.page), loadOverview()]); }
    catch (err) { setError(err.message); }
  }
  async function review(application, approved) {
    const values = decision[application.id] || {};
    if (!window.confirm(`${approved ? 'Approve' : 'Reject'} this membership application? This action is recorded in the audit log.`)) return;
    try {
      await api(`/developer/membership-applications/${encodeURIComponent(application.id)}`, { method: 'PATCH', body: JSON.stringify({ decision: approved ? 'approved' : 'rejected', tier: approved ? (values.tier || application.tier) : undefined, response: values.response || undefined, internalNote: values.internalNote || undefined }) });
      setNotice(`Application ${approved ? 'approved' : 'rejected'} and recorded.`); await Promise.all([loadApplications(), loadOverview(), loadAccounts(accounts.page)]);
    } catch (err) { setError(err.message); }
  }

  return <main className={styles.portal}>
    <header className={styles.header}><Link to="/account" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /><span>AL Hospitality</span></Link><Link to="/account" className="utilityLink">Guest portal</Link></header>
    <section className="pageIntro developerIntro"><p className={styles.eyebrow}>Developer Control Center</p><h1>Co-Founder &amp; Developer</h1><p>{session.firstName}, this shared, server-authorized workspace is identical for both designated co-founders. Administrative actions are audited and customer credentials are never exposed.</p></section>
    <nav className="developerTabs" aria-label="Control center sections">{tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} type="button">{item}</button>)}</nav>
    <section className="developerWorkspace">
      <Notice error={Boolean(error)}>{error}</Notice><Notice>{notice}</Notice>
      {loading && <p className="developerLoading">Loading live operational data…</p>}
      {!loading && tab === 'Overview' && <>
        <div className="developerMetrics"><article><span>Registered accounts</span><strong>{overview?.accounts ?? '—'}</strong></article><article><span>Pending reviews</span><strong>{overview?.pendingApplications ?? '—'}</strong></article><article><span>Visible active accounts</span><strong>{activeAccounts}</strong></article><article><span>API health</span><strong>{overview?.health?.api || 'unavailable'}</strong></article></div>
        <div className="developerColumns"><section><p className={styles.eyebrow}>Recent administrative activity</p>{overview?.recentActivity?.length ? <ul className="developerList">{overview.recentActivity.map((entry) => <li key={entry.id}><b>{entry.action}</b><span>{entry.targetType} · {formatDate(entry.createdAt)}</span></li>)}</ul> : <p className="developerEmpty">No administrative records have been created yet.</p>}</section><section><p className={styles.eyebrow}>Recent security signals</p>{overview?.securityEvents?.length ? <ul className="developerList">{overview.securityEvents.map((entry) => <li key={entry.id}><b>{entry.kind}</b><span>{entry.severity} · {formatDate(entry.createdAt)}</span></li>)}</ul> : <p className="developerEmpty">No security events are available.</p>}</section></div>
      </>}
      {!loading && tab === 'Accounts' && <>
        <form className="developerFilters" onSubmit={(event) => { event.preventDefault(); loadAccounts(1).catch((err) => setError(err.message)); }}><input aria-label="Search accounts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or internal ID" /><select aria-label="Account status" value={filters.status} onChange={(event) => setFilters((value) => ({ ...value, status: event.target.value }))}><option value="">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select><select aria-label="Membership tier" value={filters.tier} onChange={(event) => setFilters((value) => ({ ...value, tier: event.target.value }))}><option value="">All memberships</option><option value="guest">Guest</option><option value="member">Member</option><option value="privilege">Privilege</option></select><button className="primaryButton" type="submit">Search</button></form>
        <p className="developerHint">{accounts.total} matching account{accounts.total === 1 ? '' : 's'}. Enter a reason before inspecting an individual account.</p><label className="developerReason">Inspection reason<input value={inspectReason} maxLength="500" onChange={(event) => setInspectReason(event.target.value)} placeholder="Support case or investigation context" /></label>
        <div className="developerTable">{accounts.users.map((user) => <article key={user.id}><div><b>{user.firstName} {user.lastName}</b><span>{user.email} · {user.id}</span></div><span>{user.membership?.tier || 'guest'} · {user.status}</span><div className="developerActions"><button className="textButton" onClick={() => inspect(user)} type="button">Inspect</button>{user.administrativeIdentity ? <span className="developerProtected">Co-founder protected</span> : <button className="textButton" onClick={() => updateStatus(user, user.status === 'active' ? 'suspended' : 'active')} type="button">{user.status === 'active' ? 'Suspend' : 'Restore'}</button>}</div></article>)}</div>
        <div className="developerPager"><button disabled={accounts.page <= 1} onClick={() => loadAccounts(accounts.page - 1).catch((err) => setError(err.message))} type="button">Previous</button><span>Page {accounts.page}</span><button disabled={accounts.page * 20 >= accounts.total} onClick={() => loadAccounts(accounts.page + 1).catch((err) => setError(err.message))} type="button">Next</button></div>
        {selected && <section className="developerInspection"><p className={styles.eyebrow}>Read-only account inspection</p><h2>{selected.user.firstName} {selected.user.lastName}</h2><p>{selected.user.email} · {selected.user.membership?.tier || 'guest'} · {selected.user.status}</p><div className="developerColumns"><div><b>Membership applications</b>{selected.applications.length ? <ul className="developerList">{selected.applications.map((item) => <li key={item.id}><b>{item.tier} · {item.status}</b><span>{formatDate(item.createdAt)}</span></li>)}</ul> : <p className="developerEmpty">No applications.</p>}</div><div><b>Security history</b>{selected.securityEvents.length ? <ul className="developerList">{selected.securityEvents.map((item, index) => <li key={`${item.kind}-${index}`}><b>{item.kind}</b><span>{item.severity} · {formatDate(item.createdAt)}</span></li>)}</ul> : <p className="developerEmpty">No events.</p>}</div><div><b>Relevant account activity</b>{selected.auditActions.length ? <ul className="developerList">{selected.auditActions.map((item, index) => <li key={`${item.action}-${index}`}><b>{item.action} · {item.outcome}</b><span>{formatDate(item.createdAt)}</span></li>)}</ul> : <p className="developerEmpty">No audit records.</p>}</div></div></section>}
      </>}
      {!loading && tab === 'Applications' && <><p className="developerHint">Only pending requests appear here. Approval records the reviewer, membership decision, timestamp, and any internal notes.</p><div className="developerApplications">{applications.applications.length ? applications.applications.map((item) => { const value = decision[item.id] || {}; return <article key={item.id}><header><div><p className={styles.eyebrow}>{item.tier} request</p><h2>{item.user.firstName} {item.user.lastName}</h2><p>{item.user.email} · current: {item.user.membership?.tier || 'guest'}</p></div><span>{formatDate(item.createdAt)}</span></header>{item.message && <p className="developerMessage">“{item.message}”</p>}<div className="developerDecision"><label>Approved tier<select value={value.tier || item.tier} onChange={(event) => setDecision((current) => ({ ...current, [item.id]: { ...current[item.id], tier: event.target.value } }))}><option value="member">Member</option><option value="privilege">Privilege</option></select></label><label>Customer response<input maxLength="1000" value={value.response || ''} onChange={(event) => setDecision((current) => ({ ...current, [item.id]: { ...current[item.id], response: event.target.value } }))} /></label><label>Private note<input maxLength="1000" value={value.internalNote || ''} onChange={(event) => setDecision((current) => ({ ...current, [item.id]: { ...current[item.id], internalNote: event.target.value } }))} /></label></div><footer><button className="primaryButton" onClick={() => review(item, true)} type="button">Approve</button><button className="textButton developerReject" onClick={() => review(item, false)} type="button">Reject</button></footer></article>; }) : <p className="developerEmpty">There are no pending membership applications.</p>}</div></>}
      {!loading && tab === 'Security' && <><p className="developerHint">Security signals support investigation; they do not label a customer as malicious. Sensitive account inspection requires a recorded reason.</p><div className="developerTable">{security.length ? security.map((event) => <article key={event.id}><div><b>{event.kind}</b><span>{event.user?.email || 'Unauthenticated signal'}</span></div><span className={`developerSeverity ${event.severity}`}>{event.severity}</span><span>{formatDate(event.createdAt)}</span></article>) : <p className="developerEmpty">No recorded security events.</p>}</div><button className="textButton" onClick={() => loadSecurity().catch((err) => setError(err.message))} type="button">Refresh signals</button></>}
    </section>
  </main>;
}
