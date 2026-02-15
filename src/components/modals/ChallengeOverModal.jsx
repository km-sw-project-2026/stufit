import { useEffect, useState } from 'react';

function ChallengeOverModal({
  isOpen,
  onClose,
  showScoreInput = false,
  onSubmitScore,
  rankingData = [],
  title = 'Challenge Over'
}) {
  const [score, setScore] = useState('');
  const [showRanking, setShowRanking] = useState(!showScoreInput);

  useEffect(() => {
    setShowRanking(!showScoreInput);
  }, [showScoreInput]);

  if (!isOpen) return null;

  const handleSubmitScore = async () => {
    if (!score) return;
    if (onSubmitScore) {
      const ok = await onSubmitScore(Number(score));
      if (!ok) return;
    }
    setShowRanking(true);
  };

  const handleClose = () => {
    console.log('[ChallengeOverModal] close');
    onClose?.();
  };

  return (
    <div className="popup-modal" onClick={handleClose}>
      <div className="popup-overlay"></div>
      <div className="popup-content challenge-over-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        {showScoreInput && !showRanking && (
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
              {rankingData.length === 0 ? (
                <div className="ranking-item">
                  <span className="name">혼자하는 챘린지는 점수와 포인트 제공이 제한 됩니다! (악용방지)</span>
                </div>
              ) : (
                rankingData.map((item) => {
                  console.log('[ChallengeOverModal] render item:', item);
                  return (
                    <div key={item.rank} className="ranking-item">
                      <span className="rank">{item.rank}</span>
                      <span className="name">{item.name}</span>
                      <div className="score-info">
                        <div className="score-group">
                          <span className="label">포인트</span>
                          <span className="value">
                            {item.points > 0 ? `+${item.points}` : `${item.points}`}
                          </span>
                        </div>
                        <div className="divider" />
                        <div className="score-group">
                          <span className="label">점수</span>
                          <span className="value">{item.score}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        <div className="close-btn-wrapper position-top-right" onClick={handleClose}>
          <svg className="close-challenge-over-x" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChallengeOverModal;
