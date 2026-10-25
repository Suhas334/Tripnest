import { useState } from 'react';
import { X } from 'lucide-react';
import api, { errorMessage } from '../api';

export default function PlaceForm({ trip, place, onClose, onSaved }) {
  const edit = Boolean(place?._id);
  const [form, setForm] = useState({
    name: place.name || '',
    visitDate: place.visitDate || trip.startDate,
    time: place.time || '',
    cost: place.cost ?? 0,
    notes: place.notes || '',
    visited: place.visited || false,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (edit) await api.put(`/trips/${trip._id}/places/${place._id}`, form);
      else await api.post(`/trips/${trip._id}/places`, form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={edit ? 'Edit place' : 'Add place'}
      >
        <div className="modal-head">
          <h2>{edit ? 'Edit place' : 'Add a place'}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form className="stack-form" onSubmit={submit}>
          <label>
            Place name
            <input
              name="name"
              required
              maxLength="100"
              placeholder="e.g. Charminar"
              value={form.name}
              onChange={change}
            />
          </label>
          <div className="form-row">
            <label>
              Visit date
              <input
                type="date"
                name="visitDate"
                required
                min={trip.startDate}
                max={trip.endDate}
                value={form.visitDate}
                onChange={change}
              />
            </label>
            <label>
              Time (optional)
              <input name="time" type="time" value={form.time} onChange={change} />
            </label>
          </div>
          <label>
            Estimated cost (₹)
            <input
              type="number"
              min="0"
              step="1"
              name="cost"
              required
              value={form.cost}
              onChange={change}
            />
          </label>
          <label>
            Notes (optional)
            <textarea
              name="notes"
              rows="3"
              maxLength="500"
              placeholder="Tickets, food, travel tips..."
              value={form.notes}
              onChange={change}
            />
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              name="visited"
              checked={form.visited}
              onChange={change}
            />{' '}
            Already visited
          </label>
          {error && <div className="alert">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" disabled={busy}>
              {busy ? 'Saving...' : edit ? 'Save changes' : 'Add place'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
