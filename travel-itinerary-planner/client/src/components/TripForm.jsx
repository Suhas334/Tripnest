import { useState } from 'react';
import { X } from 'lucide-react';
import api, { errorMessage } from '../api';

export default function TripForm({ trip, onClose, onSaved }) {
  const edit = Boolean(trip?._id);
  const [form, setForm] = useState({
    title: trip.title || '',
    destination: trip.destination || '',
    startDate: trip.startDate || '',
    endDate: trip.endDate || '',
    budget: trip.budget ?? 0,
    notes: trip.notes || '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (edit) await api.put(`/trips/${trip._id}`, form);
      else await api.post('/trips', form);
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
        aria-label={edit ? 'Edit trip' : 'New trip'}
      >
        <div className="modal-head">
          <h2>{edit ? 'Edit trip' : 'Plan a new trip'}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form className="stack-form" onSubmit={submit}>
          <label>
            Trip name
            <input
              name="title"
              required
              maxLength="80"
              placeholder="e.g. Weekend in Hyderabad"
              value={form.title}
              onChange={change}
            />
          </label>
          <label>
            Destination
            <input
              name="destination"
              required
              maxLength="100"
              placeholder="e.g. Hyderabad"
              value={form.destination}
              onChange={change}
            />
          </label>
          <div className="form-row">
            <label>
              Start date
              <input
                name="startDate"
                type="date"
                required
                value={form.startDate}
                onChange={change}
              />
            </label>
            <label>
              End date
              <input
                name="endDate"
                type="date"
                required
                min={form.startDate}
                value={form.endDate}
                onChange={change}
              />
            </label>
          </div>
          <label>
            Estimated budget (₹)
            <input
              name="budget"
              type="number"
              min="0"
              step="1"
              required
              value={form.budget}
              onChange={change}
            />
          </label>
          <label>
            Notes (optional)
            <textarea
              name="notes"
              rows="3"
              maxLength="1000"
              placeholder="Any ideas or reminders?"
              value={form.notes}
              onChange={change}
            />
          </label>
          {error && <div className="alert">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" disabled={busy}>
              {busy ? 'Saving...' : edit ? 'Save changes' : 'Create trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
