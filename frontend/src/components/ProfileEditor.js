import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from './GlassCard';
import api from '../services/api';
import './ProfileEditor.css';

const ProfileEditor = () => {
  const { user, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    username: user?.username || '',
    themeColor: user?.themeColor || '#6B46C1'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.put('/profile', {
        name: formData.name,
        bio: formData.bio
      });
      setMessage('Profil güncellendi! ✨');
      checkAuth();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.put('/profile/username', { username: formData.username });
      setMessage('Kullanıcı adı güncellendi! 🎉');
      checkAuth();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Kullanıcı adı güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.put('/profile/theme', { color: formData.themeColor });
      setMessage('Tema rengi güncellendi! 🎨');
      checkAuth();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Tema güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Profil resmi güncellendi! 📸');
      checkAuth();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Resim yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-editor">
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <GlassCard>
        <h2 className="section-title">Profil Bilgileri</h2>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">İsim</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Adınız Soyadınız"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Kendiniz hakkında kısa bir açıklama..."
              maxLength="200"
              rows="4"
            />
            <small>{formData.bio.length}/200 karakter</small>
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Kaydediliyor...' : '💾 Profili Kaydet'}
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="section-title">Profil Resmi</h2>
        <div className="profile-picture-section">
          {user?.profilePicture && (
            <img src={user.profilePicture} alt="Profile" className="profile-picture-preview" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file-input"
            id="profile-picture"
          />
          <label htmlFor="profile-picture" className="btn-upload">
            📸 Resim Yükle
          </label>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="section-title">Kullanıcı Adı</h2>
        <form onSubmit={handleUsernameUpdate} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="kullaniciadi"
              pattern="[a-z0-9_-]+"
              title="Sadece küçük harf, rakam, tire ve alt çizgi"
              required
            />
            <small>Profil URL'iniz: /{formData.username}</small>
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Güncelleniyor...' : '🔄 Kullanıcı Adını Güncelle'}
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="section-title">Tema Rengi</h2>
        <form onSubmit={handleThemeUpdate} className="profile-form">
          <div className="form-group">
            <label htmlFor="themeColor">Tema Rengi</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                id="themeColor"
                name="themeColor"
                value={formData.themeColor}
                onChange={handleChange}
                className="color-picker"
              />
              <input
                type="text"
                value={formData.themeColor}
                onChange={handleChange}
                name="themeColor"
                placeholder="#6B46C1"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="color-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Kaydediliyor...' : '🎨 Tema Rengini Kaydet'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfileEditor;
