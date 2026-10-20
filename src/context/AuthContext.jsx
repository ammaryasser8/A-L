import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from '../hooks/useAuth';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => { let active = true; authService.getSession().then((next) => { if (active) setSession(next); }).catch(() => { if (active) setSession(null); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const value = useMemo(() => ({
    session, isLoading, isAuthenticated: Boolean(session),
    async login(credentials) { const next = await authService.login(credentials); setSession(next); return next; },
    async signup(details) { const next = await authService.signup(details); setSession(next); return next; },
    async continueWithProvider(provider) { return authService.continueWithProvider(provider); },
    async updateProfile(updates) { const next = await authService.updateProfile(updates); setSession(next); return next; },
    async updateAvatar(file) { const next = await authService.updateAvatar(file); setSession(next); return next; },
    async logout() { await authService.logout(); setSession(null); },
  }), [session, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
