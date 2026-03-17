import { useEffect, useState } from 'react';
import ChallengeDetailModal from './ChallengeDetailModal';

function ChallengeOverModal({
  isOpen,
  onClose,
  showScoreInput = false,
  onSubmitScore,
  rankingData = [],
  hasTie = false,
  tiedPlayers = [],
  challengeId,
  onStartMiniGame,
  challenge = null,
}) {
  const [scoreInput, setScoreInput] = useState('');
  const [showRanking, setShowRanking] = useState(false);
  const [showChallengeDetail, setShowChallengeDetail] = useState(false);

  useEffect(() => {
    if (isOpen && !showScoreInput) {
      setShowRanking(true);
    } else if (isOpen && showScoreInput) {
      setShowRanking(false);
      setScoreInput('');
    }
  }, [isOpen, showScoreInput]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleSubmitScore = async () => {
    const score = Number(scoreInput);
    if (!scoreInput || isNaN(score) || score < 0) {
      alert('올바른 점수를 입력해주세요.');
      return;
    }

    const success = await onSubmitScore?.(score);
    if (success) {
      setShowRanking(true);
    }
  };

  const handleStartMiniGame = async () => {
    setShowChallengeDetail(true);
  };

  return (
    <div className="popup-modal" onClick={handleClose}>
      <div className="popup-overlay"></div>
      <div className="popup-content challenge-over-content" onClick={(e) => e.stopPropagation()}>
        <h2>Challenge Over</h2>

        {/* 점수 입력 화면 (공부 챌린지) */}
        {showScoreInput && !showRanking && (
          <div id="challenge-over-score-view">
            <p className="subtitle">최종 점수입력</p>
            <div className="score-card">
              <p className="score-input-label">점수 입력하기</p>
              <input
                type="number"
                id="challenge-score-input"
                placeholder="예: 100"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitScore();
                  }
                }}
              />
              <button className="confirm-score-btn" onClick={handleSubmitScore}>
                제출하기
              </button>
            </div>
          </div>
        )}

        {/* 랭킹 화면 */}
        {showRanking && (
          <div id="challenge-over-ranking-view">
            <p className="subtitle">최종순위</p>
            <div className="ranking-list">
              {rankingData.map((item, idx) => (
                (() => {
                  const displayScore = item?.submittedScore ?? item?.score;
                  return (
                <div key={idx} className="ranking-item">
                  <span className="rank">{item.rank}위</span>
                  <span className="name">{item.name}</span>
                  <span className="points">{item.points > 0 ? '+' : ''}{item.points}P</span>
                  <span className="score">점수: {displayScore}</span>
                </div>
                  );
                })()
              ))}
            </div>

            {/* 동점자가 있는 경우 챌린지 상세 버튼 */}
            {hasTie && tiedPlayers.length > 0 && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ marginBottom: '10px', color: '#666' }}>
                  동점자가 있습니다! 챌린지에 참여해 주세요.
                </p>
                <button
                  className="confirm-score-btn"
                  onClick={handleStartMiniGame}
                >
                  참여하기
                </button>
              </div>
            )}
          </div>
        )}

        {showChallengeDetail && challenge && (
          <ChallengeDetailModal
            challenge={challenge}
            onClose={() => setShowChallengeDetail(false)}
          />
        )}

        <div className="close-btn-wrapper position-top-right">
          <svg
            className="close-challenge-over-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClose}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChallengeOverModal;

