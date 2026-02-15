import { useState } from "react";
import CustomAlertModal from "./CustomAlertModal";

function HostGiveUpModal({ setModalOpen, setFinalModalOpen, challenge, onLeave }) {
    const [selectedOption, setSelectedOption] = useState('leave'); // 'leave' 또는 'delete'
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleConfirm = async () => {
        if (loading) return;
        
        const username = localStorage.getItem('username');
        if (!username || !challenge?.challenge_id) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        setLoading(true);

        try {
            if (selectedOption === 'leave') {
                // 챌린지 나가기 - 방장 권한 이전
                const response = await fetch(`/api/challenges/${challenge.challenge_id}/leave`, {
                    method: 'DELETE',
                    headers: {
                        'X-Username': username
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    // 응답에서 받은 포인트를 바로 업데이트
                    if (result.points !== undefined) {
                        const newPoints = Number(result.points);
                        localStorage.setItem('points', String(newPoints));
                        window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: newPoints } }));
                        console.log('✅ 포인트 즉시 업데이트:', newPoints);
                    } else {
                        // 응답에 포인트가 없으면 다시 조회
                        try {
                            const pointsResponse = await fetch('/api/user/points', {
                                headers: { 'X-Username': username }
                            });
                            if (pointsResponse.ok) {
                                const pointsData = await pointsResponse.json();
                                const newPoints = Number(pointsData?.points);
                                if (!Number.isNaN(newPoints)) {
                                    localStorage.setItem('points', String(newPoints));
                                    window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: newPoints } }));
                                    console.log('✅ 포인트 업데이트 (재조회):', newPoints);
                                }
                            }
                        } catch (pointsErr) {
                            console.error('포인트 새로고침 실패:', pointsErr);
                        }
                    }
                    
                    // 챌린지 업데이트 이벤트 발생
                    if (result.challenge && result.members) {
                        const event = new CustomEvent('challenge-updated', {
                            detail: {
                                challengeId: challenge.challenge_id,
                                challenge: result.challenge,
                                members: result.members
                            }
                        });
                        window.dispatchEvent(event);
                    }
                    
                    setAlertMessage('챌린지를 나갔습니다. 방장 권한이 다른 멤버에게 이전되었습니다.');
                    setAlertOpen(true);
                } else {
                    setAlertMessage(result.message || '나가기에 실패했습니다.');
                    setAlertOpen(true);
                }
            } else if (selectedOption === 'delete') {
                // 챌린지 삭제 - 기존 FinalGiveUpModal 사용
                setModalOpen(false);
                setFinalModalOpen(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('오류가 발생했습니다.');
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
        setModalOpen(false);
        if (onLeave) onLeave();
    };

    return (
        <>
            <div id="host-give-up-modal" className="popup-modal">
                <div className="popup-overlay"></div>
                <div className="popup-content host-giveup-modal-content">
                <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <h3 className="host-giveup-title">챌린지</h3>
                
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
                            나중에 이어서 불가능 합니다.<br />
                            초도 포기시에는 포인트가 100P 차감됩니다
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
                            삭제 시 모든 참가자들에게 종료 삭제됩니다.
                        </p>
                    </div>
                </div>

                <button className="host-confirm-btn" onClick={handleConfirm} disabled={loading}>
                    {loading ? '처리 중...' : '나가기'}
                </button>
            </div>
        </div>
            {alertOpen && (
                <CustomAlertModal
                    message={alertMessage}
                    onClose={handleAlertClose}
                />
            )}
        </>
    );
}

export default HostGiveUpModal;
