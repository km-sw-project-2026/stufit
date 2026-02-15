import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopItems } from '../shopView/shopItems';

function MyPage({ isOpen, onClose }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const getStoredUserId = () => {
    const rawUserId = localStorage.getItem('userId');
    const parsedUserId = Number(rawUserId);
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return null;
    }
    return parsedUserId;
  };

  const encodeUsernameHeader = (username) => {
    if (!username) return '';
    try {
      return encodeURIComponent(username);
    } catch {
      return username;
    }
  };

  const isStatsDebugEnabled = () => localStorage.getItem('debugMyPageStats') === '1';
  const debugStatsLog = (...args) => {
    if (!isStatsDebugEnabled()) return;
    console.info('[MyPageStatsDebug]', ...args);
  };

  const parseCountText = (value) => {
    const numeric = Number(String(value ?? '').replace(/[^0-9-]/g, ''));
    if (Number.isNaN(numeric)) return 0;
    return numeric;
  };

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

    const handlePointsUpdated = (event) => {
      const nextPoints = Number(event?.detail?.points);
      const nextScore = Number(event?.detail?.score);
      
      if (!Number.isNaN(nextPoints)) {
        localStorage.setItem('points', String(nextPoints));
      }
      if (!Number.isNaN(nextScore)) {
        localStorage.setItem('score', String(nextScore));
      }
      
      setUserData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (!Number.isNaN(nextPoints)) updated.points = nextPoints;
        if (!Number.isNaN(nextScore)) updated.score = nextScore;
        return updated;
      });
    };

    window.addEventListener('pointsUpdated', handlePointsUpdated);

    const username = localStorage.getItem('username');
    const userId = getStoredUserId();
    const cachedPoints = localStorage.getItem('points');
    const cachedScore = localStorage.getItem('score');

    const fetchStats = async () => {
      if (!userId && !username) {
        return;
      }

      // API 실패가 있어도 마이페이지는 열리도록 기본값을 먼저 세팅
      setUserData({
        username: username || '',
        score: cachedScore ? Number(cachedScore) : 0,
        joinDate: localStorage.getItem('joinDate') || '2024년 7월 1일',
        rank: '1위',
        currentRank: '1위',
        challenges: '10개',
        points: cachedPoints ? Number(cachedPoints) : 0,
        posts: '0개',
        comments: '0개',
        items: '0개'
      });

      try {
        // 사용자 아이템 정보 가져오기
        const itemsUrl = userId ? `/api/user/items?userId=${userId}` : '/api/user/items';
        const itemsResponse = await fetch(itemsUrl, {
          headers: { 'X-Username': encodeUsernameHeader(username) },
        });
        let itemsData = null;
        try {
          itemsData = await itemsResponse.json();
        } catch {
          itemsData = null;
        }
        const ownedCount = itemsData?.purchasedItems?.length || 0;

        // 초기 userData 설정 (아이템 개수 포함)
        setUserData({
          username: username || '',
          score: cachedScore ? Number(cachedScore) : 0,
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
        const statsParams = new URLSearchParams({ t: String(Date.now()) });
        if (userId) {
          statsParams.set('userId', String(userId));
        }

        const response = await fetch(`/api/user/stats?${statsParams.toString()}`, {
          headers: { 
            'X-Username': encodeUsernameHeader(username),
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
        debugStatsLog('initial stats request', {
          username,
          userId,
          url: `/api/user/stats?${statsParams.toString()}`,
          encodedUsername: encodeUsernameHeader(username),
          ok: response.ok,
          status: response.status,
        });
        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }
        debugStatsLog('initial stats response', data);

        if (!response.ok) {
          debugStatsLog('initial stats failed', { status: response.status, data });
          return;
        }

        if (data?.success && data?.stats) {
          const posts = data.stats.posts;
          const comments = data.stats.comments;
          const nextPoints = Number(data.stats.points) || 0;
          const nextScore = Number(data.stats.score) || 0;
          
          localStorage.setItem('points', String(nextPoints));
          localStorage.setItem('score', String(nextScore));

          setUserData((prev) => (prev ? {
            ...prev,
            points: nextPoints,
            score: nextScore,
            posts: `${posts}개`,
            comments: `${comments}개`
          } : prev));
        } else {
          debugStatsLog('initial stats missing payload', data);
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
        debugStatsLog('initial stats exception', err);
      }
    };

    fetchStats();

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdated);
    };
  }, [isOpen]);

  // activeItems: currently applied items (frame/bg/image)
  useEffect(() => {
    if (!isOpen) return;

    const applyActiveToUI = async () => {
      const userId = getStoredUserId();
      const username = localStorage.getItem('username');

      const applyFromActive = (active) => {
        const frameItem = active?.frame ? shopItems.find(s => s.id === Number(active.frame)) : null;
        const bgItem = active?.bg ? shopItems.find(s => s.id === Number(active.bg)) : null;
        const imageItem = active?.image ? shopItems.find(s => s.id === Number(active.image)) : null;

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
          profileImgEl.src = (imageItem?.image) ? imageItem.image : '/img/Profile2.png';
          profileImgEl.style.objectFit = 'contain';

          if (frameItem?.myPageImageFront) {
            profileImgEl.style.position = 'relative';
            profileImgEl.style.zIndex = '1020';
          } else {
            profileImgEl.style.position = '';
            profileImgEl.style.zIndex = '';
          }
        }

        const frameOverlay = document.querySelector('.mypage-modal .profile-frame-overlay');
        if (frameOverlay) {
          if (frameItem && frameItem.image) {
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
            frameOverlay.style.zIndex = frameItem.myPageImageFront ? '1005' : '1015';
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
      };

      if (!userId && !username) {
        return;
      }

      try {
        const itemsUrl = userId ? `/api/user/items?userId=${userId}` : '/api/user/items';
        const response = await fetch(itemsUrl, {
          headers: { 'X-Username': encodeUsernameHeader(username) },
        });
        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          console.error('Failed to fetch active items:', data?.message);
          return;
        }

        const active = data?.activeItems || {};
        applyFromActive(active);
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

    const refreshCommunityStats = (event) => {
      const userId = getStoredUserId();
      const username = localStorage.getItem('username');
      if (!userId && !username) return;

      const postsDelta = Number(event?.detail?.postsDelta || 0);
      const commentsDelta = Number(event?.detail?.commentsDelta || 0);
      if (postsDelta || commentsDelta) {
        setUserData((prev) => {
          if (!prev) return prev;
          const prevPosts = parseCountText(prev.posts);
          const prevComments = parseCountText(prev.comments);
          const nextPosts = Math.max(0, prevPosts + postsDelta);
          const nextComments = Math.max(0, prevComments + commentsDelta);
          return {
            ...prev,
            posts: `${nextPosts}개`,
            comments: `${nextComments}개`
          };
        });
      }

      const statsParams = new URLSearchParams({ t: String(Date.now()) });
      if (userId) {
        statsParams.set('userId', String(userId));
      }

      fetch(`/api/user/stats?${statsParams.toString()}`, {
        headers: {
          'X-Username': encodeUsernameHeader(username),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      })
        .then((response) => {
          debugStatsLog('event stats request', {
            username,
            userId,
            url: `/api/user/stats?${statsParams.toString()}`,
            encodedUsername: encodeUsernameHeader(username),
            ok: response.ok,
            status: response.status,
          });
          return response.json().then((data) => ({ ok: response.ok, status: response.status, data })).catch(() => ({ ok: response.ok, status: response.status, data: null }));
        })
        .then(({ ok, status, data }) => {
          debugStatsLog('event stats response', { ok, status, data });
          if (!ok || !data?.success || !data?.stats) return;
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
        })
        .catch((err) => {
          debugStatsLog('event stats exception', err);
        });
    };

    const handlePointsUpdated = (event) => {
      const nextPoints = event?.detail?.points;
      if (typeof nextPoints === 'number') {
        localStorage.setItem('points', String(nextPoints));
        setUserData((prev) => (prev ? { ...prev, points: nextPoints } : prev));
      }
    };

    window.addEventListener('pointsUpdated', handlePointsUpdated);
    const handlePurchasedUpdated = () => {
      const userId = getStoredUserId();
      const username = localStorage.getItem('username');
      if (!userId && !username) return;

      const itemsUrl = userId ? `/api/user/items?userId=${userId}` : '/api/user/items';

      fetch(itemsUrl, {
        headers: { 'X-Username': encodeUsernameHeader(username) },
      })
        .then((response) => response.json().then((data) => ({ ok: response.ok, data })).catch(() => ({ ok: response.ok, data: null })))
        .then(({ ok, data }) => {
          if (!ok) return;
          const count = data?.purchasedItems?.length || 0;
          setUserData((prev) => (prev ? { ...prev, items: `${count}개` } : prev));
        })
        .catch(() => {});
    };

    window.addEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
    window.addEventListener('storage', handlePurchasedUpdated);
    window.addEventListener('communityActivityUpdated', refreshCommunityStats);
    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdated);
      window.removeEventListener('purchasedItemsUpdated', handlePurchasedUpdated);
      window.removeEventListener('storage', handlePurchasedUpdated);
      window.removeEventListener('communityActivityUpdated', refreshCommunityStats);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const clearClientSession = () => {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('joinDate');
      localStorage.removeItem('points');
      localStorage.removeItem('purchasedItems');
      window.dispatchEvent(new Event('loginStatusChanged'));
      window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: 0 } }));
    };

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        }
      });
    } catch {
      // ignore network/server logout failure and continue with client logout
    }

    clearClientSession();
    alert('로그아웃 되었습니다.');
    onClose();
    navigate('/');
    window.location.reload();
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



