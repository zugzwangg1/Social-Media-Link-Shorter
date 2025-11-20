import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <SpaceBackground>
      <div className="auth-container">
        <GlassCard className="auth-card">
          <h1 className="auth-title">Giriş Yap</h1>
          <p className="auth-subtitle">🎄 Herkese Mutlu Yıllar! ✨</p>

          {error && <div className="error-message">{error}</div>}

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

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="divider">
            <span>veya</span>
          </div>

          <div className="oauth-buttons">
            <button 
              onClick={() => handleOAuthLogin('google')} 
              className="btn-oauth btn-google"
            >
              <span>🚀</span> Google ile Giriş Yap
            </button>
            <button 
              onClick={() => handleOAuthLogin('microsoft')} 
              className="btn-oauth btn-microsoft"
            >
              <span>🌟</span> Microsoft ile Giriş Yap
            </button>
          </div>

          <div className="auth-links">
            <Link to="/register">Hesabın yok mu? Kayıt ol</Link>
            <Link to="/password-reset">Şifreni mi unuttun?</Link>
          </div>
        </GlassCard>
      </div>
    </SpaceBackground>
  );
};

export default LoginPage;
