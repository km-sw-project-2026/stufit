import { useState } from 'react';

const quotes = [
    "지금 포기하는 건 게으른게 아니라, 스스로를 포기한거다.",
    "노력하지 않은 미래를 후회하는 게 제일 추하다.",
    "경쟁자는 나와 어제의 나일뿐이다.",
    "양심을 버린 순간부터 너는 이미 변명 속에서 산다.",
    "재능이 없어서가 아니라, 끝까지 하지 않아서 평범한 것이다.",
    "아무것도 하지 않으면서 바라는 건 꿈이 아니라 욕심이다.",
    "변명은 노력보다 쉽고, 후회는 변명보다 오래 간다.",
    "당신이 안 하는 동안, 누군가는 이미 당신을 추월했다.",
    "할 수 있었는데 안 한 선택들이 결국 당신의 한계를 만든다.",
    "힘들다는 이유로 멈추는 순간, 당신의 목표도 당신을 포기한다."
];

function FinalGiveUpModal({ setModalOpen, challengeId, onLeave, action = 'leave' }) {
    const [randomQuote] = useState(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    });

    const handleConfirmLeave = async () => {
        try {
            console.log("🔵 챌린지 처리 시작:", { challengeId, action });
            
            const username = localStorage.getItem('username');
            if (!username) {
                alert('사용자 정보가 없습니다.');
                return;
            }

            console.log("🟡 API 호출 준비:", { challengeId, username });

            const endpoint = action === 'delete'
                ? `/api/challenges/${challengeId}`
                : `/api/challenges/${challengeId}/leave`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                }
            });

            console.log("🟡 API 응답 상태:", response.status);
            
            const data = await response.json();
            console.log("🟡 API 응답 데이터:", data);

            if (response.ok) {
                console.log('🔵 서버 응답 성공! 데이터:', data);
                // 응답에서 받은 포인트만 업데이트
                if (data.points !== undefined) {
                    const oldPoints = localStorage.getItem('points');
                    const newPoints = Number(data.points);
                    console.log('🔵 포인트 변경:', { oldPoints, newPoints, diff: newPoints - Number(oldPoints) });
                    localStorage.setItem('points', String(newPoints));
                    window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: newPoints } }));
                    console.log('✅ 포인트 즉시 업데이트 완료 + 이벤트 발생:', newPoints);
                } else {
                    // 응답에 없으면 다시 조회
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
                
                if (action !== 'delete') {
                    try {
                        await fetch(`/api/challenges/${challengeId}/progress`, {
                            method: 'DELETE',
                            headers: { 'X-Username': username }
                        });
                        console.log('🔵 progress 삭제 요청 전송');
                    } catch (e) {
                        console.warn('progress 삭제 요청 실패', e);
                    }
                }

                setModalOpen(false);
                // 부모 컴포넌트에 콜백
                if (onLeave) {
                    console.log("🟢 onLeave 콜백 호출");
                    onLeave(action);
                }
            } else {
                alert(data?.message || (action === 'delete' ? '챌린지 삭제에 실패했습니다.' : '챌린지 나가기에 실패했습니다.'));
            }
        } catch (error) {
            console.error('❌ 챌린지 나가기 오류:', error);
            alert('오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div id="final-give-up-modal" className="popup-modal">
            <div className="popup-overlay"></div>
            <div className="popup-content confirm-modal-content">
                <div className="confirm-text-area">
                    <h3 className="confirm-title" style={{ wordBreak: 'keep-all', lineHeight: '1.4', marginBottom: '20px' }}>
                        {randomQuote}
                    </h3>
                    <p className="confirm-subtitle" style={{ marginTop: '30px' }}>
                        {action === 'delete' ? '챌린지를 삭제하시겠습니까?' : '챌린지를 포기하시겠습니까?'}
                    </p>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-btn cancel" onClick={() => setModalOpen(false)}>취소</button>
                    <button className="confirm-btn real-giveup" onClick={handleConfirmLeave}>
                        {action === 'delete' ? '정말 삭제하기' : '정말 포기하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FinalGiveUpModal;