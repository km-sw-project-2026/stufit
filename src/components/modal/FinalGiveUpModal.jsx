function FinalGiveUpModal({ setModalOpen }) {
    return (
        <div id="final-give-up-modal" className="popup-modal">
            <div className="popup-overlay"></div>
            <div className="popup-content confirm-modal-content">
                <div className="confirm-text-area">
                    <h3 className="confirm-title" style={{ wordBreak: 'keep-all', lineHeight: '1.4', marginBottom: '20px' }}>
                        끝까지 가보지 못한다면 '안 되는 이유'를<br />말할 자격이 없다
                    </h3>
                    <p className="confirm-subtitle" style={{ color: 'grey', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 'normal' }}>-챗지피티-</p>
                    <p className="confirm-subtitle" style={{ marginTop: 0 }}>챌린지를 포기하시겠습니까?</p>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-btn cancel" onClick={() => setModalOpen(false)}>취소</button>
                    <button className="confirm-btn real-giveup">정말 포기하기</button>
                </div>
            </div>
        </div>
    );
};
export default FinalGiveUpModal;