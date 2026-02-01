// function CustomAlertModal() {
//     return (
//             <div id="custom-alert-modal" className="popup-modal hidden">
//                 <div className="popup-overlay"></div>
//                 <div className="popup-content" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
//                     <p id="custom-alert-text" style={{ marginBottom: '25px', fontSize: '1.1rem', color: '#333', lineHeight: '1.5', fontWeight: 500 }}></p>
//                     <button id="custom-alert-close" className="start-challenge-btn" style={{ width: '120px', margin: '0 auto', padding: '12px' }}>확인</button>
//                 </div>
//             </div>
//     );
// };

// export default CustomAlertModal;


// ------------------------------------------------------


// src/components/modal/CustomAlertModal.jsx 수정 예시
function CustomAlertModal({ message, onClose }) { // props 추가
  return (
    <div id="custom-alert-modal" className="popup-modal"> {/* hidden 클래스 제거 */}
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
        {/* 전달받은 메시지 표시 */}
        <p id="custom-alert-text" style={{ marginBottom: '25px', fontSize: '1.1rem', color: '#333' }}>
          {message} 
        </p>
        <button 
          id="custom-alert-close" 
          className="start-challenge-btn" 
          style={{ width: '120px', margin: '0 auto', padding: '12px' }}
          onClick={onClose} // 닫기 함수 연결
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CustomAlertModal;