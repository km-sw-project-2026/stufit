import React, { useEffect, useMemo, useState } from 'react';
import { shopItems } from '../shopView/shopItems';
import { getTierProgress } from '../../constants/tiers';

function UserProfilePreviewModal({ isOpen, onClose, userId, username, anchorPosition }) {
  const [activeItems, setActiveItems] = useState({ image: null, frame: null, bg: null });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || (!userId && !username)) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const viewerUsername = localStorage.getItem('username') || '';
        let resolvedUserId = Number(userId) || null;

        if (!resolvedUserId && username) {
          const usersRes = await fetch('/api/users');
          const usersPayload = await usersRes.json().catch(() => ({}));
          const matched = Array.isArray(usersPayload?.users)
            ? usersPayload.users.find((user) => String(user?.username || '') === String(username))
            : null;
          const candidateId = Number(matched?.userId ?? matched?.user_id);
          if (candidateId && !Number.isNaN(candidateId)) {
            resolvedUserId = candidateId;
          }
        }

        if (!resolvedUserId) {
          setUserData({
            username: username || '알 수 없는 사용자',
            score: 0,
            points: 0,
            posts: 0,
            comments: 0,
            joinDate: '-',
            items: 0,
            challenges: '0개',
            currentRank: '-',
            rank: '-',
          });
          setActiveItems({ image: null, frame: null, bg: null });
          return;
        }

        const [itemsRes, statsRes, usersRes] = await Promise.all([
          fetch(`/api/user/items?userId=${resolvedUserId}`, {
            headers: { 'X-Username': encodeURIComponent(viewerUsername) }
          }),
          fetch(`/api/user/stats?userId=${resolvedUserId}&t=${Date.now()}`, {
            headers: { 'X-Username': encodeURIComponent(viewerUsername) }
          }),
          fetch('/api/users')
        ]);

        const itemsPayload = await itemsRes.json().catch(() => ({}));
        const statsPayload = await statsRes.json().catch(() => ({}));
        const usersPayload = await usersRes.json().catch(() => ({}));

        setActiveItems(itemsPayload?.activeItems || { image: null, frame: null, bg: null });

        const score = Number(statsPayload?.stats?.score) || 0;
        const points = Number(statsPayload?.stats?.points) || 0;
        const posts = Number(statsPayload?.stats?.posts) || 0;
        const comments = Number(statsPayload?.stats?.comments) || 0;
        const completedChallenges = Number(statsPayload?.stats?.completedChallenges) || 0;
        const itemCount = Array.isArray(itemsPayload?.purchasedItems) ? itemsPayload.purchasedItems.length : 0;
        const rawJoinDate = statsPayload?.stats?.joinDate;

        const joinDate = rawJoinDate
          ? (() => {
              const date = new Date(rawJoinDate);
              if (Number.isNaN(date.getTime())) return '-';
              return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            })()
          : '-';

        const rankedUsers = Array.isArray(usersPayload?.users)
          ? usersPayload.users
              .map((user) => ({
                userId: Number(user?.userId ?? user?.user_id) || null,
                username: user?.username || '',
                score: Number(user?.score) || 0
              }))
              .sort((a, b) => b.score - a.score)
          : [];

        const rankIndex = rankedUsers.findIndex((user) => Number(user.userId) === Number(resolvedUserId));
        const currentRank = rankIndex >= 0 ? `${rankIndex + 1}위` : '-';

        setUserData({
          username: username || rankedUsers[rankIndex]?.username || '알 수 없는 사용자',
          score,
          points,
          posts,
          comments,
          joinDate,
          items: itemCount,
          challenges: `${completedChallenges}개`,
          currentRank,
          rank: currentRank,
        });
      } catch (error) {
        console.warn('[UserProfilePreviewModal] profile fetch error:', error);
        setActiveItems({ image: null, frame: null, bg: null });
        setUserData({
          username: username || '알 수 없는 사용자',
          score: 0,
          points: 0,
          posts: 0,
          comments: 0,
          joinDate: '-',
          items: 0,
          challenges: '0개',
          currentRank: '-',
          rank: '-',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId, username]);

  const bgItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.bg)), [activeItems]);
  const frameItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.frame)), [activeItems]);
  const imageItem = useMemo(() => shopItems.find((item) => item.id === Number(activeItems?.image)), [activeItems]);

  const scoreValue = Number(userData?.score) || 0;
  const { currentTier, progressPercent } = getTierProgress(scoreValue);

  const frameScale = frameItem?.myPageScale || 2.2;
  const frameWidth = `${(frameScale * 100).toFixed(2)}%`;
  const frameOffsetPct = ((frameScale - 1) / 2) * 100;
  const frameTopOffset = frameOffsetPct + (frameItem?.myPageOffsetY ?? 20);
  const frameLeftOffset = frameOffsetPct + (frameItem?.myPageOffsetX ?? 0);

  const formatPoints = (value) => `${(Number(value) || 0).toLocaleString('ko-KR')} P`;

  const modalPositionStyle = useMemo(() => {
    if (!anchorPosition) return {};
    const modalWidth = 550;
    const margin = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const leftBase = Math.round(anchorPosition.right + margin);
    const left = Math.max(16, Math.min(leftBase, viewportWidth - modalWidth - 16));
    const topBase = Math.round(anchorPosition.top);
    const top = Math.max(16, Math.min(topBase, viewportHeight - 120));
    return {
      left: `${left}px`,
      top: `${top}px`,
      transform: 'none',
    };
  }, [anchorPosition]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mypage-modal" onClick={(event) => event.stopPropagation()} style={modalPositionStyle}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <div className="mypage-header">
          <div
            className="mypage-header-bg"
            style={{
              display: bgItem?.image ? 'block' : 'none',
              backgroundImage: bgItem?.image ? `url(${bgItem.image})` : 'none',
            }}
          />
          <div className="mypage-header-divider" />
          <div className="profile-img">
            <img
              src={imageItem?.image || '/img/Profile2.png'}
              alt="프로필"
              style={{
                position: frameItem?.myPageImageFront ? 'relative' : undefined,
                zIndex: frameItem?.myPageImageFront ? 1020 : undefined,
              }}
            />
            {frameItem?.image && (
              <img
                src={frameItem.image}
                alt="frame"
                className="profile-frame-overlay"
                style={{
                  position: 'absolute',
                  display: 'block',
                  objectFit: 'contain',
                  transformOrigin: 'center center',
                  width: frameWidth,
                  height: frameWidth,
                  left: `-${frameLeftOffset.toFixed(2)}%`,
                  top: `-${frameTopOffset.toFixed(2)}%`,
                  zIndex: frameItem?.myPageImageFront ? 1005 : 1015,
                }}
              />
            )}
          </div>

          <div className="profile-info">
            <div className="profile-name-score">
              <h3>{userData?.username || username || '알 수 없는 사용자'}</h3>
              <div className="score-container">
                <img src={currentTier.image} alt={currentTier.name} className="score-icon" title={currentTier.name} />
                <div className="score-right-section">
                  <div className="score-bottom">
                    <span className="score-value">{scoreValue}</span>
                  </div>
                  <div className="score-progress-bar">
                    <div
                      className="score-progress-fill"
                      style={{ width: `${progressPercent}%`, backgroundColor: currentTier.progressColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="join-date">stufit에 {userData?.joinDate || '-'} 가입</p>
          </div>
        </div>

        <div className="mypage-stats">
          <div className="stat-item">
            <div className="stat-label">최고 기록</div>
            <div className="stat-value">{userData?.rank || '-'}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">현재 순위</div>
            <div className="stat-value">{userData?.currentRank || '-'}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">성공한 챌린지</div>
            <div className="stat-value">{userData?.challenges || '0개'}</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-label">나의 포인트</div>
            <div className="stat-value">{formatPoints(userData?.points)}</div>
          </div>
        </div>

        <div className="mypage-activity">
          <div className="activity-section">
            <h4>커뮤니티에서의 활동</h4>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-label">글쓰기 {userData?.posts ?? 0}개</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">댓글 {userData?.comments ?? 0}개</span>
              </div>
            </div>
          </div>
          <div className="activity-section">
            <h4>보유 중인 아이템</h4>
            <div className="activity-stats">
              <div className="activity-item">
                <span className="activity-label">총 {userData?.items ?? 0}개</span>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ marginTop: '10px', color: '#666', fontSize: '13px', textAlign: 'center' }}>
            불러오는 중...
          </div>
        )}

        <button className="logout-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default UserProfilePreviewModal;
