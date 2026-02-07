import React, { useState, useEffect } from 'react';
import CreateChallengeModal from '../modal/CreateChallengeModal';

function Challenge({ closeChallengeModal, onCreateSuccess }) {
    const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);

    // 전체 챌린지 목록 불러오기 (코드가 없는 공개 챌린지만)
    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/challenges/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // 코드가 없는 챌린지만 필터링
                const publicChallenges = (data.challenges || []).filter(ch => !ch.challenge_code);
                setChallenges(publicChallenges);
            }
        } catch (error) {
            console.error('챌린지 목록 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleCreateChallenge = () => {
        setCreateChallengeModalOpen(true);
    };

    const closeCreateChallengeModal = () => {
        setCreateChallengeModalOpen(false);
        fetchChallenges(); // 모달 닫힐 때도 공개 목록 새로고침
    };

    const handleCreateSuccess = () => {
        fetchChallenges();
        if (onCreateSuccess) onCreateSuccess();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    const getCategoryName = (category) => {
        const categoryMap = { 'STUDY': '공부', 'EXERCISE': '운동', 'DAILY': '일상' };
        return categoryMap[category] || category;
    };

    const ChallengeCard = ({ challenge }) => {
        const startDate = formatDate(challenge.created_at);
        const endDate = formatDate(challenge.end_date);

        return (
            <div className="challenge-card" style={{ 
                border: '1px solid #70c1b3', 
                borderRadius: '20px', 
                padding: '35px', 
                backgroundColor: 'white',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
                <div>
                    <div className="challenge-card-header" style={{ marginBottom: '25px' }}>
                        <h3 style={{ display: 'inline', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{challenge.title}</h3>
                        <span style={{ color: '#888', marginLeft: '12px', fontSize: '0.95rem' }}>({getCategoryName(challenge.category)})</span>
                    </div>
                    <div className="challenge-card-body" style={{ color: '#555', fontSize: '1rem', lineHeight: '2' }}>
                        <p style={{ margin: '10px 0' }}>참여 인원 - 공개 챌린지</p>
                        <p style={{ margin: '10px 0' }}>기간 - {startDate} ~ {endDate}</p>
                        <p style={{ margin: '10px 0' }}>목표 - {challenge.goal}</p>
                    </div>
                </div>
                <div className="challenge-card-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button 
                        className="challenge-detail-btn" 
                        style={{ border: '1px solid #247b7b', borderRadius: '20px', padding: '8px 25px', backgroundColor: 'white', color: '#247b7b', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
                    >
                        참여하기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div id="challenge-modal" className="modal" style={{ backgroundColor: '#eeeeee', minHeight: '100vh', padding: '38px 40px' }}>
            <div className="modal-content" style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <div className="modal-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', letterSpacing: '-0.5px' }}>전체 챌린지</h2>
                        <div className="search-bar" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: 'white', 
                            borderRadius: '25px', 
                            padding: '8px 20px', 
                            border: '1px solid #ccc' 
                        }}>
                            <input type="text" id="all-challenge-code-input" placeholder="Enter code" style={{ border: 'none', outline: 'none', width: '180px' }} />
                            <button className="search-icon" id="all-challenge-code-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginRight: '145px' }}>
                        <a href="#" id="go-to-ongoing-challenges" onClick={closeChallengeModal} style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>진행중인 챌린지 보러가기 →</a>
                        <button 
                            className="create-challenge-btn" 
                            style={{ backgroundColor: 'white', border: '1px solid #70c1b3', borderRadius: '25px', padding: '10px 25px', cursor: 'pointer', color: '#247b7b', fontWeight: 'bold' }}
                            onClick={handleCreateChallenge}
                        >
                            챌린지 만들기
                        </button>
                    </div>
                </div>
                <div className="challenge-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingTop: '10px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', gridColumn: 'span 2', color: '#888', padding: '50px' }}>
                            챌린지를 불러오는 중...
                        </p>
                    ) : challenges.length > 0 ? (
                        challenges.map(challenge => (
                            <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: 'span 2', color: '#888', padding: '50px' }}>
                            아직 공개된 챌린지가 없습니다.
                        </p>
                    )}
                </div>
            </div>

            {createChallengeModalOpen && (
                <CreateChallengeModal 
                    setCreateChallengeOpen={setCreateChallengeModalOpen} 
                    closeCreateChallengeModal={closeCreateChallengeModal}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}

export default Challenge;
