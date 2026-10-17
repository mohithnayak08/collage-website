import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Shield, LogOut, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('club_admin_token');

  const handleLogout = () => {
    localStorage.removeItem('club_admin_token');
    localStorage.removeItem('club_admin_user');
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px var(--primary-glow)'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              NEXUS<span className="gradient-text">CLUB</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Student Community
            </div>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: location.pathname === '/' ? '#fff' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            Explore Events
          </Link>

          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
                <Shield size={15} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#f87171' }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-dim)',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-glass)',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={14} /> Organizer Portal
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
