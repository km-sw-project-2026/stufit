import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage({ isOpen, onClose }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // 로그인 정보 가져오기 (localStorage에서)
      const username = localStorage.getItem('username');
      
      if (username) {
        setUserData({
          username: username,
          score: '9,800',
          joinDate: localStorage.getItem('joinDate') || '2024년 7월 1일',
          rank: '1위',
          currentRank: '1위',
          challenges: '10개',
          points: '5,000',
          posts: '0개',
          comments: '0개',
          items: '0개'
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
              <div className="score-badge">
                <img src="/img/Challenger.png" alt="챌린저" className="score-icon" />
                <span className="score-value">{userData.score}</span>
                <span className="score-help">ⓘ</span>
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
                <span className="activity-label">댓글 {userData.posts}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">글쓰기 {userData.comments}</span>
              </div>
            </div>
          </div>
          <div className="activity-section">
            <h4>보유 중인 아이템</h4>
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
