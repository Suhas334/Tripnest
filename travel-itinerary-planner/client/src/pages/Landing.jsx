import { Link, Navigate } from 'react-router-dom';
import { MapPin, CalendarDays, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  // Logged-in users don't need to see the marketing page.
  if (user) return <Navigate to="/trips" replace />;

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="site-brand" to="/">
            <span className="brand-symbol"><MapPin size={20} /></span> TripNest
          </Link>
          <div className="landing-actions">
            <Link to="/login" className="landing-link">Log in</Link>
            <Link to="/register" className="btn primary">Sign up</Link>
          </div>
        </div>
      </header>

      <main className="content-wrap">
        <section className="landing-hero">
          <h1>Plan your trips in one place</h1>
          <p>
            TripNest helps you organize destinations, build a day-by-day
            itinerary, and keep an eye on your budget — all from a single,
            simple dashboard.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="btn primary">Get started</Link>
            <Link to="/login" className="btn secondary">Log in</Link>
          </div>
        </section>

        <section className="landing-features">
          <div className="feature-card">
            <div className="feature-icon"><MapPin size={24} /></div>
            <h3>Save your destinations</h3>
            <p>Create a trip for each destination and keep every plan in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><CalendarDays size={24} /></div>
            <h3>Plan day by day</h3>
            <p>Add places to specific dates and mark them off as you visit them.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Wallet size={24} /></div>
            <h3>Stay on budget</h3>
            <p>Track estimated costs against your trip budget so you don't overspend.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">TripNest</footer>
    </div>
  );
}
