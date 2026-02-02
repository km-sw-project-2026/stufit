function ChallengeDetailModal({ onClose }) {
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
            <div className="goal-box">아침 6시 기상</div>
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
