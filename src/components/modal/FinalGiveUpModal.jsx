import { useState, useEffect } from 'react';

const quotes = [
    { text: "지금 포기하는 건 게으른게 아니라, 스스로를 포기한거다.", author: "" },
    { text: "노력하지 않은 미래를 후회하는 게 제일 추하다.", author: "" },
    { text: "경쟁자는 나와 어제의 나일뿐이다.", author: "" },
    { text: "양심을 버린 순간부터 너는 이미 변명 속에서 산다.", author: "" },
    { text: "재능이 없어서가 아니라, 끝까지 하지 않아서 평범한 것이다.", author: "" },
    { text: "아무것도 하지 않으면서 바라는 건 꿈이 아니라 욕심이다.", author: "" },
    { text: "변명은 노력보다 쉽고, 후회는 변명보다 오래 간다.", author: "" },
    { text: "당신이 안 하는 동안, 누군가는 이미 당신을 추월했다.", author: "" },
    { text: "할 수 있었는데 안 한 선택들이 결국 당신의 한계를 만든다.", author: "" },
    { text: "힘들다는 이유로 멈추는 순간, 당신의 목표도 당신을 포기한다.", author: "" }
];

function FinalGiveUpModal({ setModalOpen, challengeId, onLeave }) {
    const [randomQuote, setRandomQuote] = useState(quotes[0]);

    useEffect(() => {
        // 컴포넌트 마운트 시 랜덤 명언 선택
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    }, []);

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
                        {randomQuote.text}
                    </h3>
                    {randomQuote.author && (
                        <p className="confirm-subtitle" style={{ color: 'grey', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 'normal' }}>-{randomQuote.author}-</p>
                    )}
                    <p className="confirm-subtitle" style={{ marginTop: randomQuote.author ? 0 : '30px' }}>챌린지를 포기하시겠습니까?</p>
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