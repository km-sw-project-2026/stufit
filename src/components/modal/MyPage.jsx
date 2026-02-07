import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage({ isOpen, onClose }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleTierGuideClick = () => {
    onClose();
    navigate('/tier-guide');
  };

  const handleMyItemsClick = () => {
    onClose();
    navigate('/my-items');
  };

  useEffect(() => {
    if (isOpen) {
      // 로그인 정보 가져오기 (localStorage에서)
      const username = localStorage.getItem('username');
      
      if (username) {
        // 작성한 게시글 수 계산
        let postCount = 0;
        try {
          const savedPosts = localStorage.getItem('communityPosts');
          if (savedPosts) {
            const posts = JSON.parse(savedPosts);
            // mypost 배열의 개수를 사용하거나, 모든 카테고리에서 사용자 게시글 찾기
            if (posts.mypost && Array.isArray(posts.mypost)) {
              postCount = posts.mypost.length;
            }
          }
        } catch (error) {
          console.error('게시글 개수 계산 실패:', error);
        }

        // 작성한 댓글 수 계산
        let commentCount = 0;
        try {
          // localStorage의 모든 키를 확인하여 comments_로 시작하는 것 찾기
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('comments_')) {
              const comments = JSON.parse(localStorage.getItem(key) || '[]');
              // 현재 사용자가 작성한 댓글만 카운트
              commentCount += comments.filter(c => c.author === username).length;
            }
          }
        } catch (error) {
          console.error('댓글 개수 계산 실패:', error);
        }

        setUserData({
          username: username,
          score: '9,800',
          joinDate: localStorage.getItem('joinDate') || '2024년 7월 1일',
          rank: '1위',
          currentRank: '1위',
          challenges: '10개',
          points: '5,000',
          posts: `${postCount}개`,
          comments: `${commentCount}개`,
          items: '7개'
        });
      }
    }
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
          </div>
          <div className="profile-info">
            <div className="profile-name-score">
              <h3>{userData.username}</h3>
              <div className="score-container">
                <img src="/img/Challenger.png" alt="챌린저" className="score-icon" />
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
            <div className="stat-value">{userData.points}</div>
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
