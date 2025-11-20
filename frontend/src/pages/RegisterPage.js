import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/${provider}`;
  };

  return (
    <SpaceBackground>
      <div className="auth-container">
        <GlassCard className="auth-card">
          <h1 className="auth-title">Kayıt Ol</h1>
          <p className="auth-subtitle">🎁 Herkese Mutlu Yıllar! 🎄</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Kullanıcı Adı</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="kullaniciadi"
                pattern="[a-z0-9_-]+"
                title="Sadece küçük harf, rakam, tire ve alt çizgi kullanabilirsiniz"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="divider">
            <span>veya</span>
          </div>

          <div className="oauth-buttons">
            <button 
              onClick={() => handleOAuthRegister('google')} 
              className="btn-oauth btn-google"
            >
              <span>🚀</span> Google ile Kayıt Ol
            </button>
            <button 
              onClick={() => handleOAuthRegister('microsoft')} 
              className="btn-oauth btn-microsoft"
            >
              <span>🌟</span> Microsoft ile Kayıt Ol
            </button>
          </div>

          <div className="auth-links">
            <Link to="/login">Zaten hesabın var mı? Giriş yap</Link>
          </div>
        </GlassCard>
      </div>
    </SpaceBackground>
  );
};

export default RegisterPage;
