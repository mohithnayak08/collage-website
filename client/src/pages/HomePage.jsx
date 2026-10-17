import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Users, Award, Flame, Search } from 'lucide-react';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchEvents();
      setEvents(res.data);
    } catch (err) {
      setError('Could not load events right now. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> Official Campus Club Hub • 2026 Session
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto 1.25rem'
          }}>
            Build Skills. Connect Minds. <br />
            <span className="gradient-text">Experience Campus Events.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Welcome to the public events gateway. Browse upcoming hackathons, tech workshops, and guest keynotes. Register instantly with zero account friction.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'inline-flex',
            gap: '2.5rem',
            padding: '1rem 2rem',
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(10px)'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">100%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Open To All</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">Direct</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Instant Sign-up</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">Certificates</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>For Participants</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Listing Section */}
      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Flame size={24} color="#ec4899" /> Upcoming Events
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Select an event below to view schedule details and secure your ticket
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            padding: '1rem',
            borderRadius: '0.75rem',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-dim)' }}>
            <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
            <p>Fetching active club events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No events found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
              {searchQuery ? `No matches for "${searchQuery}". Try a different keyword.` : 'Stay tuned! New club events and workshops will be published shortly.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem'
          }}>
            {filteredEvents.map((ev) => {
              const eventDate = new Date(ev.date);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={ev._id}
                  className="glass-panel fade-in"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s, border-color 0.25s',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                  }}
                >
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header tags */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span className={ev.fee === 0 ? 'badge badge-free' : 'badge badge-paid'}>
                        {ev.fee === 0 ? 'FREE ADMISSION' : `ENTRY: ₹${ev.fee}`}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        {formattedDate}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {ev.title}
                    </h3>

                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      flex: 1
                    }}>
                      {ev.description}
                    </p>

                    {/* Metadata chips */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Clock size={16} color="var(--primary)" />
                        <span>{ev.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <MapPin size={16} color="var(--secondary)" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      to={`/register/${ev._id}`}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}
                    >
                      <span>Register Now</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
