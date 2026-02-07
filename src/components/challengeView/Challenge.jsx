// import React from 'react';

// function Challenge({ closeChallengeModal }) {
//     return (
//         <div id="challenge-modal" className="modal">
//             <div className="modal-content">
//                 <div className="ongoing-challenge-link">
//                     {/* '진행중인 챌린지 보러가기' 클릭 시 OngoingChallenge 모달로 돌아가기 */}
//                     <a href="#" id="go-to-ongoing-challenges" onClick={closeChallengeModal}>진행중인 챌린지 보러가기 →</a>
//                 </div>
//                 <div className="modal-header-top">
//                     <div className="header-left">
//                         <h2>전체 챌린지</h2>
//                         <div className="search-bar">
//                             <input type="text" id="all-challenge-code-input" placeholder="Enter code" />
//                             <button className="search-icon" id="all-challenge-code-btn">
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <circle cx="11" cy="11" r="8"></circle>
//                                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="challenge-grid">
//                     {/* Challenges will be added here */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Challenge;


// -------------------------------------------------


import React, { useState } from 'react';
// 1. 모달 컴포넌트를 불러옵니다.
import CreateChallengeModal from '../modal/CreateChallengeModal';

function Challenge({ closeChallengeModal }) {
    // 2. 챌린지 만들기 모달의 열림/닫힘 상태를 관리합니다.
    const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);

    const openCreateChallengeModal = () => setCreateChallengeOpen(true);
    const closeCreateChallengeModal = () => setCreateChallengeOpen(false);

    return (
        <div id="challenge-modal" className="modal">
            <div className="modal-content">
                <div className="ongoing-challenge-link">
                    <a href="#" id="go-to-ongoing-challenges" onClick={closeChallengeModal}>
                        진행중인 챌린지 보러가기 →
                    </a>
                </div>
                <div className="modal-header-top">
                    <div className="header-left">
                        <h2>전체 챌린지</h2>
                        <div className="search-bar">
                            <input type="text" id="all-challenge-code-input" placeholder="Enter code" />
                            <button className="search-icon" id="all-challenge-code-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* 3. 첫 번째 사진과 똑같은 위치에 버튼을 추가합니다. */}
                    <button 
                        className="create-challenge-btn" 
                        onClick={openCreateChallengeModal}
                    >
                        챌린지 만들기
                    </button>
                </div>

                <div className="challenge-grid">
                    {/* 챌린지 목록들이 여기에 표시됩니다. */}
                </div>
            </div>

            {/* 4. '챌린지 만들기' 버튼 클릭 시 모달이 화면에 나타납니다. */}
            {createChallengeModalOpen && (
                <CreateChallengeModal 
                    setCreateChallengeOpen={setCreateChallengeOpen} 
                    closeCreateChallengeModal={closeCreateChallengeModal} 
                />
            )}
        </div>
    );
}

export default Challenge;