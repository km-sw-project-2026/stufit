function FinalGiveUpModal() {
    return (
        <div id="final-give-up-modal" className="popup-modal hidden">
            <div className="popup-overlay"></div>
            <div className="popup-content confirm-modal-content">
                <div className="confirm-text-area">
                    <h3 className="confirm-title" style="word-break: keep-all; line-height: 1.4; margin-bottom: 20px;">끝까지 가보지 못한다면 '안 되는 이유'를<br />말할 자격이 없다</h3>
                    <p className="confirm-subtitle" style="color: grey; font-size: 0.9rem; margin-bottom: 30px; font-weight: normal;">-챗지피티-</p>
                    <p className="confirm-subtitle" style="margin-top: 0;">챌린지를 포기하시겠습니까?</p>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-btn cancel">취소</button>
                    <button className="confirm-btn real-giveup">정말 포기하기</button>
                </div>
            </div>
        </div>
    );
};
export default FinalGiveUpModal;