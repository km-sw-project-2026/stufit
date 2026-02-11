// import { useState } from "react";

// function HostGiveUpModal({ setModalOpen, setFinalModalOpen, challenge }) {
//     const [selectedOption, setSelectedOption] = useState('leave'); // 'leave' 또는 'delete'

//     const handleConfirm = () => {
//         setModalOpen(false);
//         setFinalModalOpen(true);
//     };

//     return (
//         <div id="host-give-up-modal" className="popup-modal">
//             <div className="popup-overlay"></div>
//             <div className="popup-content host-giveup-modal-content">
//                 <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                     </svg>
//                 </button>
                
//                 <h3 className="host-giveup-title">챌린지</h3>
                
//                 <div className="host-giveup-options">
//                     <div 
//                         className={`host-option ${selectedOption === 'leave' ? 'selected' : ''}`}
//                         onClick={() => setSelectedOption('leave')}
//                     >
//                         <div className="option-header">
//                             <span className="option-title">챌린지 나가기</span>
//                             <div className="radio-button">
//                                 {selectedOption === 'leave' && (
//                                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                         <path d="M16.6667 5L7.50002 14.1667L3.33335 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                 )}
//                             </div>
//                         </div>
//                         <p className="option-description">
//                             나홀로 이어가 불가능 합니다.<br />
//                             초도 포기시에는 준수가 100점을 차감됩니다
//                         </p>
//                     </div>

//                     <div 
//                         className={`host-option ${selectedOption === 'delete' ? 'selected' : ''}`}
//                         onClick={() => setSelectedOption('delete')}
//                     >
//                         <div className="option-header">
//                             <span className="option-title">챌린지 삭제</span>
//                             <div className="radio-button">
//                                 {selectedOption === 'delete' && (
//                                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                         <path d="M16.6667 5L7.50002 14.1667L3.33335 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                 )}
//                             </div>
//                         </div>
//                         <p className="option-description">
//                             삭제 시 모든 참가자들에게 종료 삭제됩니다.
//                         </p>
//                     </div>
//                 </div>

//                 <button className="host-confirm-btn" onClick={handleConfirm}>
//                     나가기
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default HostGiveUpModal;



// －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－


import React, { useState } from "react";

function HostGiveUpModal({ setModalOpen, setFinalModalOpen, challenge }) {
    const [selectedOption, setSelectedOption] = useState('leave'); // 'leave' 또는 'delete'

    const handleConfirm = () => {
        setModalOpen(false);
        setFinalModalOpen(true);
    };

    return (
        <div id="host-give-up-modal" className="popup-modal">
            <div className="popup-overlay" onClick={() => setModalOpen(false)}></div>
            <div className="popup-content host-giveup-modal-content">
                <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <h3 className="host-giveup-title">챌린지 설정</h3>
                
                <div className="host-giveup-options">
                    <div 
                        className={`host-option ${selectedOption === 'leave' ? 'selected' : ''}`}
                        onClick={() => setSelectedOption('leave')}
                    >
                        <div className="option-header">
                            <span className="option-title">챌린지 나가기</span>
                            <div className="radio-button">
                                {selectedOption === 'leave' && (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M16.6667 5L7.50002 14.1667L3.33335 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <p className="option-description">
                            나홀로 이어가기가 불가능합니다.<br />
                            중도 포기 시에는 점수가 차감될 수 있습니다.
                        </p>
                    </div>

                    <div 
                        className={`host-option ${selectedOption === 'delete' ? 'selected' : ''}`}
                        onClick={() => setSelectedOption('delete')}
                    >
                        <div className="option-header">
                            <span className="option-title">챌린지 삭제</span>
                            <div className="radio-button">
                                {selectedOption === 'delete' && (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M16.6667 5L7.50002 14.1667L3.33335 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <p className="option-description">
                            삭제 시 모든 참가자들에게서 해당 챌린지가 삭제됩니다.
                        </p>
                    </div>
                </div>

                <button className="host-confirm-btn" onClick={handleConfirm}>
                    확인
                </button>
            </div>
        </div>
    );
}

export default HostGiveUpModal;