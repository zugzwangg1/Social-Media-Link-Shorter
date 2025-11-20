import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import './AuthPages.css';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/password-reset', { email });
      setMessage('Şifre sıfırlama bağlantısı email adresinize gönderildi.');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpaceBackground>
      <div className="auth-container">
        <GlassCard className="auth-card">
          <h1 className="auth-title">Şifremi Unuttum</h1>
          <p className="auth-subtitle">Email adresinize sıfırlama bağlantısı göndereceğiz</p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Giriş sayfasına dön</Link>
          </div>
        </GlassCard>
      </div>
    </SpaceBackground>
  );
};

export default PasswordResetRequest;
