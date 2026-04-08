import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ onOpenAuthModal }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="site-header">
      <div
        className="container header-inner"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}
      >
        <div className="logo">
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#0f172a' }}>
            Блог про подорожі
          </Link>
        </div>

        <nav className="main-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            Статті
          </Link>
          <Link to="/publication" style={{ textDecoration: 'none', color: '#333' }}>
            Публікація
          </Link>
          <Link to="/my-posts" style={{ textDecoration: 'none', color: '#333' }}>
            Мої публікації
          </Link>

          {!user ? (
            <button type="button" className="btn" style={{ background: '#0ea5e9', color: 'white' }} onClick={onOpenAuthModal}>
              Увійти
            </button>
          ) : (
            <div className="auth-user-panel">
              <span className="auth-user-email" title={user.email || ''}>{user.email || 'Користувач'}</span>
              <button type="button" className="btn" style={{ background: '#ef4444', color: 'white' }} onClick={handleLogout}>
                Вийти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

