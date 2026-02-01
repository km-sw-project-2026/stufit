import React, { useState } from 'react';
import CreateChallengeModal from '../modal/CreateChallengeModal';
import Challenge from './Challenge';  // 전체 챌린지 모달을 import

function OngoingChallenge() {
    const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);
    const [isChallengeModalVisible, setIsChallengeModalVisible] = useState(false);  // 전체 챌린지 모달 상태 관리

    // '챌린지 만들기' 버튼 클릭 시 호출
    const CreateChallengeHandler = () => setCreateChallengeOpen(true);

    // '전체 챌린지 보러가기' 클릭 시 호출
    const allChallenge = () => {
        setIsChallengeModalVisible(true);  // Challenge 모달을 띄우기 위해 상태 변경
    };

    // CreateChallengeModal 닫기
    const closeCreateChallengeModal = () => setCreateChallengeOpen(false);

    // Challenge 모달 닫기
    const closeChallengeModal = () => setIsChallengeModalVisible(false);

    return (
        <>
            {/* 진행 중인 챌린지 모달 */}
            {!isChallengeModalVisible && (
                <div id="ongoing-challenge-modal" className="modal">
                    <div className="modal-content">
                        <div className="ongoing-challenge-link">
                            {/* '전체 챌린지 보러가기' 클릭 시 Challenge 모달로 전환 */}
                            <a href="#" id="back-to-all-challenges" onClick={allChallenge}>챌린지 전체보기 →</a>
                        </div>
                        <div className="modal-header-top">
                            <div className="header-left">
                                <h2>진행중인 챌린지</h2>
                                <div className="search-bar">
                                    <input type="text" id="ongoing-challenge-code-input" placeholder="Enter code" />
                                    <button className="search-icon" id="ongoing-challenge-code-btn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button className="create-challenge-btn" onClick={CreateChallengeHandler}>챌린지 만들기</button>
                        </div>
                    </div>
                    <div className="challenge-grid">
                        
                        {/* User created challenges will appear here */}
                    </div>
                </div>
            )}

            {/* CreateChallengeModal 열기 */}
            {createChallengeModalOpen && (
                <CreateChallengeModal 
                    setCreateChallengeOpen={setCreateChallengeOpen} 
                    closeCreateChallengeModal={closeCreateChallengeModal} 
                />
            )}

            {/* Challenge 모달 (전체 챌린지) */}
            {isChallengeModalVisible && <Challenge closeChallengeModal={closeChallengeModal} />}
        </>
    );
}

export default OngoingChallenge;

// 아아 이따 예선이가 지울예정