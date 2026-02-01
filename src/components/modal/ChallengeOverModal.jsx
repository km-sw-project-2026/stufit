function ChallengeOverModal() {
    return (
        <div id="challenge-over-modal" className="popup-modal hidden">
            <div className="popup-overlay"></div>
            <div className="popup-content challenge-over-content">
                <h2>Challenge Over</h2>

                <div id="challenge-over-score-view">
                    <p className="subtitle">최종 점수입력</p>
                    <div className="score-card">
                        <p className="score-input-label">점수 입력하기</p>
                        <input type="number" id="challenge-score-input" placeholder="예: 80" />
                        <button className="confirm-score-btn">제출하기</button>
                    </div>
                </div>

                <div id="challenge-over-ranking-view" className="hidden">
                    <p className="subtitle">최종순위</p>
                    <div className="ranking-list">
                        {/* <!-- Dynamic Content --> */}
                    </div>
                </div>

                <div className="close-btn-wrapper position-top-right">
                    <svg className="close-challenge-over-x" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
export default ChallengeOverModal;