import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; (async () => { if (localStorage.getItem('tripnest_token')) { try { const { data } = await api.get('/auth/me'); if (active) setUser(data.user); } catch { localStorage.removeItem('tripnest_token'); } } if (active) setLoading(false); })(); return () => { active = false; }; }, []);
  const signIn = ({ token, user }) => { localStorage.setItem('tripnest_token', token); setUser(user); };
  const signOut = () => { localStorage.removeItem('tripnest_token'); setUser(null); };
  return <Context.Provider value={{ user, loading, signIn, signOut }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
