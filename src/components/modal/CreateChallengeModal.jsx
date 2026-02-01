
function CreateChallengeModal({ setCreateChallengeOpen, closeCreateChallengeModal }) {
    return (
        <div id="create-challenge-modal" className="popup-modal">
            <div className="popup-overlay"></div>
            <div className="popup-content">
                <div className="form-group">
                    <label>챌린지 이름</label>
                    <input type="text" id="new-challenge-name" placeholder="예: 기말고사 성적내기" />
                </div>
                <div className="form-group">
                    <label>내 이름</label>
                    <input type="text" id="new-challenge-user" placeholder="예: 김예선" />
                </div>
                <div className="form-row">
                    <div className="form-group half">
                        <label>기간 (일)</label>
                        <input type="number" id="new-challenge-duration" placeholder="예: 30" />
                    </div>
                    <div className="form-group half">
                        <label>카테고리</label>
                        <div className="select-wrapper">
                            <select id="new-challenge-category" defaultValue="">
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
                    <input type="text" id="new-challenge-goal" placeholder="예: 아침 6시 기상" />
                </div>
                <div className="form-group">
                    <label>코드 입력 (선택)</label>
                    <input type="text" id="new-challenge-code" placeholder="예: KIM" />
                </div>
                <button className="start-challenge-btn" onClick={closeCreateChallengeModal}>챌린지 시작하기</button>
            </div>
        </div>
    );
};
export default CreateChallengeModal;