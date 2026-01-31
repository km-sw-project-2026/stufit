function CustomAlertModal() {
    return (
            <div id="custom-alert-modal" className="popup-modal hidden">
                <div className="popup-overlay"></div>
                <div className="popup-content" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
                    <p id="custom-alert-text" style={{ marginBottom: '25px', fontSize: '1.1rem', color: '#333', lineHeight: '1.5', fontWeight: 500 }}></p>
                    <button id="custom-alert-close" className="start-challenge-btn" style={{ width: '120px', margin: '0 auto', padding: '12px' }}>확인</button>
                </div>
            </div>
    );
};

export default CustomAlertModal;