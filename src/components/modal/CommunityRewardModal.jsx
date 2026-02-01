function CommunityRewardModal() {
    return (
        <div id="community-reward-modal" className="popup-modal hidden">
            <div className="popup-overlay reward-overlay"></div>
            <div className="popup-content reward-popup">
                <img src="img/logo.png" alt="Stufit" className="reward-logo-img" />
                <h2 className="reward-title">커뮤니티 인기글 보상 안내</h2>
                <p className="reward-desc">
                    인기글에 선정되시면<br />
                    <span className="highlight">300포인트</span>를 지급해드려요!
                </p>
                <div className="reward-check-row">
                    <input type="checkbox" id="dont-show-reward" />
                    <label htmlFor="dont-show-reward">오늘하루 그만보기</label>
                </div>
                <button className="reward-confirm-btn">확인</button>
            </div>
        </div>
    );
};

export default CommunityRewardModal;