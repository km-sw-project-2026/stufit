import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopItems } from '../shopView/shopItems';

function MyPage({ isOpen, onClose }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const formatPoints = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return '0 P';
    }

    return `${numeric.toLocaleString('ko-KR')} P`;
  };

  const handleTierGuideClick = () => {
    onClose();
    navigate('/tier-guide');
  };

  const handleMyItemsClick = () => {
    onClose();
    navigate('/my-items');
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const cachedPoints = localStorage.getItem('points');

    if (username) {
      const computeOwnedCount = () => {
        try {
          const stored = localStorage.getItem('purchasedItems');
          if (!stored) return 0;
          const parsed = JSON.parse(stored);
          if (!parsed || typeof parsed !== 'object') return 0;
          return Object.keys(parsed).length;
        } catch (err) {
          console.error('purchasedItems 파싱 실패:', err);
          return 0;
        }
      };

      const ownedCount = computeOwnedCount();

      setUserData({
        username: username,
        score: '0',
        joinDate: localStorage.getItem('joinDate') || '2024년 7월 1일',
        rank: '1위',
        currentRank: '1위',
        challenges: '10개',
        points: cachedPoints ? Number(cachedPoints) : 0,
        posts: '0개',
        comments: '0개',
        items: `${ownedCount}개`
      });
    }

    const fetchStats = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`/api/user/stats?userId=${userId}`, {
          headers: { 'X-Username': username || '' },
        });
        const data = await response.json();

        if (!response.ok) {
          return;
        }

        if (data.success && data.stats) {
          const nextPoints = Number(data.stats.points) || 0;
          const posts = data.stats.posts;
          const comments = data.stats.comments;

          localStorage.setItem('points', String(nextPoints));
          
          setUserData((prev) => (prev ? { 
            ...prev, 
            points: nextPoints,
            posts: `${posts}개`,
            comments: `${comments}개`
          } : prev));
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchStats();
  }, [isOpen]);

  // activeItems: currently applied items (frame/bg/image)
  useEffect(() => {
    if (!isOpen) return;

    const readActive = () => {
      try {
        const stored = localStorage.getItem('activeItems');
        const parsed = stored ? JSON.parse(stored) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        return {};
      }
    };

    const applyActiveToUI = () => {
      const active = readActive();
      // set CSS or state via DOM updates below by setting attributes on body or storing in local state
      const frameItem = active.frame ? shopItems.find(s => s.id === Number(active.frame)) : null;
      const bgItem = active.bg ? shopItems.find(s => s.id === Number(active.bg)) : null;
      const imageItem = active.image ? shopItems.find(s => s.id === Number(active.image)) : null;

      // Apply background to modal by setting data attributes on modal element
      const modalEl = document.querySelector('.mypage-modal');
      if (modalEl) {
        if (bgItem && bgItem.image) {
          modalEl.style.backgroundImage = `url(${bgItem.image})`;
          modalEl.style.backgroundSize = 'cover';
          modalEl.style.backgroundPosition = 'center';
        } else {
          modalEl.style.backgroundImage = '';
        }
      }

      const profileImgEl = document.querySelector('.mypage-modal .profile-img img');
      if (profileImgEl) {
        if (imageItem && imageItem.image) profileImgEl.src = imageItem.image;
        else profileImgEl.src = '/img/Profile2.png';
      }

      // frame overlay
      const frameOverlay = document.querySelector('.mypage-modal .profile-frame-overlay');
      if (frameOverlay) {
        if (frameItem && frameItem.image) {
          frameOverlay.src = frameItem.image;
          frameOverlay.style.display = 'block';
        } else {
          frameOverlay.style.display = 'none';
        }
      }
    };

    applyActiveToUI();

    const handleActiveEvent = () => applyActiveToUI();
    window.addEventListener('activeItemsUpdated', handleActiveEvent);
    window.addEventListener('storage', handleActiveEvent);
    return () => {
      window.removeEventListener('activeItemsUpdated', handleActiveEvent);
      window.removeEventListener('storage', handleActiveEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointsUpdated = (event) => {
      const nextPoints = event?.detail?.points;
      if (typeof nextPoints === 'number') {
        localStorage.setItem('points', String(nextPoints));
        setUserData((prev) => (prev ? { ...prev, points: nextPoints } : prev));
      }
    };

    window.addEventListener('pointsUpdated', handlePointsUpdated);
    const handlePurchasedUpdated = () => {
      const stored = localStorage.getItem('purchasedItems');
      let count = 0;
      try {
        const parsed = JSON.parse(stored || '{}');
        if (parsed && typeof parsed === 'object') count = Object.keys(parsed).length;
      } catch {
        count = 0;
      }

      setUserData((prev) => (prev ? { ...prev, items: `${count}개` } : prev));
    };

    window.addEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
    window.addEventListener('storage', handlePurchasedUpdated);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdated);
    // cleanup additional listeners
    // (explicitly remove purchasedItemsUpdated and storage)
    window.removeEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
    window.removeEventListener('storage', handlePurchasedUpdated);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('joinDate');

      alert('로그아웃 되었습니다.');
      onClose();
      navigate('/');
      window.location.reload();
    } catch {
      alert('로그아웃 실패');
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mypage-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="mypage-header">
          <div className="profile-img">
            <img src="/img/Profile2.png" alt="프로필" />
            <img src="" alt="frame" className="profile-frame-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'none', pointerEvents: 'none' }} />
          </div>
          <div className="profile-info">
            <div className="profile-name-score">
              <h3>{userData.username}</h3>
              <div className="score-container">
                <img src="/img/Bronze.png" alt="브론즈" className="score-icon" />
                <div className="score-right-section">
                  <div className="score-bottom">
                    <span className="score-value">{userData.score}</span>
                    <button className="score-help-btn" title="점수 정보" onClick={handleTierGuideClick}>
                      <span>?</span>
                    </button>
                  </div>
                  <div className="score-progress-bar">
                    <div className="score-progress-fill" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="join-date">stufit에 {userData.joinDate} 가입</p>
          </div>
        </div>

        <div className="mypage-stats">
          <div className="stat-item">
            <div className="stat-label">최고 기록</div>
            <div className="stat-value">{userData.rank}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">현재 순위</div>
            <div className="stat-value">{userData.currentRank}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">성공한 챌린지</div>
            <div className="stat-value">{userData.challenges}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">나의 포인트</div>
            <div className="stat-value">{formatPoints(userData.points)}</div>
          </div>
        </div>

        <div className="mypage-activity">
          <div className="activity-section">
            <h4>커뮤니티에서의 활동</h4>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-label">글쓰기 {userData.posts}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">댓글 {userData.comments}</span>
              </div>
            </div>
          </div>
          <div className="activity-section">
            <h4 
              onClick={handleMyItemsClick}
              style={{ cursor: 'pointer', color: '#4CAF50' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              보유 중인 아이템 →
            </h4>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-label">총 {userData.items}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;
