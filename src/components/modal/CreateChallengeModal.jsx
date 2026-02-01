import { useState } from 'react';

function CreateChallengeModal({ setCreateChallengeOpen, closeCreateChallengeModal }) {
  const [challengeName, setChallengeName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const createChallenge = async () => {
    if (!challengeName || !category || !duration) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 🔹 오늘 날짜 기준으로 start / end 계산
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + Number(duration));

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeName,
          category,
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
          goalDescription,
          inviteCode,
        }),
      });   

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || '챌린지 생성에 실패했습니다.');
        return;
      }

      alert('챌린지가 성공적으로 생성되었습니다.');
      setCreateChallengeOpen(false);
      closeCreateChallengeModal();
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div id="create-challenge-modal" className="popup-modal">
      <div className="popup-overlay"></div>
      <div className="popup-content">
        <div className="form-group">
          <label>챌린지 이름</label>
          <input
            type="text"
            id="new-challenge-name"
            placeholder="예: 기말고사 성적내기"
            value={challengeName}
            onChange={(e) => setChallengeName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>내 이름</label>
          <input
            type="text"
            id="new-challenge-user"
            placeholder="예: 김예선"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>기간 (일)</label>
            <input
              type="number"
              id="new-challenge-duration"
              placeholder="예: 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group half">
            <label>카테고리</label>
            <div className="select-wrapper">
              <select
                id="new-challenge-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>예: 공부</option>
                <option value="STUDY">공부</option>
                <option value="EXERCISE">운동</option>
                <option value="DAILY">일상</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>목표</label>
          <input
            type="text"
            id="new-challenge-goal"
            placeholder="예: 아침 6시 기상"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>코드 입력 (선택)</label>
          <input
            type="text"
            id="new-challenge-code"
            placeholder="예: KIM"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        {/* ❗️여기가 핵심 수정 포인트 */}
        <button className="start-challenge-btn" onClick={createChallenge}>
          챌린지 시작하기
        </button>
      </div>
    </div>
  );
}

export default CreateChallengeModal;
