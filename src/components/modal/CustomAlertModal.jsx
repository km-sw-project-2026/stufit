import React from 'react';

function CustomAlertModal({ message, onClose }) {
  return (
    <div id="custom-alert-modal" className="popup-modal" style={{position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div 
        className="popup-overlay" 
        onClick={onClose} 
        style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)'}}
      ></div>
      <div
        className="popup-content"
        style={{
            position: 'relative',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 3001
        }}
      >
        <p id="custom-alert-text" style={{ marginBottom: '25px', fontSize: '1.1rem', color: '#333' }}>
          {message}
        </p>
        <button
          id="custom-alert-close"
          className="start-challenge-btn"
          style={{ margin: '0 auto', padding: '12px', cursor: 'pointer', backgroundColor: '#006d5d', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CustomAlertModal;