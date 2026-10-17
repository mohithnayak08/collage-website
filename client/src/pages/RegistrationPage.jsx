import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEventById, submitRegistration } from '../services/api';
import { Calendar, MapPin, Clock, ArrowLeft, Upload, CheckCircle, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

const RegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchEventById(eventId);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Event could not be found');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please upload your payment screenshot/receipt.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('eventId', eventId);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('rollNumber', formData.rollNumber);
      data.append('paymentScreenshot', file);

      await submitRegistration(data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
        <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p>Loading event information...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '620px', padding: '6rem 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#4ade80'
          }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>Registration Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            We've received your registration for <strong style={{ color: '#fff' }}>{event?.title}</strong>. Your payment receipt has been submitted to the club organizers for verification.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Explore More Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '3rem 1.5rem 6rem' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '2rem',
          transition: 'color 0.2s'
        }}
      >
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Col: Event Brief & Payment Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <span className={event?.fee === 0 ? 'badge badge-free' : 'badge badge-paid'} style={{ marginBottom: '1rem' }}>
              {event?.fee === 0 ? 'FREE ENTRY' : `FEE: ₹${event?.fee}`}
            </span>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {event?.title}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {event?.description}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Calendar size={18} color="var(--primary)" />
                <span>{event?.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={18} color="var(--primary)" />
                <span>{event?.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--secondary)" />
                <span>{event?.venue}</span>
              </div>
            </div>
          </div>

          {/* Payment Card if Fee > 0 */}
          {event?.fee > 0 && (
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a5b4fc', fontWeight: 700, marginBottom: '0.75rem' }}>
                <CreditCard size={18} /> Payment Steps
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Please transfer <strong>₹{event.fee}</strong> via any UPI application (GPay / PhonePe / Paytm):
              </p>
              {event.upiId && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px dashed rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  color: '#e0e7ff'
                }}>
                  <span>UPI ID: {event.upiId}</span>
                </div>
              )}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
                * After completing transaction, take a screenshot of the confirmation page and upload it in the form.
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Registration Form */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Participant Information
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            No sign-in required. All fields marked with * are mandatory.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.85rem',
              borderRadius: '0.65rem',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Alex Morgan"
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@college.edu"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                College ID / Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                required
                value={formData.rollNumber}
                onChange={handleInputChange}
                placeholder="e.g. 21CS042"
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Upload Payment Screenshot (.jpg, .png, .pdf) *
              </label>
              <div style={{
                border: '2px dashed var(--border-glass)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {file ? file.name : 'Click or drag file to attach receipt'}
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  required
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </div>

              {preview && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Receipt preview"
                    style={{
                      maxHeight: '160px',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-glass)'
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              {submitting ? 'Submitting Registration...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
