import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { conciergeService } from '../services/conciergeService';
import styles from './GuestPortal.module.css';
import './GuestPortalExtras.css';

export default function AccountRequestsPage() {
  const { session } = useAuth();
  const [requests, setRequests] = useState(null);
  useEffect(() => { let live = true; conciergeService.getRequestsForGuest(session.id).then((list) => { if (live) setRequests(list); }); return () => { live = false; }; }, [session.id]);
  return <main className={styles.portal}><header className={styles.header}><Link to="/account" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /><span>AL Guest portal</span></Link><Link to="/concierge" className="utilityLink">New request</Link></header><section className="pageIntro"><p className={styles.eyebrow}>Support & requests</p><h1>Always within reach.</h1><p>Each request belongs to your private guest record. The response timing and status below are part of this frontend demonstration.</p></section><section className="requestPortalList">{requests === null && <p>Preparing your requests…</p>}{requests?.length === 0 && <div className="emptyState"><h2>No requests yet.</h2><p>Whether it is a stay, a table or an arrival detail, the guest team is ready when you are.</p><Link to="/concierge">Start a request</Link></div>}{requests?.map((request) => <article key={request.id}><div><p className={styles.eyebrow}>{request.id} · {new Date(request.createdAt).toLocaleDateString()}</p><h2>{request.subject || request.category}</h2><p>{request.message}</p><small>{request.assignedDepartment || 'AL Guest Relations'} · {request.lastResponse || 'Received by the AL guest team.'}</small></div><aside><span>{request.status}</span><b>{request.priority || 'Standard'}</b></aside></article>)}</section></main>;
}
