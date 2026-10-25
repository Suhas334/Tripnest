import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="site-brand" to="/trips">
            <span className="brand-symbol"><MapPin size={20} /></span> TripNest
          </Link>
          <nav className="header-links" aria-label="Main navigation">
            <NavLink
              to="/trips"
              end
              className={({ isActive }) =>
                isActive ? 'header-link active' : 'header-link'
              }
            >
              My trips
            </NavLink>
            <Link to="/trips?new=1" className="header-link">
              <Plus size={16} /> Plan a trip
            </Link>
          </nav>
          <div className="header-user">
            <span className="header-greeting">Hi, {user?.name?.split(' ')[0]}</span>
            <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
            <button
              className="logout-button"
              title="Log out"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="content-wrap">
        <Outlet />
      </main>

      <footer className="site-footer">TripNest</footer>
    </div>
  );
}
