import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Plus,
  Wallet,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  NotebookPen,
} from 'lucide-react';
import api, { errorMessage } from '../api';
import PlaceForm from '../components/PlaceForm';
import TripForm from '../components/TripForm';

const displayDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placeForm, setPlaceForm] = useState(null);
  const [editTrip, setEditTrip] = useState(false);

  const refresh = async () => {
    try {
      const [t, p] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/trips/${id}/places`),
      ]);
      setTrip(t.data);
      setPlaces(p.data);
      setError('');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const groups = useMemo(
    () =>
      Object.entries(
        places.reduce((acc, p) => {
          (acc[p.visitDate] ??= []).push(p);
          return acc;
        }, {})
      ).sort(([a], [b]) => a.localeCompare(b)),
    [places]
  );

  const total = places.reduce((a, p) => a + p.cost, 0);
  const completed = places.filter((p) => p.visited).length;

  const remove = async (p) => {
    if (!window.confirm(`Remove ${p.name}?`)) return;
    try {
      await api.delete(`/trips/${id}/places/${p._id}`);
      refresh();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const toggle = async (p) => {
    try {
      await api.put(`/trips/${id}/places/${p._id}`, {
        name: p.name,
        visitDate: p.visitDate,
        time: p.time,
        cost: p.cost,
        notes: p.notes,
        visited: !p.visited,
      });
      refresh();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  if (loading) return <p className="muted">Loading itinerary...</p>;

  if (!trip)
    return (
      <div>
        <Link to="/trips" className="back-link">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="alert">{error || 'Trip not found.'}</div>
      </div>
    );

  return (
    <>
      <Link to="/trips" className="back-link">
        <ArrowLeft size={16} /> All trips
      </Link>

      <div className="detail-banner">
        <div>
          <h1>{trip.title}</h1>
          <p>
            <MapPin size={16} /> {trip.destination}
          </p>
          <p>
            <CalendarDays size={16} /> {displayDate(trip.startDate)} –{' '}
            {displayDate(trip.endDate)}
          </p>
        </div>
        <button className="btn light-btn" onClick={() => setEditTrip(true)}>
          <Pencil size={16} /> Edit trip
        </button>
      </div>

      <div className="detail-stats">
        <div>
          <small>Trip budget</small>
          <strong>₹{trip.budget.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <small>Planned expenses</small>
          <strong>₹{total.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <small>Remaining budget</small>
          <strong className={trip.budget - total < 0 ? 'over-budget' : ''}>
            ₹{(trip.budget - total).toLocaleString('en-IN')}
          </strong>
        </div>
        <div>
          <small>Places visited</small>
          <strong>
            {completed} / {places.length}
          </strong>
        </div>
      </div>

      {trip.notes && (
        <div className="trip-notes">
          <NotebookPen size={18} />
          <p>{trip.notes}</p>
        </div>
      )}

      <div className="section-heading">
        <div>
          <h2>Day-by-day itinerary</h2>
          <p className="muted">Add places and mark them as visited.</p>
        </div>
        <button className="btn primary" onClick={() => setPlaceForm({})}>
          <Plus size={17} /> Add place
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      {!places.length ? (
        <div className="empty">
          <MapPin size={30} />
          <h3>No places added yet</h3>
          <p>Start by adding the first place you want to visit.</p>
          <button className="btn primary" onClick={() => setPlaceForm({})}>
            <Plus size={16} /> Add your first place
          </button>
        </div>
      ) : (
        <div className="day-groups">
          {groups.map(([date, items], idx) => (
            <section className="day-group" key={date}>
              <div className="day-label">
                <span className="day-number">{idx + 1}</span>
                <div>
                  <strong>{displayDate(date)}</strong>
                  <small>
                    {items.length} {items.length === 1 ? 'place' : 'places'} planned
                  </small>
                </div>
              </div>
              <div className="place-list">
                {items.map((p) => (
                  <article
                    className={'place-card' + (p.visited ? ' done' : '')}
                    key={p._id}
                  >
                    <button
                      className="check-button"
                      title={p.visited ? 'Mark unvisited' : 'Mark visited'}
                      onClick={() => toggle(p)}
                    >
                      {p.visited ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div className="place-content">
                      <h3>{p.name}</h3>
                      <div className="place-details">
                        {p.time && (
                          <span>
                            <Clock size={14} /> {p.time}
                          </span>
                        )}
                        <span>
                          <Wallet size={14} /> ₹{p.cost.toLocaleString('en-IN')}
                        </span>
                        {p.visited && <span className="visited-label">Visited</span>}
                      </div>
                      {p.notes && <p>{p.notes}</p>}
                    </div>
                    <div className="place-buttons">
                      <button
                        className="icon-button"
                        title="Edit place"
                        onClick={() => setPlaceForm(p)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button danger"
                        title="Delete place"
                        onClick={() => remove(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {placeForm !== null && (
        <PlaceForm
          trip={trip}
          place={placeForm}
          onClose={() => setPlaceForm(null)}
          onSaved={() => {
            setPlaceForm(null);
            refresh();
          }}
        />
      )}

      {editTrip && (
        <TripForm
          trip={trip}
          onClose={() => setEditTrip(false)}
          onSaved={() => {
            setEditTrip(false);
            refresh();
          }}
        />
      )}
    </>
  );
}
