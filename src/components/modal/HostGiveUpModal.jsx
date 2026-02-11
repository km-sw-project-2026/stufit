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
            setAlertMessage('로그인 정보가 없습니다.');
            setAlertOpen(true);
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
                console.log('[HostGiveUpModal] API response:', result);

                if (response.ok) {
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
                    
                    // 기존 모달 먼저 닫기
                    setModalOpen(false);
                    
                    // 짧은 딜레이 후 알림 표시
                    setTimeout(() => {
                        setAlertMessage('챌린지를 나갔습니다. 방장 권한이 다른 멤버에게 이전되었습니다.');
                        setAlertOpen(true);
                    }, 100);
                } else {
                    setModalOpen(false);
                    setTimeout(() => {
                        setAlertMessage(result.message || '나가기에 실패했습니다.');
                        setAlertOpen(true);
                    }, 100);
                }
            } else if (selectedOption === 'delete') {
                // 챌린지 삭제 - 기존 FinalGiveUpModal 사용
                setModalOpen(false);
                setTimeout(() => {
                    setFinalModalOpen(true);
                }, 100);
            }
        } catch (error) {
            console.error('Error:', error);
            setModalOpen(false);
            setTimeout(() => {
                setAlertMessage('오류가 발생했습니다.');
                setAlertOpen(true);
            }, 100);
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
        if (onLeave) onLeave();
    };

    return (
        <>
            {!alertOpen && (
                <div id="host-give-up-modal" className="popup-modal">
                    <div className="popup-overlay" onClick={() => setModalOpen(false)}></div>
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
                            나홀로 이어가 불가능 합니다.<br />
                            초도 포기시에는 준수가 100점을 차감됩니다
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
            )}
                />
            )}
        </>
    );
}

export default HostGiveUpModal;
