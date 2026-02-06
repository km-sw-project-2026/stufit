function ChallengeDetailModal({ onClose, challenge }) {
  // challenge props가 없으면 기본값 사용
  const title = challenge?.title || '챌린지';
  const description = challenge?.description || '';
  const goal = challenge?.goal || '';
  const endDate = challenge?.end_date || '';
  const maxMembers = challenge?.max_members || 1;
  const category = challenge?.category || '';

  // 카테고리 한글 변환
  const getCategoryName = (cat) => {
    const categoryMap = {
      'STUDY': '공부',
      'EXERCISE': '운동',
      'DAILY': '일상'
    };
    return categoryMap[cat] || cat;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const members = [
    { name: '김예선' },
    { name: '유태민' },
    { name: '이정민' },
    { name: '박현서' }
  ];

  const statusItems = [
    { name: '김예선', status: 'success', label: '인증 완료' },
    { name: '이정민', status: 'danger', label: '미제출' },
    { name: '이정민', status: 'danger', label: '미제출' },
    { name: '유태민', status: 'success', label: '인증 완료' },
    { name: '박현서', status: 'warning', label: '인증 실패' },
    { name: '박현서', status: 'warning', label: '인증 실패' }
  ];

  return (
    <div className="modal">
      <div className="detail-view-container">
        <div className="detail-sidebar">
          <h2>MEMBER</h2>
          <div className="member-list">
            {members.map((member, idx) => (
              <div key={idx} className="member-item">
                <div className="member-avatar">
                  <img src="img/Profile.png" alt="Profile" />
                </div>
                <span className="member-name">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-main">
          <button className="close-detail-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="detail-card">
            <h3>챌린지 정보</h3>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>제목:</strong> {title}</p>
              <p><strong>설명:</strong> {description}</p>
              <p><strong>카테고리:</strong> {getCategoryName(category)}</p>
              <p><strong>종료일:</strong> {formatDate(endDate)}</p>
              <p><strong>최대 인원:</strong> {maxMembers}명</p>
            </div>
          </div>

          <div className="detail-card">
            <h3>챌린지 진행도</h3>
            <div className="progress-area">
              <div className="progress-info">
                <span className="days-elapsed">0일 경과</span>
                <span className="percentage">50%</span>
                <span className="days-left">30일 남음</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>챌린지 목표</h3>
            <div className="goal-box">{goal}</div>
            <button className="submit-btn">제출하기</button>
          </div>

          <div className="detail-card status-card">
            <h3>참여 현황</h3>
            <div className="status-grid">
              {statusItems.map((item, idx) => (
                <div key={idx} className="status-item">
                  <div className="status-user">
                    <div className="status-avatar">
                      <img src="img/Profile.png" alt="Profile" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className={`status-label ${item.status}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-giveup">give up</button>
            <button className="btn-complete">complete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetailModal;
