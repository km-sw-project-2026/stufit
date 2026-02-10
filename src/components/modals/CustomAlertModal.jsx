import { useState } from 'react';

function CustomAlertModal({ onClose, message = '알림입니다' }) {
  return (
    <div id="custom-alert-modal" className="popup-modal" style={{ zIndex: 100000 }}>
      <div className="popup-overlay" style={{ zIndex: 99999 }} onClick={onClose}></div>
      <div className="popup-content" style={{ width: '400px', textAlign: 'center', padding: '40px', zIndex: 100001 }}>
        <p style={{ marginBottom: '25px', fontSize: '1.1rem', color: '#333', lineHeight: '1.5', fontWeight: 500 }}>
          {message}
        </p>
        <button onClick={onClose} className="start-challenge-btn" style={{ width: '120px', margin: '0 auto', padding: '12px' }}>확인</button>
      </div>
    </div>
  );
}

export default CustomAlertModal;
