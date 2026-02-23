import { useState } from 'react';

function FinalGiveUpModal({ setModalOpen, challengeId, onLeave }) {
    const [randomQuote] = useState(() => {
        const randomIndex = Math.floor(Math.random() * 10);
        return { text: "포기하지 말기를..." }; // 더 이상 사용되지 않음
    });

    const handleConfirmLeave = async () => {
        try {
            console.log("🔵 챌린지 나가기 시작:", { challengeId });
            
            const username = localStorage.getItem('username');
            if (!username) {
                alert('사용자 정보가 없습니다.');
                return;
            }

            console.log("🟡 API 호출 준비:", { challengeId, username });

            const response = await fetch(`/api/challenges/${challengeId}/leave`, {
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
                
                setModalOpen(false);
                // 부모 컴포넌트에 콜백
                if (onLeave) {
                    console.log("🟢 onLeave 콜백 호출");
                    onLeave();
                }
            } else {
                alert(data?.message || '챌린지 나가기에 실패했습니다.');
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
                        끝까지 가보지 못한다면 '안 되는 이유'를<br />말할 자격이 없다
                    </h3>
                    <p className="confirm-subtitle" style={{ color: 'grey', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 'normal' }}>-박현서-</p>
                    <p className="confirm-subtitle" style={{ marginTop: 0 }}>챌린지를 포기하시겠습니까?</p>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-btn cancel" onClick={() => setModalOpen(false)}>취소</button>
                    <button className="confirm-btn real-giveup" onClick={handleConfirmLeave}>정말 포기하기</button>
                </div>
            </div>
        </div>
    );
};
export default FinalGiveUpModal;