// import React, { useState, useEffect } from 'react';
// import CreateChallengeModal from '../modal/CreateChallengeModal';
// import CustomAlertModal from '../modals/CustomAlertModal';

// function Challenge({ closeChallengeModal, onCreateSuccess }) {
//     const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false);
//     const [challenges, setChallenges] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const fetchControllerRef = React.useRef(null);
//     const inFlightRef = React.useRef(false);
//     const lastFetchRef = React.useRef(0);
//     const [globalAlertOpen, setGlobalAlertOpen] = useState(false);
//     const [globalAlertMessage, setGlobalAlertMessage] = useState('');

//     // 전체 챌린지 목록 불러오기 (코드가 없는 공개 챌린지만)
//     const fetchChallenges = async () => {
//         // Prevent overlapping fetches
//         const now = Date.now();
//         //防: short-circuit frequent calls (less than 1s)
//         if (now - lastFetchRef.current < 1000) {
//             console.debug('fetchChallenges skipped: too frequent');
//             return;
//         }
//         lastFetchRef.current = now;
//         if (inFlightRef.current) return;
//         inFlightRef.current = true;
//         // only show loader when we have no challenges yet
//         if (challenges.length === 0) setLoading(true);

//         // Abort previous controller if any
//         if (fetchControllerRef.current) {
//             try { fetchControllerRef.current.abort(); } catch (e) {}
//             fetchControllerRef.current = null;
//         }

//         const controller = new AbortController();
//         fetchControllerRef.current = controller;

//         // timeout
//         const timeout = setTimeout(() => controller.abort(), 8000);

//         try {
//             console.debug('fetchChallenges: requesting /api/challenges/public');
//             const response = await fetch('/api/challenges/public', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 signal: controller.signal
//             });

//             console.debug('fetchChallenges: response status', response.status);

//             if (response.ok) {
//                 const data = await response.json();
//                 const publicChallenges = data.challenges || [];
//                 if (publicChallenges.length > 0) {
//                     setChallenges(publicChallenges);
//                     return;
//                 }
//             }

//             // 공개 목록이 비어있을 때는 내 챌린지 중 코드 없는 것만 표시 (생성 직후 반영용)
//             const username = localStorage.getItem('username');
//             if (!username) {
//                 setChallenges([]);
//                 return;
//             }

//             // fallback with timeout as well
//             const fbController = new AbortController();
//             const fbTimeout = setTimeout(() => fbController.abort(), 8000);
//             try {
//                 const fallbackResponse = await fetch('/api/challenges', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-Username': username
//                     },
//                     signal: fbController.signal
//                 });

//                 if (fallbackResponse.ok) {
//                     const fallbackData = await fallbackResponse.json();
//                     const fallbackChallenges = (fallbackData.challenges || []).filter(ch => !ch.challenge_code);
//                     setChallenges(fallbackChallenges);
//                 } else {
//                     setChallenges([]);
//                 }
//             } catch (e) {
//                 console.warn('Fallback challenges fetch failed:', e);
//                 setChallenges([]);
//             } finally {
//                 clearTimeout(fbTimeout);
//             }

//         } catch (error) {
//             if (error.name === 'AbortError') {
//                 console.warn('fetchChallenges aborted/timed out');
//             } else {
//                 console.error('챌린지 목록 불러오기 실패:', error);
//             }
//             setChallenges([]);
//         } finally {
//             clearTimeout(timeout);
//             fetchControllerRef.current = null;
//             inFlightRef.current = false;
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchChallenges();

//         const handleFocus = () => fetchChallenges();
//         window.addEventListener('focus', handleFocus);

//         // No periodic polling to avoid repeated fetches and flicker.
//         // Only refresh on window focus or manual actions.
//         return () => {
//             window.removeEventListener('focus', handleFocus);
//         };
//     }, []);

//     const handleCreateChallenge = () => {
//         setCreateChallengeModalOpen(true);
//     };

//     const closeCreateChallengeModal = () => {
//         setCreateChallengeModalOpen(false);
//     };

//     const handleCreateSuccess = (createdChallenge) => {
//         if (createdChallenge && !createdChallenge.challenge_code) {
//             setChallenges((prev) => {
//                 const exists = prev.some((ch) => ch.challenge_id === createdChallenge.challenge_id);
//                 return exists ? prev : [createdChallenge, ...prev];
//             });
//         } else {
//             fetchChallenges();
//         }

//         if (onCreateSuccess) onCreateSuccess();
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
//     };

//     const getCategoryName = (category) => {
//         const categoryMap = { 'STUDY': '공부', 'EXERCISE': '운동', 'DAILY': '일상' };
//         return categoryMap[category] || category;
//     };

//     const showAlert = (msg) => {
//         setGlobalAlertMessage(msg);
//         setGlobalAlertOpen(true);
//     };

//     const ChallengeCard = ({ challenge, onShowAlert }) => {
//         const startDate = formatDate(challenge.created_at);
//         const endDate = formatDate(challenge.end_date);
//         const [joinLoading, setJoinLoading] = React.useState(false);
//         // alert handled by parent via onShowAlert

//         return (
//             <div className="challenge-card" style={{ 
//                 border: '1px solid #70c1b3', 
//                 borderRadius: '20px', 
//                 padding: '35px', 
//                 backgroundColor: 'white',
//                 minHeight: '240px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                 position: 'relative',
//             }}>
//                 <div>
//                     <div className="challenge-card-header" style={{ marginBottom: '25px' }}>
//                         <h3 style={{ display: 'inline', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{challenge.title}</h3>
//                         <span style={{ color: '#888', marginLeft: '12px', fontSize: '0.95rem' }}>({getCategoryName(challenge.category)})</span>
//                     </div>
//                     <div className="challenge-card-body" style={{ color: '#555', fontSize: '1rem', lineHeight: '2' }}>
//                         <p style={{ margin: '10px 0' }}>참여 인원 - 공개 챌린지</p>
//                         <p style={{ margin: '10px 0' }}>기간 - {startDate} ~ {endDate}</p>
//                         <p style={{ margin: '10px 0' }}>목표 - {challenge.goal}</p>
//                     </div>
//                     <div className="challenge-card-footer" style={{ /* absolute footer to avoid shifting content */ position: 'absolute', right: '24px', bottom: '24px', display: 'flex', alignItems: 'center' }}>
//                         <button 
//                             className="challenge-detail-btn" 
//                             style={{ border: '1px solid #247b7b', borderRadius: '20px', padding: '8px 25px', backgroundColor: 'white', color: '#247b7b', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
//                             onClick={async () => {
//                                 if (joinLoading) return;
//                                 setJoinLoading(true);
//                                 try {
//                                     const username = localStorage.getItem('username');
//                                     if (!username) {
//                                         onShowAlert('로그인이 필요합니다.');
//                                         return;
//                                     }

//                                     const res = await fetch(`/api/challenges/${challenge.challenge_id}/join`, {
//                                         method: 'POST',
//                                         headers: { 'X-Username': encodeURIComponent(username) }
//                                     });
//                                     let payload = null;
//                                     try { payload = await res.json(); } catch (e) { }

//                                     if (res.ok) {
//                                         onShowAlert(payload?.message || '참가 완료!');
//                                         window.dispatchEvent(new CustomEvent('challenge-joined', { detail: { challengeId: challenge.challenge_id, members: payload?.members || [] } }));
//                                         setTimeout(() => fetchChallenges(), 400);
//                                     } else {
//                                         const msg = payload?.message || payload?.error || '이미 참가중입니다.';
//                                         onShowAlert(msg);
//                                     }
//                                 } catch (err) {
//                                     console.error('참가 처리 오류', err);
//                                     onShowAlert('참가 처리 실패');
//                                 } finally {
//                                     setJoinLoading(false);
//                                 }
//                             }}
//                         >
//                             참여하기
//                         </button>
                        
//                     </div>
//                 </div>
//             </div>
//         );
//     };


//     return (
//         <div id="challenge-modal" className="modal" style={{ backgroundColor: '#eeeeee', minHeight: '100vh', padding: '38px 40px' }}>
//             <div className="modal-content" style={{ maxWidth: '1300px', margin: '0 auto' }}>
//                 <div className="modal-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', gap: '30px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
//                         <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', letterSpacing: '-0.5px' }}>전체 챌린지</h2>
//                         <div className="search-bar" style={{ 
//                             display: 'flex', 
//                             alignItems: 'center', 
//                             backgroundColor: 'white', 
//                             borderRadius: '25px', 
//                             padding: '8px 20px', 
//                             border: '1px solid #ccc' 
//                         }}>
//                             <input type="text" id="all-challenge-code-input" placeholder="Enter code" style={{ border: 'none', outline: 'none', width: '180px' }} />
//                             <button className="search-icon" id="all-challenge-code-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
//                                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <circle cx="11" cy="11" r="8"></circle>
//                                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginRight: '145px' }}>
//                         <a href="#" id="go-to-ongoing-challenges" onClick={closeChallengeModal} style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>진행중인 챌린지 보러가기 →</a>
//                         <button 
//                             className="create-challenge-btn" 
//                             style={{ backgroundColor: 'white', border: '1px solid #70c1b3', borderRadius: '25px', padding: '10px 25px', cursor: 'pointer', color: '#247b7b', fontWeight: 'bold' }}
//                             onClick={handleCreateChallenge}
//                         >
//                             챌린지 만들기
//                         </button>
//                     </div>
//                 </div>
//                 <div className="challenge-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingTop: '10px' }}>
//                     {loading ? (
//                         <p style={{ textAlign: 'center', gridColumn: 'span 2', color: '#888', padding: '50px' }}>
//                             챌린지를 불러오는 중...
//                         </p>
//                     ) : challenges.length > 0 ? (
//                         challenges.map(challenge => (
//                             <ChallengeCard key={challenge.challenge_id} challenge={challenge} onShowAlert={showAlert} />
//                         ))
//                     ) : (
//                         <p style={{ textAlign: 'center', gridColumn: 'span 2', color: '#888', padding: '50px' }}>
//                             아직 공개된 챌린지가 없습니다.
//                         </p>
//                     )}
//                 </div>
//             </div>

//             {createChallengeModalOpen && (
//                 <CreateChallengeModal 
//                     setCreateChallengeOpen={setCreateChallengeModalOpen} 
//                     closeCreateChallengeModal={closeCreateChallengeModal}
//                     onCreateSuccess={handleCreateSuccess}
//                 />
//             )}
//             {globalAlertOpen && (
//                 <CustomAlertModal onClose={() => setGlobalAlertOpen(false)} message={globalAlertMessage} />
//             )}
//         </div>
//     );
// }

// export default Challenge;





// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateChallengeModal from '../modal/CreateChallengeModal';
import CustomAlertModal from '../modals/CustomAlertModal';

function Challenge({ closeChallengeModal, onCreateSuccess }) {
    const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchCode, setSearchCode] = useState('');
    const [globalAlertOpen, setGlobalAlertOpen] = useState(false);
    const [globalAlertMessage, setGlobalAlertMessage] = useState('');

    const joinByCode = async (codeParam) => {
        const code = (codeParam || searchCode || '').trim();
        if (!code) return alert('코드를 입력해주세요.');
        const username = localStorage.getItem('username');
        if (!username) {
            if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                window.location.href = '/login';
            }
            return;
        }
        try {
            const headersForGet = {};
            const headerUser = localStorage.getItem('username');
            if (headerUser) headersForGet['X-Username'] = encodeURIComponent(headerUser);
            const res = await fetch(`/api/challenges?code=${encodeURIComponent(code)}`, { headers: headersForGet });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                return alert(e?.message || '챌린지를 찾을 수 없습니다.');
            }
            const payload = await res.json();
            const challenge = payload.challenge;
            if (!challenge) return alert('챌린지를 불러오지 못했습니다.');
            const headers = { 'Content-Type': 'application/json', 'X-Username': encodeURIComponent(username) };
            const joinRes = await fetch(`/api/challenges/${challenge.challenge_id}/join`, { method: 'POST', headers });
            const joinPayload = await joinRes.json().catch(() => ({}));
            if (!joinRes.ok) return alert(joinPayload?.message || '참가에 실패했습니다.');
            alert('참가되었습니다! 페이지를 새로고침합니다.');
            window.location.reload();
        } catch (err) {
            console.error('code join error', err);
            alert('참가 중 오류가 발생했습니다.');
        }
    };

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/challenges/public');
            if (response.ok) {
                const data = await response.json();
                setChallenges(data.challenges || []);
            }
        } catch (error) {
            console.error('불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchChallenges(); }, []);

    const handleCreateChallenge = () => setCreateChallengeModalOpen(true);
    const showAlert = (msg) => { setGlobalAlertMessage(msg); setGlobalAlertOpen(true); };

    // 챌린지 카드 컴포넌트 (내부 정의)
    const ChallengeCard = ({ challenge }) => (
        <div className="challenge-card" style={{ 
            border: '1px solid #70c1b3', borderRadius: '20px', padding: '35px', 
            backgroundColor: 'white', minHeight: '240px', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between', position: 'relative'
        }}>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{challenge.title}</h3>
                <div style={{ color: '#555', marginTop: '15px', lineHeight: '1.8' }}>
                    <p>기간: {challenge.created_at?.split('T')[0]} ~ {challenge.end_date?.split('T')[0]}</p>
                    <p>목표: {challenge.goal}</p>
                </div>
            </div>
            <button style={{ 
                alignSelf: 'flex-end', border: '1px solid #247b7b', borderRadius: '20px', 
                padding: '8px 25px', backgroundColor: 'white', color: '#247b7b', fontWeight: 'bold' 
            }}>참여하기</button>
        </div>
    );

return (
    <>
        <div id="challenge-modal" style={{ backgroundColor: '#eeeeee', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 30001 }}>
            <div className="modal-content" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', padding: '38px 40px', position: 'relative' }}>
            
            {/* 1. 상단 헤더 영역 (위치 고정) */}
            <div className="modal-header-top" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '50px', 
                gap: '30px',
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>전체 챌린지</h2>
                    <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '25px', padding: '8px 20px', border: '1px solid #ccc' }}>
                        <input type="text" placeholder="Enter code" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') joinByCode(); }} style={{ border: 'none', outline: 'none', width: '180px' }} />
                        <button onClick={() => joinByCode()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginRight: '145px', position: 'relative', zIndex: 20000, pointerEvents: 'auto' }}>
                    <a
                        href="/ongoing-challenges"
                        style={{ 
                            color: '#666', 
                            fontSize: '0.9rem', 
                            textDecoration: 'none',
                            cursor: 'pointer',
                            padding: '5px',
                            display: 'inline-block',
                            position: 'relative',
                            zIndex: 20001,
                            pointerEvents: 'auto'
                        }}
                    >
                        진행중인 챌린지 보러가기 →
                    </a>
                    <button 
                        type="button"
                        style={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #70c1b3', 
                            borderRadius: '25px', 
                            padding: '10px 25px', 
                            cursor: 'pointer', 
                            color: '#247b7b', 
                            fontWeight: 'bold'
                        }}
                        onClick={handleCreateChallenge}
                    >
                        챌린지 만들기
                    </button>
                </div>
            </div>

            {/* 2. 챌린지 리스트 및 '없음' 메시지 영역 (가운데 정렬 핵심) */}
            <div className="challenge-container" style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: loading || challenges.length === 0 ? 'center' : 'flex-start', /* 내용 없을 때 세로 중앙 */
                alignItems: 'center', /* 가로 중앙 */
                width: '100%',
                position: 'relative',
                zIndex: 1
            }}>
                {loading ? (
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>챌린지를 불러오는 중...</p>
                ) : challenges.length > 0 ? (
                    <div className="challenge-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '40px', 
                        width: '100%' 
                    }}>
                        {challenges.map(challenge => (
                            <ChallengeCard key={challenge.challenge_id} challenge={challenge} onShowAlert={showAlert} />
                        ))}
                    </div>
                ) : (
                    /* 🚀 이 부분이 화면 정중앙에 오게 됩니다 */
                    <p style={{ 
                        textAlign: 'center', 
                        color: '#888', 
                        fontSize: '1.1rem',
                        marginTop: '-100px' /* 헤더 높이만큼 약간 위로 보정하여 시각적 중앙 맞춤 */
                    }}>
                        아직 공개된 챌린지가 없습니다.
                    </p>
                )}
            </div>
        </div>
        </div>
        
        {createChallengeModalOpen && (
            <CreateChallengeModal 
                setCreateChallengeOpen={setCreateChallengeModalOpen} 
                closeCreateChallengeModal={() => setCreateChallengeModalOpen(false)}
                onCreateSuccess={onCreateSuccess}
            />
        )}
        {globalAlertOpen && (
            <CustomAlertModal 
                onClose={() => setGlobalAlertOpen(false)} 
                message={globalAlertMessage} 
            />
        )}
    </>
);
}

export default Challenge;