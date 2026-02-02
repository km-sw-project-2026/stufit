import { useState } from 'react';

function ChallengeOverModal({ onClose }) {
  const [score, setScore] = useState('');
  const [showRanking, setShowRanking] = useState(false);

  const handleSubmitScore = () => {
    if (score) {
      setShowRanking(true);
    }
  };

  const rankingData = [
    { rank: 1, name: '김예선', score: 95 },
    { rank: 2, name: '유태민', score: 87 },
    { rank: 3, name: '박현서', score: 82 },
    { rank: 4, name: '이정민', score: 78 }
  ];

  return (
    <div className="popup-modal">
      <div className="popup-overlay"></div>
      <div className="popup-content challenge-over-content">
        <h2>Challenge Over</h2>

        {!showRanking && (
          <div id="challenge-over-score-view">
            <p className="subtitle">최종 점수입력</p>
            <div className="score-card">
              <p className="score-input-label">점수 입력하기</p>
              <input
                type="number"
                placeholder="예: 80"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <button className="confirm-score-btn" onClick={handleSubmitScore}>제출하기</button>
            </div>
          </div>
        )}

        {showRanking && (
          <div id="challenge-over-ranking-view">
            <p className="subtitle">최종순위</p>
            <div className="ranking-list">
              {rankingData.map((item) => (
                <div key={item.rank} className="ranking-item">
                  <span className="rank-badge">{item.rank}</span>
                  <span className="rank-name">{item.name}</span>
                  <span className="rank-score">{item.score}점</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="close-btn-wrapper position-top-right">
          <svg className="close-challenge-over-x" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose} style={{ cursor: 'pointer' }}>
            <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChallengeOverModal;
