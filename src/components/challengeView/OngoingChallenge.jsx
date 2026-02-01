import React, { useState, useEffect } from 'react';
import CreateChallengeModal from '../modal/CreateChallengeModal';
import Challenge from './Challenge';

function OngoingChallenge() {
    const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);
    const [isChallengeModalVisible, setIsChallengeModalVisible] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);

    // 챌린지 목록 불러오기
    const fetchChallenges = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;

        setLoading(true);
        try {
            const response = await fetch('/api/challenges', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                }
            });

            if (response.ok) {
                const data = await response.json();
                setChallenges(data.challenges || []);
            }
        } catch (error) {
            console.error('챌린지 목록 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 챌린지 목록 불러오기
    useEffect(() => {
        fetchChallenges();
    }, []);

    // '챌린지 만들기' 버튼 클릭 시 호출
    const CreateChallengeHandler = () => setCreateChallengeOpen(true);

    // '전체 챌린지 보러가기' 클릭 시 호출
    const allChallenge = () => {
        setIsChallengeModalVisible(true);
    };

    // CreateChallengeModal 닫기 및 목록 새로고침
    const closeCreateChallengeModal = () => {
        setCreateChallengeOpen(false);
        fetchChallenges(); // 챌린지 생성 후 목록 새로고침
    };

    // Challenge 모달 닫기
    const closeChallengeModal = () => setIsChallengeModalVisible(false);

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 카테고리 한글 변환
    const getCategoryName = (category) => {
        const categoryMap = {
            'STUDY': '공부',
            'EXERCISE': '운동',
            'DAILY': '일상'
        };
        return categoryMap[category] || category;
    };

    // 챌린지 카드 컴포넌트
    const ChallengeCard = ({ challenge }) => {
        const startDate = challenge.created_at ? formatDate(challenge.created_at) : '';
        const endDate = challenge.end_date ? formatDate(challenge.end_date) : '';

        return (
            <div className="challenge-card">
                <div className="challenge-card-header">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    <span className="challenge-category">{getCategoryName(challenge.category)}</span>
                </div>
                <div className="challenge-card-body">
                    <div className="challenge-info">
                        <p className="challenge-period">
                            <strong>기간:</strong> {startDate} ~ {endDate}
                        </p>
                        <p className="challenge-goal">
                            <strong>목표:</strong> {challenge.goal}
                        </p>
                        <p className="challenge-members">
                            <strong>참여 인원:</strong> 1명
                        </p>
                        {challenge.challenge_code && (
                            <p className="challenge-code">
                                <strong>초대 코드:</strong> {challenge.challenge_code}
                            </p>
                        )}
                    </div>
                </div>
                <div className="challenge-card-footer">
                    <button className="challenge-detail-btn">자세히 보기</button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* 진행 중인 챌린지 모달 */}
            {!isChallengeModalVisible && (
                <div id="ongoing-challenge-modal" className="modal">
                    <div className="modal-content">
                        <div className="ongoing-challenge-link">
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

                        <div className="challenge-grid">
                            {loading ? (
                                <p className="loading-message">챌린지를 불러오는 중...</p>
                            ) : challenges.length > 0 ? (
                                challenges.map(challenge => (
                                    <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
                                ))
                            ) : (
                                <p className="no-challenges-message">아직 생성된 챌린지가 없습니다. 새로운 챌린지를 만들어보세요!</p>
                            )}
                        </div>
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