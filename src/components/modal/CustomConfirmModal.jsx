function CustomConfirmModal() {
    return (
        <div id="custom-confirm-modal" className="popup-modal hidden" style={{ zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="popup-overlay" style={{ background: 'rgba(0,0,0,0.4)' }}></div>
            <div className="popup-content custom-confirm-popup">
                <p id="custom-confirm-msg" className="confirm-msg">메시지</p>
                <div className="confirm-btn-row">
                    <button id="custom-confirm-cancel" className="confirm-btn-cancel">취소</button>
                    <button id="custom-confirm-ok" className="confirm-btn-ok">확인</button>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmModal;