// function CommunityRewardModal() {
//     return (
//         <div id="community-reward-modal" className="popup-modal hidden">
//             <div className="popup-overlay reward-overlay"></div>
//             <div className="popup-content reward-popup">
//                 <img src="img/logo.png" alt="Stufit" className="reward-logo-img" />
//                 <h2 className="reward-title">커뮤니티 인기글 보상 안내</h2>
//                 <p className="reward-desc">
//                     인기글에 선정되시면<br />
//                     <span className="highlight">300포인트</span>를 지급해드려요!
//                 </p>
//                 <div className="reward-check-row">
//                     <input type="checkbox" id="dont-show-reward" />
//                     <label htmlFor="dont-show-reward">오늘하루 그만보기</label>
//                 </div>
//                 <button className="reward-confirm-btn">확인</button>
//             </div>
//         </div>
//     );
// };

// export default CommunityRewardModal;


// ----------------------------------------------------------


// // src/components/modal/CommunityRewardModal.jsx
// import React from 'react';

// function CommunityRewardModal({ onClose }) {
//     return (
//         // 'hidden' 클래스를 제거하여 리액트가 제어할 수 있게 합니다.
//         <div id="community-reward-modal" className="popup-modal"> 
//             <div className="popup-overlay reward-overlay" onClick={onClose}></div>
//             <div className="popup-content reward-popup">
//                 <img src="/img/logo.png" alt="Stufit" className="reward-logo-img" />
//                 <h2 className="reward-title">커뮤니티 인기글 보상 안내</h2>
//                 <p className="reward-desc">
//                     인기글에 선정되시면<br />
//                     <span className="highlight">300포인트</span>를 지급해드려요!
//                 </p>
//                 <div className="reward-check-row">
//                     <input type="checkbox" id="dont-show-reward" />
//                     <label htmlFor="dont-show-reward">오늘하루 그만보기</label>
//                 </div>
//                 <button className="reward-confirm-btn" onClick={onClose}>확인</button>
//             </div>
//         </div>
//     );
// };

// export default CommunityRewardModal;


// ------------------------------------------------------------------------------------



import React from 'react';

function CommunityRewardModal({ onClose }) {
    // 확인 버튼 클릭 시 실행되는 함수
    const handleConfirm = () => {
        const checkbox = document.getElementById('dont-show-reward');
        
        // 체크박스가 체크되어 있다면 브라우저에 오늘 날짜 저장
        if (checkbox && checkbox.checked) {
            localStorage.setItem('hideCommunityRewardModal', new Date().toDateString());
        }
        
        // 부모의 setModalOpen(false) 실행하여 닫기
        onClose();
    };

    return (
        <div id="community-reward-modal" className="popup-modal"> {/* hidden 제거됨 */}
            <div className="popup-overlay reward-overlay" onClick={onClose}></div>
            <div className="popup-content reward-popup">
                <img src="/img/logo.png" alt="Stufit" className="reward-logo-img" />
                <h2 className="reward-title">커뮤니티 인기글 보상 안내</h2>
                <p className="reward-desc">
                    인기글에 선정되시면<br />
                    <span className="highlight">300포인트</span>를 지급해드려요!
                </p>
                
                <div className="reward-check-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                    <input type="checkbox" id="dont-show-reward" style={{ cursor: 'pointer' }} />
                    <label htmlFor="dont-show-reward" style={{ fontSize: '14px', color: '#666', cursor: 'pointer' }}>오늘하루 그만보기</label>
                </div>

                <button 
                    className="reward-confirm-btn" 
                    onClick={handleConfirm}
                    style={{ cursor: 'pointer' }}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default CommunityRewardModal;

