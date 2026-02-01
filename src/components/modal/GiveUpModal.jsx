function GiveUpModal() {
    return (
        <div id="give-up-modal" className="popup-modal hidden">
            <div className="popup-overlay"></div>
            <div className="popup-content confirm-modal-content">
                <div className="confirm-text-area">
                    <h3 className="confirm-title">챌린지가 완료되지 않았습니다</h3>
                    <p className="confirm-subtitle">챌린지를 포기하시겠습니까?</p>
                    <p className="confirm-desc">나중에 이어서 불가능 합니다.</p>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-btn cancel">취소</button>
                    <button className="confirm-btn giveup">포기하기</button>
                </div>
            </div>
        </div>
    );
};

export default GiveUpModal;