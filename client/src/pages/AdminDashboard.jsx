import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchEvents,
  fetchRegistrations,
  updateRegistrationStatus,
  createEvent,
  deleteEvent,
} from '../services/api';
import { Download, Plus, Trash2, CheckCircle, XCircle, Clock, ExternalLink, ShieldAlert, Sparkles, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('club_admin_token');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    fee: 0,
    upiId: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadEvents();
  }, [token]);

  useEffect(() => {
    if (selectedEventId) {
      loadRegistrations(selectedEventId);
    } else {
      setRegistrations([]);
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      const res = await fetchEvents();
      setEvents(res.data);
      if (res.data.length > 0 && !selectedEventId) {
        setSelectedEventId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const loadRegistrations = async (eventId) => {
    try {
      setLoading(true);
      const res = await fetchRegistrations({ eventId });
      setRegistrations(res.data);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (regId, newStatus) => {
    try {
      await updateRegistrationStatus(regId, newStatus);
      setRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, paymentStatus: newStatus } : r))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await createEvent(newEvent);
      setEvents([...events, res.data]);
      setSelectedEventId(res.data._id);
      setShowEventModal(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        fee: 0,
        upiId: '',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove associated records.')) return;
    try {
      await deleteEvent(id);
      const updated = events.filter((e) => e._id !== id);
      setEvents(updated);
      setSelectedEventId(updated.length > 0 ? updated[0]._id : '');
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleExportExcel = () => {
    if (!selectedEventId) return;
    const exportUrl = `http://localhost:5000/api/registrations/export/${selectedEventId}`;

    fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Download failed');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const selected = events.find((e) => e._id === selectedEventId);
        a.download = `${selected ? selected.title.replace(/\s+/g, '_') : 'event'}_registrations.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert(err.message));
  };

  const currentEvent = events.find((e) => e._id === selectedEventId);

  const displayedRegistrations = registrations.filter((r) =>
    filterStatus === 'all' ? true : r.paymentStatus === filterStatus
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <ShieldAlert size={16} /> Restricted Organizer Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Event & Attendee Command</h1>
        </div>
        <button onClick={() => setShowEventModal(true)} className="btn btn-primary">
          <Plus size={18} /> Publish New Event
        </button>
      </div>

      {/* Control Bar: Selector & Actions */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '0.65rem',
              border: '1px solid var(--border-glass)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#fff',
              minWidth: '240px',
              fontSize: '0.9rem'
            }}
          >
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          {currentEvent && (
            <button
              onClick={() => handleDeleteEvent(currentEvent._id)}
              className="btn btn-outline btn-sm"
              title="Delete Event"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={15} /> Delete
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-dim)" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-glass)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Registrations</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={!selectedEventId || registrations.length === 0}
            className="btn btn-outline"
            style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#a5b4fc' }}
          >
            <Download size={17} /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Registered Attendees ({displayedRegistrations.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Real-time synchronization
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            Loading attendee list...
          </div>
        ) : displayedRegistrations.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            No registrants found for this filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>#</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Attendee</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Contact Info</th>
                  <th style={{ padding: '1rem 1.25rem' }}>College Roll No</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Payment Receipt</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Verify / Reject</th>
                </tr>
              </thead>
              <tbody>
                {displayedRegistrations.map((reg, index) => (
                  <tr key={reg._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)' }}>{index + 1}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#fff' }}>{reg.fullName}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ color: 'var(--text-main)' }}>{reg.email}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{reg.phone}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: '#c7d2fe' }}>{reg.rollNumber}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <a
                        href={`http://localhost:5000${reg.paymentScreenshotUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={13} /> View Receipt
                      </a>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge badge-${reg.paymentStatus}`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleStatusChange(reg._id, 'verified')}
                          title="Mark Verified"
                          className="btn btn-sm"
                          style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}
                        >
                          <CheckCircle size={15} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(reg._id, 'rejected')}
                          title="Reject"
                          className="btn btn-sm"
                          style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                          <XCircle size={15} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(reg._id, 'pending')}
                          title="Mark Pending"
                          className="btn btn-sm"
                          style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047' }}
                        >
                          <Clock size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating New Event */}
      {showEventModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2.5rem', background: '#0f172a' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Publish New Event</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
              This event will immediately appear on the public homepage for student registrations.
            </p>

            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Robotics Hackathon"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the event, perks, schedule..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM - 4:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="Campus Center / Lab"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newEvent.fee}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Club UPI ID (for payments)</label>
                <input
                  type="text"
                  placeholder="nexusclub@upi"
                  value={newEvent.upiId}
                  onChange={(e) => setNewEvent({ ...newEvent, upiId: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowEventModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
