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

    const fetchStats = async () => {
      if (!userId) {
        // 로그인 안 된 경우 기본값 설정
        if (username) {
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
            items: '0개'
          });
        }
        return;
      }

      try {
        // 사용자 아이템 정보 가져오기
        const itemsResponse = await fetch(`/api/user/items?userId=${userId}`, {
          headers: { 'X-Username': username || '' },
        });
        const itemsData = await itemsResponse.json();
        const ownedCount = itemsData?.purchasedItems?.length || 0;

        // 초기 userData 설정 (아이템 개수 포함)
        setUserData({
          username: username || '',
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

        // 통계 정보 가져오기
        const response = await fetch(`/api/user/stats?userId=${userId}&t=${Date.now()}`, {
          headers: { 
            'X-Username': username || '',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          console.error('Stats fetch failed:', response.status, text);
          return;
        }

        const data = await response.json();

        if (data.success && data.stats) {
          const posts = data.stats.posts;
          const comments = data.stats.comments;
          const nextPoints = Number(data.stats.points) || 0;
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

    const applyActiveToUI = async () => {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');

      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`/api/user/items?userId=${userId}`, {
          headers: { 'X-Username': username || '' },
        });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to fetch active items:', data?.message);
          return;
        }

        const active = data?.activeItems || {};
        const frameItem = active.frame ? shopItems.find(s => s.id === Number(active.frame)) : null;
        const bgItem = active.bg ? shopItems.find(s => s.id === Number(active.bg)) : null;
        const imageItem = active.image ? shopItems.find(s => s.id === Number(active.image)) : null;

      // Apply background to header area only
      const headerBgEl = document.querySelector('.mypage-header .mypage-header-bg');
      if (headerBgEl) {
        if (bgItem && bgItem.image) {
          headerBgEl.style.backgroundImage = `url(${bgItem.image})`;
          headerBgEl.style.backgroundSize = 'cover';
          headerBgEl.style.backgroundPosition = 'center';
          headerBgEl.style.backgroundRepeat = 'no-repeat';
          headerBgEl.style.display = 'block';
        } else {
          headerBgEl.style.backgroundImage = '';
          headerBgEl.style.display = 'none';
        }
      }

      const profileImgEl = document.querySelector('.mypage-modal .profile-img img:not(.profile-frame-overlay)');
      if (profileImgEl) {
        if (imageItem && imageItem.image) profileImgEl.src = imageItem.image;
        else profileImgEl.src = '/img/Profile2.png';
        // ensure the profile image shows whole image
        try {
          profileImgEl.style.objectFit = 'contain';
          profileImgEl.style.width = profileImgEl.style.width || profileImgEl.width ? '' : '';
        } catch (e) {
          // ignore
        }
      }

      // frame overlay: place as absolute overlay inside .profile-img container
      const frameOverlay = document.querySelector('.mypage-modal .profile-frame-overlay');
      if (frameOverlay) {
        if (frameItem && frameItem.image) {
          // myPageScale 우선 사용, 없으면 기본 2.2
          const scale = frameItem.myPageScale || 2.2;
          
          frameOverlay.src = frameItem.image;
          frameOverlay.style.display = 'block';
          frameOverlay.style.position = 'absolute';
          frameOverlay.style.top = '0';
          frameOverlay.style.left = '0';
          const widthPct = (scale * 100).toFixed(2) + '%';
          const offsetPct = (scale - 1) / 2 * 100;
          const additionalOffsetY = frameItem.myPageOffsetY ?? 20;
          const additionalOffsetX = frameItem.myPageOffsetX ?? 0;
          const topOffset = offsetPct + additionalOffsetY;
          const leftOffset = offsetPct + additionalOffsetX;
          frameOverlay.style.width = widthPct;
          frameOverlay.style.height = widthPct;
          frameOverlay.style.left = `-${leftOffset.toFixed(2)}%`;
          frameOverlay.style.top = `-${topOffset.toFixed(2)}%`;
          frameOverlay.style.objectFit = 'contain';
          frameOverlay.style.pointerEvents = 'none';
          frameOverlay.style.zIndex = '1015';
          frameOverlay.style.transformOrigin = 'center center';
        } else {
          frameOverlay.style.display = 'none';
          frameOverlay.style.position = '';
          frameOverlay.style.left = '';
          frameOverlay.style.top = '';
          frameOverlay.style.width = '';
          frameOverlay.style.height = '';
          frameOverlay.style.zIndex = '';
        }
      }
      } catch (err) {
        console.error('Active items fetch error:', err);
      }
    };

    applyActiveToUI();

    const handleActiveEvent = () => applyActiveToUI();
    window.addEventListener('activeItemsUpdated', handleActiveEvent);
    return () => {
      window.removeEventListener('activeItemsUpdated', handleActiveEvent);
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
    const handleUserStatsChanged = (event) => {
      const detail = event?.detail || {};
      console.log('[MyPage] user-stats-changed received:', detail);
      const parseCount = (s) => {
        try { return Number(String(s).replace(/\D/g, '')) || 0; } catch { return 0; }
      };
      setUserData((prev) => {
        if (!prev) return prev;
        const prevPosts = parseCount(prev.posts);
        const prevComments = parseCount(prev.comments);
        const postsDelta = Number(detail.postsDelta || 0);
        const commentsDelta = Number(detail.commentsDelta || 0);
        const next = { ...prev, posts: `${Math.max(0, prevPosts + postsDelta)}개`, comments: `${Math.max(0, prevComments + commentsDelta)}개` };
        console.log('[MyPage] updated counts ->', next.posts, next.comments);
        return next;
      });
    };

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
    const handleStorageEventForStats = (e) => {
      try {
        if (!e || !e.key) return;
        if (e.key === 'mypage_posts_count' || e.key === 'mypage_comments_count') {
          const posts = Number(localStorage.getItem('mypage_posts_count') || '0');
          const comments = Number(localStorage.getItem('mypage_comments_count') || '0');
          setUserData((prev) => prev ? { ...prev, posts: `${posts}개`, comments: `${comments}개` } : prev);
        }
      } catch (err) {
        console.warn('storage handler error', err);
      }
    };
    window.addEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
    window.addEventListener('storage', handlePurchasedUpdated);
    window.addEventListener('user-stats-changed', handleUserStatsChanged);
    window.addEventListener('storage', handleStorageEventForStats);
    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdated);
      window.removeEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
      window.removeEventListener('storage', handlePurchasedUpdated);
      window.removeEventListener('user-stats-changed', handleUserStatsChanged);
      window.removeEventListener('storage', handleStorageEventForStats);
    };
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
          <div className="mypage-header-bg" />
          <div className="mypage-header-divider" />
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
