import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChallengeOverModal({
  isOpen,
  onClose,
  showScoreInput = false,
  onSubmitScore,
  rankingData = [],
  title = 'Challenge Over',
  hasTie = false,
  tiedPlayers = [],
  challengeId = null,
  onStartMiniGame = null,
}) {
  const [score, setScore] = useState('');
  const [showRanking, setShowRanking] = useState(!showScoreInput);
  const [miniGameCreating, setMiniGameCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowRanking(!showScoreInput);
  }, [showScoreInput]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      window.dispatchEvent(new CustomEvent('challengeCompleted', { detail: { delta: 1 } }));
    } catch (err) {
      console.warn('[ChallengeOverModal] failed to dispatch challengeCompleted', err);
    }
  }, [isOpen]);

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

  // 미니게임 세션 생성 후 이동
  // - 방장: 세션 생성 후 이동
  // - 비방장: 세션 생성 실패(403)를 무시하고 바로 이동 (세션은 방장이 만듦)
  const handleJoinMiniGame = async () => {
    if (!challengeId || tiedPlayers.length < 2) return;
    setMiniGameCreating(true);
    try {
      if (onStartMiniGame) {
        await onStartMiniGame(tiedPlayers);
      }
    } catch (err) {
      // 방장이 아니거나 세션이 이미 존재하는 경우 등은 무시하고 페이지로 이동
      console.warn('[handleJoinMiniGame] session create skipped:', err?.message || err);
    } finally {
      setMiniGameCreating(false);
    }
    navigate(`/challenge/${challengeId}/minigame`);
  };

  const winnerTakeAllApplied =
    Array.isArray(rankingData) &&
    rankingData.length > 1 &&
    Number(rankingData?.[0]?.points || 0) > 0 &&
    rankingData.slice(1).every((entry) => Number(entry?.points || 0) === 0);

  return (
    <div className="popup-modal" onClick={handleClose}>
      <div className="popup-overlay"></div>
      <div className="popup-content challenge-over-content" onClick={(e) => e.stopPropagation()}>
        {/* ──── 동점자 미니게임 안내 뷰 ──── */}
        {hasTie && (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <img src="/img/logo.png" alt="stufit" style={{ height: '120px', marginBottom: '14px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d3d28', margin: '0 0 14px' }}>
              챌린지 최종 순위 안내
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.8, margin: '0 0 8px' }}>
              현재 동점자가 발생했습니다.<br />
              최종 순위는 미니게임을 통해 다시 결정됩니다.<br />
              대상자는&nbsp;<span
                style={{ color: '#1d8c66', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleJoinMiniGame}
              >미니게임</span>에 참여해 주세요.
            </p>
            <p style={{ fontSize: '0.92rem', color: '#aaa', margin: '0 0 20px' }}>
              미니게임은 끝말잇기 게임입니다
            </p>
            <button
              onClick={handleJoinMiniGame}
              disabled={miniGameCreating}
              style={{
                background: miniGameCreating ? '#a0c8b0' : 'linear-gradient(135deg,#1d8c66,#247b7b)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                padding: '12px 40px',
                cursor: miniGameCreating ? 'not-allowed' : 'pointer',
                width: '100%',
              }}
            >
              {miniGameCreating ? '생성 중...' : '참여하기'}
            </button>
          </div>
        )}

        {!hasTie && <h2>{title}</h2>}

        {showScoreInput && !showRanking && !hasTie && (
          <div id="challenge-over-score-view">
            <p className="subtitle">최종 점수입력</p>
            <div className="score-card">
              <p className="score-input-label">점수 입력하기</p>
              <input
                type="number"
                placeholder="예: 100"
                value={score}
                min="0"
                max="999"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) >= 0 && Number(val) <= 999)) {
                    setScore(val);
                  }
                }}
              />
              <button className="confirm-score-btn" onClick={handleSubmitScore}>제출하기</button>
            </div>
          </div>
        )}

        {showRanking && !hasTie && (
          <div id="challenge-over-ranking-view">
            <p className="subtitle">최종순위</p>
            {winnerTakeAllApplied && (
              <p className="subtitle" style={{ marginTop: '-6px', color: '#247b7b', fontWeight: 700 }}>
                베팅 포인트 몰빵 적용
              </p>
            )}
            <div className="ranking-list">
              {rankingData.length === 0 ? (
                <div className="ranking-item">
                  <span className="name">챌린지에 참여한 사용자가 없습니다.</span>
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
                            {winnerTakeAllApplied && item.rank === 1 ? ' (몰빵)' : ''}
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
