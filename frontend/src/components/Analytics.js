import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import api from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data.data);
    } catch (err) {
      setError('İstatistikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <p className="loading-text">İstatistikler yükleniyor...</p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <p className="error-text">{error}</p>
      </GlassCard>
    );
  }

  return (
    <div className="analytics">
      <div className="stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">{analytics?.profileViews || 0}</div>
          <div className="stat-label">Profil Görüntüleme</div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-value">{analytics?.links?.length || 0}</div>
          <div className="stat-label">Toplam Link</div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">👆</div>
          <div className="stat-value">{analytics?.totalClicks || 0}</div>
          <div className="stat-label">Toplam Tıklama</div>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="section-title">Link İstatistikleri</h2>
        {analytics?.links && analytics.links.length > 0 ? (
          <div className="links-stats">
            {analytics.links.map((link) => (
              <div key={link.id} className="link-stat-item">
                <div className="link-stat-info">
                  <h3 className="link-stat-title">{link.title}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-stat-url">
                    {link.url}
                  </a>
                </div>
                <div className="link-stat-clicks">
                  <span className="clicks-number">{link.clicks}</span>
                  <span className="clicks-label">tıklama</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Henüz link eklemediniz.</p>
        )}
      </GlassCard>
    </div>
  );
};

export default Analytics;
