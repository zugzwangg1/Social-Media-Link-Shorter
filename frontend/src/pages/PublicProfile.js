import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import './PublicProfile.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    incrementProfileView();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/${username}`);
      setProfile(response.data.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Profil bulunamadı' : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const incrementProfileView = async () => {
    try {
      await api.post(`/analytics/view/${username}`);
    } catch (err) {
      // Silently fail
    }
  };

  const handleLinkClick = async (linkId, url) => {
    try {
      await api.post(`/analytics/click/${linkId}`);
      window.open(url, '_blank');
    } catch (err) {
      // If analytics fails, still open the link
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SpaceBackground>
        <div className="error-container">
          <GlassCard>
            <h1 className="error-title">😕 {error}</h1>
            <p className="error-text">Aradığınız profil bulunamadı veya bir hata oluştu.</p>
          </GlassCard>
        </div>
      </SpaceBackground>
    );
  }

  const themeColor = profile?.user?.themeColor || '#6B46C1';

  return (
    <SpaceBackground>
      <div className="public-profile" style={{ '--theme-color': themeColor }}>
        <GlassCard className="profile-header">
          {profile?.user?.profilePicture && (
            <img 
              src={profile.user.profilePicture} 
              alt={profile.user.name || profile.user.username}
              className="profile-avatar"
            />
          )}
          <h1 className="profile-name">
            {profile?.user?.name || profile?.user?.username}
          </h1>
          <p className="profile-username">@{profile?.user?.username}</p>
          {profile?.user?.bio && (
            <p className="profile-bio">{profile.user.bio}</p>
          )}
          <div className="profile-stats">
            <span>👁️ {profile?.profileViews || 0} görüntülenme</span>
          </div>
        </GlassCard>

        <div className="links-container">
          {profile?.links && profile.links.length > 0 ? (
            profile.links.map((link) => (
              <button
                key={link._id}
                onClick={() => handleLinkClick(link._id, link.url)}
                className="link-button"
              >
                <span className="link-title">{link.title}</span>
                <span className="link-arrow">→</span>
              </button>
            ))
          ) : (
            <GlassCard>
              <p className="no-links">Henüz link eklenmemiş</p>
            </GlassCard>
          )}
        </div>

        <div className="powered-by">
          <p>🎄 Merry Christmas! Powered by Social Link Hub ❄️</p>
        </div>
      </div>
    </SpaceBackground>
  );
};

export default PublicProfile;
