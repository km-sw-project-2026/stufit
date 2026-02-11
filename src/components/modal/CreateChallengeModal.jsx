import { useState } from 'react';

function CreateChallengeModal({ setCreateChallengeOpen, closeCreateChallengeModal, onCreateSuccess }) {
  const [challengeName, setChallengeName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [timerHours, setTimerHours] = useState('');
  const [timerMinutes, setTimerMinutes] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const createChallenge = async () => {
    // inviteCode는 선택사항으로 변경
    if (!challengeName || !category || !duration || !goalDescription) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 공부, 운동 카테고리는 타이머 필수
    if ((category === 'STUDY' || category === 'EXERCISE') && (!timerHours || !timerMinutes)) {
      alert('공부/운동 카테고리는 타이머 시간을 설정해주세요.');
      return;
    }

    // 로그인한 사용자 확인
    const username = localStorage.getItem('username');
    if (!username) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 오늘 날짜 기준으로 종료일 계산
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(duration));

    try {
      const normalizedInviteCode = inviteCode.trim();

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Username': encodeURIComponent(username)
        },
        body: JSON.stringify({
          challengeName,
          category,
          maxParticipants: 10, // 기본값
          endDate: endDate.toISOString().slice(0, 10),
          goalDescription,
          inviteCode: normalizedInviteCode || null,
          timerHours: category === 'STUDY' || category === 'EXERCISE' ? Number(timerHours) : null,
          timerMinutes: category === 'STUDY' || category === 'EXERCISE' ? Number(timerMinutes) : null
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || '챌린지 생성에 실패했습니다.');
        return;
      }

      alert('챌린지가 성공적으로 생성되었습니다!');
      // 자동 참가 반영: 생성 성공 시 최신 멤버 목록을 받아와 이벤트로 알림
      try {
        const createdId = result?.data?.challengeId || (result?.data?.challenge && result.data.challenge.challenge_id);
        if (createdId) {
          // fetch members to include in event so detail view doesn't get cleared
          try {
            const membersRes = await fetch(`/api/challenges/${createdId}/members`, { headers: { 'X-Username': username } });
            if (membersRes.ok) {
              const payload = await membersRes.json();
              window.dispatchEvent(new CustomEvent('challenge-joined', { detail: { challengeId: createdId, members: payload.members || [] } }));
            } else {
              window.dispatchEvent(new CustomEvent('challenge-joined', { detail: { challengeId: createdId } }));
            }
          } catch (e) {
            window.dispatchEvent(new CustomEvent('challenge-joined', { detail: { challengeId: createdId } }));
          }
        }
      } catch (e) {
        // ignore
      }

      if (onCreateSuccess) onCreateSuccess(result?.data?.challenge || null);
      closeCreateChallengeModal();
    } catch (error) {
      console.error('챌린지 생성 오류:', error);
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


        {/* Removed ‘내 이름’ input — username is taken from localStorage on submit */}
{/* 
        <div className="form-group">
          <label>내 이름</label>
          <input
            type="text"
            id="new-challenge-user"
            placeholder="예: 김예선"
          />
        </div> */}

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

        {(category === 'STUDY' || category === 'EXERCISE') && (
          <div className="form-row">
            <div className="form-group half">
              <label>타이머 시간</label>
              <input
                type="number"
                id="timer-hours"
                placeholder="예: 1"
                min="0"
                value={timerHours}
                onChange={(e) => setTimerHours(e.target.value)}
              />
            </div>

            <div className="form-group half">
              <label>타이머 분</label>
              <input
                type="number"
                id="timer-minutes"
                placeholder="예: 30"
                min="0"
                max="59"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
              />
            </div>
          </div>
        )}

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
