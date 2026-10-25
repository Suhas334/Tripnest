import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, MapPin, Plus, Search, ArrowRight, Wallet, Trash2, Pencil } from 'lucide-react';
import api, { errorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import TripForm from '../components/TripForm';

const formatDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// A small fixed set of travel photos. Each trip card just cycles through
// these by index — no fetching, no matching to the destination.
const photos = [
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=80',
];

function status(trip) {
  const today = new Date().toISOString().slice(0, 10);
  if (trip.endDate < today) return 'Completed';
  if (trip.startDate <= today) return 'Ongoing';
  return 'Upcoming';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
      setError('');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (params.get('new') === '1') {
      setForm({});
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const visible = useMemo(
    () =>
      trips.filter((t) =>
        `${t.title} ${t.destination}`.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [trips, search]
  );

  const remove = async (trip) => {
    if (!window.confirm(`Delete "${trip.title}" and all its places?`)) return;
    try {
      await api.delete(`/trips/${trip._id}`);
      refresh();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Your trips</h1>
        <p>
          Hi {user?.name?.split(' ')[0]}, here are your saved travel plans. Add a new trip
          or open one to manage its itinerary.
        </p>
      </div>

      <section className="trips-section">
        <div className="trips-title-row">
          <div>
            <h2>
              My trips <span className="trip-count">{trips.length}</span>
            </h2>
            <p className="muted">All your travel plans in one place.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label className="search-field">
              <Search size={18} />
              <input
                aria-label="Search trips"
                placeholder="Search a destination"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button className="btn primary" onClick={() => setForm({})}>
              <Plus size={17} /> New trip
            </button>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <p className="muted">Loading your trips...</p>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <MapPin size={34} />
            <h3>{search ? 'No trips found' : 'No trips yet'}</h3>
            <p>
              {search
                ? 'Try another destination or trip name.'
                : 'Start by creating your first travel plan.'}
            </p>
            {!search && (
              <button className="btn primary" onClick={() => setForm({})}>
                <Plus size={17} /> Create trip
              </button>
            )}
          </div>
        ) : (
          <div className="trip-grid">
            {visible.map((trip, i) => (
              <article className="trip-card" key={trip._id}>
                <div
                  className="trip-image"
                  style={{
                    backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,.35)), url("${photos[i % photos.length]}")`,
                  }}
                >
                  <span className={'status-pill ' + status(trip).toLowerCase()}>
                    {status(trip)}
                  </span>
                </div>
                <div className="trip-body">
                  <div className="destination-line">
                    <MapPin size={14} />
                    {trip.destination}
                  </div>
                  <h3>{trip.title}</h3>
                  <div className="trip-info">
                    <span>
                      <CalendarDays size={15} />
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </span>
                    <span>
                      <Wallet size={15} />
                      Budget ₹{Number(trip.budget).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="trip-bottom">
                    <Link to={`/trips/${trip._id}`} className="view-link">
                      View itinerary <ArrowRight size={15} />
                    </Link>
                    <div className="card-actions">
                      <button
                        className="icon-button"
                        aria-label={`Edit ${trip.title}`}
                        title="Edit trip"
                        onClick={() => setForm(trip)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button danger"
                        aria-label={`Delete ${trip.title}`}
                        title="Delete trip"
                        onClick={() => remove(trip)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {form !== null && (
        <TripForm
          trip={form}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
