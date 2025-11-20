import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import './AuthPages.css';

const PasswordResetForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/password-reset/${token}`, { password });
      alert('Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Şifre sıfırlama başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpaceBackground>
      <div className="auth-container">
        <GlassCard className="auth-card">
          <h1 className="auth-title">Yeni Şifre Belirle</h1>
          <p className="auth-subtitle">Hesabınız için yeni bir şifre oluşturun</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Yeni Şifre</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Şifre Tekrar</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Şifre sıfırlanıyor...' : 'Şifreyi Sıfırla'}
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

export default PasswordResetForm;
