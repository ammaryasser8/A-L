import { useEffect, useMemo, useState } from 'react';
import { Camera, Check, ChevronRight, ImagePlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileAvatar from '../components/account/ProfileAvatar';
import MembershipBadge from '../components/account/MembershipBadge';
import styles from './AccountProfilePage.module.css';

const details = [['phone', 'Phone number', 'tel'], ['country', 'Country / region', 'text'], ['birthday', 'Date of birth', 'date'], ['language', 'Preferred language', 'text']];
const preferences = [['room', 'Room preference'], ['bed', 'Bed preference'], ['view', 'View preference'], ['dietary', 'Dietary notes'], ['communication', 'Preferred contact']];
function profileDraft(session) { return { phone: session.profile?.phone || session.phone || '', country: session.profile?.country || '', birthday: session.profile?.birthday ? String(session.profile.birthday).slice(0, 10) : '', language: session.profile?.language || '', preferences: { ...(session.profile?.preferences || {}) } }; }

export default function AccountProfilePage() {
  const { session, updateAvatar, updateProfile } = useAuth();
  const [draft, setDraft] = useState(() => profileDraft(session));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(profileDraft(session)), [draft, session]);
  useEffect(() => () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); }, [avatarPreview]);
  function update(key, value) { setDraft((current) => ({ ...current, [key]: value })); }
  function updatePreference(key, value) { setDraft((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } })); }
  function chooseAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError('Choose a PNG, JPEG, or WebP image smaller than 2 MB.'); event.target.value = ''; return; }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file));
  }
  function cancelAvatar() { if (avatarPreview) URL.revokeObjectURL(avatarPreview); setAvatarFile(null); setAvatarPreview(''); }
  async function saveAvatar() {
    if (!avatarFile) return;
    setUploading(true); setError(''); setNotice('');
    try { await updateAvatar(avatarFile); cancelAvatar(); setNotice('Your new profile image has been saved.'); }
    catch (requestError) { setError(requestError.message || 'We could not save this image.'); }
    finally { setUploading(false); }
  }
  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    try { await updateProfile(draft); setNotice('Your profile preferences have been saved.'); }
    catch (requestError) { setError(requestError.message || 'We could not save your profile.'); }
    finally { setSaving(false); }
  }
  return <main className={styles.profile}>
    <header className={styles.header}><Link to="/" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /><span>AL Hospitality Group</span></Link><Link to="/account" className={styles.return}>Return to account <ChevronRight size={14} /></Link></header>
    <section className={styles.hero}><div className={styles.identity}><div className={styles.avatarWrap}>{avatarPreview ? <img src={avatarPreview} alt="New profile preview" /> : <ProfileAvatar user={session} size="hero" />}<label className={styles.avatarPick}><Camera size={16} /><span>Choose image</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseAvatar} /></label></div><div><MembershipBadge user={session} /><p className={styles.eyebrow}>Your AL identity</p><h1>{session.firstName} {session.lastName}</h1><p>{session.email}</p></div></div><div className={styles.heroLinks}><Link to="/account/collection">View private collection</Link>{session.administrativeIdentity?.role === 'co_founder_developer' && <Link to="/developer">Developer center</Link>}</div></section>
    <div className={styles.layout}><aside className={styles.side}><p className={styles.eyebrow}>Account details</p><p>Your name and email remain protected by your account record. The fields below are the profile preferences supported by AL.</p><dl><div><dt>Membership</dt><dd>{session.membership?.tier || 'guest'}</dd></div><div><dt>Account email</dt><dd>{session.email}</dd></div></dl></aside>
      <div className={styles.forms}>
        <section className={styles.avatarPanel}><div><p className={styles.eyebrow}>Profile image</p><h2>A recognizable welcome.</h2><p>PNG, JPEG, or WebP—up to 2 MB.</p></div>{avatarFile ? <div className={styles.avatarActions}><button type="button" onClick={saveAvatar} disabled={uploading}>{uploading ? 'Saving image…' : <><Check size={15} /> Save image</>}</button><button type="button" onClick={cancelAvatar} disabled={uploading}><X size={15} /> Cancel</button></div> : <label className={styles.choose}><ImagePlus size={16} /> Select a new image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseAvatar} /></label>}</section>
        <form onSubmit={submit} noValidate>
          <section className={styles.formSection}><p className={styles.eyebrow}>Personal information</p><div className={styles.readonly}><span><small>First name</small>{session.firstName}</span><span><small>Last name</small>{session.lastName}</span></div><div className={styles.fieldGrid}>{details.map(([key, label, type]) => <label key={key}>{label}<input type={type} value={draft[key]} maxLength={key === 'country' ? 80 : key === 'phone' ? 40 : 40} onChange={(event) => update(key, event.target.value)} /></label>)}</div></section>
          <section className={styles.formSection}><p className={styles.eyebrow}>How you prefer to stay</p><div className={styles.fieldGrid}>{preferences.map(([key, label]) => <label key={key}>{label}<input value={draft.preferences[key] || ''} maxLength="160" onChange={(event) => updatePreference(key, event.target.value)} /></label>)}</div></section>
          {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.success} role="status">{notice}</p>}
          <div className={styles.formActions}><button type="submit" disabled={saving || !dirty}>{saving ? 'Saving profile…' : 'Save profile'}</button>{dirty && <button type="button" className={styles.cancel} onClick={() => { setDraft(profileDraft(session)); setError(''); }}>Discard changes</button>}</div>
        </form>
      </div>
    </div>
  </main>;
}
