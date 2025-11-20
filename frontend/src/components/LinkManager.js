import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import api from '../services/api';
import './LinkManager.css';

const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/links');
      setLinks(response.data.data.links);
    } catch (err) {
      setError('Linkler yüklenemedi');
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/links', newLink);
      setLinks([...links, response.data.data.link]);
      setNewLink({ title: '', url: '' });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Link eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = async (id, updates) => {
    try {
      const response = await api.put(`/links/${id}`, updates);
      setLinks(links.map(link => link._id === id ? response.data.data.link : link));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Link güncellenemedi');
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Bu linki silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(link => link._id !== id));
    } catch (err) {
      setError('Link silinemedi');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await api.put(`/links/${id}/toggle`);
      setLinks(links.map(link => link._id === id ? response.data.data.link : link));
    } catch (err) {
      setError('Link durumu değiştirilemedi');
    }
  };

  return (
    <div className="link-manager">
      <GlassCard>
        <h2 className="section-title">Yeni Link Ekle</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleAddLink} className="add-link-form">
          <input
            type="text"
            placeholder="Link Başlığı (örn: Instagram)"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            required
            maxLength="100"
          />
          <input
            type="url"
            placeholder="URL (örn: https://instagram.com/kullaniciadi)"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            required
          />
          <button type="submit" className="btn-add" disabled={loading}>
            {loading ? 'Ekleniyor...' : '➕ Link Ekle'}
          </button>
        </form>
      </GlassCard>

      <div className="links-list">
        <h2 className="section-title">Linklerim ({links.length})</h2>
        {links.length === 0 ? (
          <GlassCard>
            <p className="empty-state">Henüz link eklemediniz. Yukarıdaki formu kullanarak ilk linkinizi ekleyin! 🎁</p>
          </GlassCard>
        ) : (
          links.map((link) => (
            <GlassCard key={link._id} className="link-item">
              {editingId === link._id ? (
                <div className="link-edit-form">
                  <input
                    type="text"
                    defaultValue={link.title}
                    onBlur={(e) => handleUpdateLink(link._id, { title: e.target.value })}
                  />
                  <input
                    type="url"
                    defaultValue={link.url}
                    onBlur={(e) => handleUpdateLink(link._id, { url: e.target.value })}
                  />
                  <button onClick={() => setEditingId(null)} className="btn-done">
                    ✓ Tamam
                  </button>
                </div>
              ) : (
                <>
                  <div className="link-info">
                    <h3 className="link-title">{link.title}</h3>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
                      {link.url}
                    </a>
                    <div className="link-stats">
                      <span>👁️ {link.clicks} tıklama</span>
                      <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                        {link.isActive ? '🟢 Aktif' : '🔴 Pasif'}
                      </span>
                    </div>
                  </div>
                  <div className="link-actions">
                    <button onClick={() => setEditingId(link._id)} className="btn-icon" title="Düzenle">
                      ✏️
                    </button>
                    <button onClick={() => handleToggleActive(link._id)} className="btn-icon" title="Aktif/Pasif">
                      {link.isActive ? '👁️' : '🚫'}
                    </button>
                    <button onClick={() => handleDeleteLink(link._id)} className="btn-icon btn-delete" title="Sil">
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkManager;
