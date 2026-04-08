import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal({ isOpen, onClose }) {
  const { signUp, login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Заповніть email і пароль.');
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Паролі не співпадають.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const actionResult =
      activeTab === 'register'
        ? await signUp(email.trim(), password)
        : await login(email.trim(), password);

    setIsSubmitting(false);

    if (actionResult.error) {
      setError(actionResult.error);
      return;
    }

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <div className="auth-modal-header">
          <h3>Авторизація</h3>
          <button type="button" className="btn modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Вхід
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Реєстрація
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {activeTab === 'register' && (
            <input
              type="password"
              placeholder="Підтвердження пароля"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn auth-submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Зачекайте...'
              : activeTab === 'register'
              ? 'Зареєструватись'
              : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;

