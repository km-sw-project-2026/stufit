import React, { useEffect, useMemo, useState } from 'react';
import { shopItems } from '../shopView/shopItems';

function UserProfilePreviewModal({ isOpen, onClose, userId, username }) {
  const [activeItems, setActiveItems] = useState({ image: null, frame: null, bg: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const viewerUsername = localStorage.getItem('username') || '';
        const response = await fetch(`/api/user/items?userId=${userId}`, {
          headers: { 'X-Username': viewerUsername }
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          console.warn('[UserProfilePreviewModal] profile fetch failed:', payload?.message || response.status);
          setActiveItems({ image: null, frame: null, bg: null });
          return;
        }

        setActiveItems(payload?.activeItems || { image: null, frame: null, bg: null });
      } catch (error) {
        console.warn('[UserProfilePreviewModal] profile fetch error:', error);
        setActiveItems({ image: null, frame: null, bg: null });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId]);

  const bgItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.bg)), [activeItems]);
  const frameItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.frame)), [activeItems]);
  const imageItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.image)), [activeItems]);

  if (!isOpen) return null;

  return (
    <div className="popup-modal" onClick={onClose}>
      <div className="popup-overlay" />
      <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ width: '320px', maxWidth: '92vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>프로필</h3>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div
          style={{
            borderRadius: '14px',
            padding: '16px',
            backgroundColor: '#f7f7f7',
            backgroundImage: bgItem?.image ? `url(${bgItem.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid #e5e5e5'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  border: '1px solid #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {imageItem?.image ? (
                  <img src={imageItem.image} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src="/img/Profile.png" alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {frameItem?.image && (
                <img
                  src={frameItem.image}
                  alt="frame"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: 'scale(1.2)',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', fontWeight: 700, color: '#222', fontSize: '16px' }}>
            {username || '알 수 없는 사용자'}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginTop: '6px' }}>
              불러오는 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePreviewModal;
