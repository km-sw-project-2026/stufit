import { useState } from 'react';

function EditChallengeModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    user: '',
    duration: '',
    category: '',
    goal: '',
    code: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('edit-challenge-', '');
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log('Challenge updated:', formData);
    onClose();
  };

  return (
    <div className="popup-modal">
      <div className="popup-overlay"></div>
      <div className="popup-content">
        <div className="form-group">
          <label>챌린지 이름</label>
          <input
            type="text"
            id="edit-challenge-name"
            placeholder="예: 기말고사 성적내기"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>내 이름</label>
          <input
            type="text"
            id="edit-challenge-user"
            placeholder="예: 김예선"
            value={formData.user}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group half">
            <label>기간 (일)</label>
            <input
              type="number"
              id="edit-challenge-duration"
              placeholder="30"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group half">
            <label>카테고리</label>
            <div className="select-wrapper">
              <select
                id="edit-challenge-category"
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
            id="edit-challenge-goal"
            placeholder="예: 아침 6시 기상"
            value={formData.goal}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>코드 입력 (선택)</label>
          <input
            type="text"
            id="edit-challenge-code"
            placeholder="예: KIM"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>
        <button className="update-challenge-btn start-challenge-btn" onClick={handleSubmit}>수정 완료하기</button>
      </div>
    </div>
  );
}

export default EditChallengeModal;
