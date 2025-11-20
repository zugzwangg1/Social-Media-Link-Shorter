import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpaceBackground from '../components/SpaceBackground';
import GlassCard from '../components/GlassCard';
import LinkManager from '../components/LinkManager';
import ProfileEditor from '../components/ProfileEditor';
import Analytics from '../components/Analytics';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('links');

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const viewPublicProfile = () => {
    window.open(`/${user.username}`, '_blank');
  };

  return (
    <SpaceBackground>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Hoş geldin, <span className="username-highlight">{user?.username}</span> 🎄
          </h1>
          <div className="dashboard-actions">
            <button onClick={viewPublicProfile} className="btn-secondary">
              Profilimi Görüntüle
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            🔗 Linklerim
          </button>
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profil
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 İstatistikler
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'links' && <LinkManager />}
          {activeTab === 'profile' && <ProfileEditor />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </SpaceBackground>
  );
};

export default Dashboard;
