import { useState } from 'react';

function OngoingChallengeModal({ onClose }) {
  const [searchCode, setSearchCode] = useState('');

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="ongoing-challenge-link">
          <a href="#">챌린지 전체보기 →</a>
        </div>
        <div className="modal-header-top">
          <div className="header-left">
            <h2>진행중인 챌린지</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <button className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="header-right">
            <button className="create-challenge-btn">챌린지 만들기</button>
          </div>
        </div>

        <div className="challenge-grid">
          {/* User created challenges will appear here */}
        </div>
      </div>
    </div>
  );
}

export default OngoingChallengeModal;
