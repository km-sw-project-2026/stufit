import { useState } from 'react';
import CustomAlertModal from './CustomAlertModal';

function CreateChallengeModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    // user: '',
    duration: '',
    category: '',
    goal: '',
    code: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [onAlertClose, setOnAlertClose] = useState(null);

  const showAlert = (message, closeHandler = null) => {
    setAlertMessage(message);
    setOnAlertClose(() => closeHandler);
  };

  const handleAlertClose = () => {
    if (typeof onAlertClose === 'function') {
      onAlertClose();
    }
    setAlertMessage('');
    setOnAlertClose(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('new-challenge-', '');
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    const durationNum = Number(formData.duration) || 0;
    let errorMessage = '';

    if (!formData.name) {
      errorMessage = '챌린지 이름을 입력해주세요.';
    } else if (!formData.category) {
      errorMessage = '카테고리를 선택해주세요.';
    } else if (!durationNum) {
      errorMessage = '기간을 올바르게 입력해주세요.';
    } else if (!formData.goal) {
      errorMessage = '목표를 입력해주세요.';
    }

    if (errorMessage) {
      showAlert(errorMessage);
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      showAlert('로그인이 필요합니다.');
      return;
    }

    // Compute endDate using duration-1 semantics so N일 입력 시 정확히 N일이 보이도록 함
    const start = new Date();
    const daysToAdd = Math.max(0, durationNum - 1);
    const endDateObj = new Date(start);
    endDateObj.setDate(start.getDate() + daysToAdd);
    const pad = (n) => String(n).padStart(2, '0');
    const endDateStr = `${endDateObj.getFullYear()}-${pad(endDateObj.getMonth() + 1)}-${pad(endDateObj.getDate())}`;

    // Send create request to server
    (async () => {
      try {
        const res = await fetch('/api/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) },
          body: JSON.stringify({
            challengeName: formData.name,
            category: formData.category.toUpperCase(),
            maxParticipants: 10,
            endDate: endDateStr,
            duration: durationNum,
            goalDescription: formData.goal,
            inviteCode: formData.code || null
          })
        });

        const json = await res.json();
        if (!res.ok) {
          showAlert(json.message || '챌린지 생성에 실패했습니다.');
          return;
        }

        showAlert('챌린지가 성공적으로 생성되었습니다!', onClose);
      } catch (e) {
        console.error('챌린지 생성 오류', e);
        showAlert('서버 오류가 발생했습니다.');
      }
    })();
  };

  return (
    <div className="popup-modal">
      <div className="popup-overlay"></div>
      <div className="popup-content">
        <div className="form-group">
          <label>챌린지 이름</label>
          <input
            type="text"
            id="new-challenge-name"
            placeholder="예: 기말고사 성적내기"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        {/* '내 이름' 입력 완전 제거 - 로그인된 사용자 이름 사용 */}
        <div className="form-row">
          <div className="form-group half">
            <label>기간 (일)</label>
            <input
              type="number"
              id="new-challenge-duration"
              placeholder="예: 30"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group half">
            <label>카테고리</label>
            <div className="select-wrapper">
              <select
                id="new-challenge-category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="" disabled>예: 공부</option>
                <option value="study">공부</option>
                <option value="exercise">운동</option>
                <option value="daily">일상</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
            value={formData.goal}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>코드 입력 (선택)</label>
          <input
            type="text"
            id="new-challenge-code"
            placeholder="예: KIM"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>
        <button className="start-challenge-btn" onClick={handleSubmit}>챌린지 시작하기</button>
      </div>
      {alertMessage && (
        <CustomAlertModal
          message={alertMessage}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
}

export default CreateChallengeModal;
