import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import api, { errorMessage } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Auth({ register = false }) {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/trips" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post(register ? '/auth/register' : '/auth/login', form);
      signIn(data);
      navigate('/trips');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-main">
        <div className="auth-form-wrap">
          <div className="auth-brand">
            <span className="brand-symbol"><MapPin size={20} /></span> TripNest
          </div>
          <h2>{register ? 'Create your account' : 'Sign in to TripNest'}</h2>
          <p className="muted">
            {register ? 'Start planning your trips.' : 'Your trips are waiting.'}
          </p>
          <form onSubmit={submit} className="stack-form">
            {register && (
              <label>
                Full name
                <input
                  required
                  maxLength="60"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
            )}
            <label>
              Email address
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            {error && <div className="alert">{error}</div>}
            <button className="btn primary full" disabled={busy}>
              {busy ? 'Please wait...' : register ? 'Create account' : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {register ? 'Already have an account?' : 'New to TripNest?'}{' '}
            <Link to={register ? '/login' : '/register'}>
              {register ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
