
// import React, { useState, useEffect } from 'react';
// import CreateChallengeModal from '../modal/CreateChallengeModal';
// import Challenge from './Challenge';
// import ChallengeDetailView from '../ChallengeDetailView';

// function OngoingChallenge() {
//     const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);
//     const [isChallengeModalVisible, setIsChallengeModalVisible] = useState(false);
//     const [challenges, setChallenges] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedChallenge, setSelectedChallenge] = useState(null);

//     // 챌린지 목록 불러오기
//     const fetchChallenges = async () => {
//         const username = localStorage.getItem('username');
//         if (!username) return;

//         setLoading(true);
//         try {
//             const response = await fetch('/api/challenges', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setChallenges(data.challenges || []);
//             }
//         } catch (error) {
//             console.error('챌린지 목록 불러오기 실패:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 컴포넌트 마운트 시 챌린지 목록 불러오기
//     useEffect(() => {
//         fetchChallenges();
//     }, []);

//     // '챌린지 만들기' 버튼 클릭 시 호출
//     const CreateChallengeHandler = () => setCreateChallengeOpen(true);

//     // '전체 챌린지 보러가기' 클릭 시 호출
//     const allChallenge = () => {
//         setIsChallengeModalVisible(true);
//     };

//     // CreateChallengeModal 닫기 및 목록 새로고침
//     const closeCreateChallengeModal = () => {
//         setCreateChallengeOpen(false);
//         fetchChallenges(); // 챌린지 생성 후 목록 새로고침
//     };

//     // Challenge 모달 닫기
//     const closeChallengeModal = () => setIsChallengeModalVisible(false);

//     // 챌린지 상세 보기 모달 열기
//     const openChallengeDetail = (challenge) => {
//         setSelectedChallenge(challenge);
//     };

//     // 챌린지 상세 보기 모달 닫기 및 목록 새로고침
//     const closeChallengeDetail = () => {
//         setSelectedChallenge(null);
//         fetchChallenges(); // 챌린지 나가기 후 목록 새로고침
//     };

//     // 날짜 포맷팅
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
//     };

//     // 카테고리 한글 변환
//     const getCategoryName = (category) => {
//         const categoryMap = {
//             'STUDY': '공부',
//             'EXERCISE': '운동',
//             'DAILY': '일상'
//         };
//         return categoryMap[category] || category;
//     };

//     // 챌린지 카드 컴포넌트
//     const ChallengeCard = ({ challenge }) => {
//         const startDate = challenge.created_at ? formatDate(challenge.created_at) : '';
//         const endDate = challenge.end_date ? formatDate(challenge.end_date) : '';

//         return (
//             <div className="challenge-card">
//                 <div className="challenge-card-header">
//                     <h3 className="challenge-title">{challenge.title}</h3>
//                     <span className="challenge-category">{getCategoryName(challenge.category)}</span>
//                 </div>
//                 <div className="challenge-card-body">
//                     <div className="challenge-info">
//                         <p className="challenge-period">
//                             <strong>기간:</strong> {startDate} ~ {endDate}
//                         </p>
//                         <p className="challenge-goal">
//                             <strong>목표:</strong> {challenge.goal}
//                         </p>
//                         <p className="challenge-members">
//                             <strong>참여 인원:</strong> 1명
//                         </p>
//                         {challenge.challenge_code && (
//                             <p className="challenge-code">
//                                 <strong>초대 코드:</strong> {challenge.challenge_code}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//                 <div className="challenge-card-footer">
//                     <button className="challenge-detail-btn" onClick={() => openChallengeDetail(challenge)}>자세히 보기</button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <>
//             {/* 진행 중인 챌린지 모달 */}
//             {!isChallengeModalVisible && (
//                 <div id="ongoing-challenge-modal" className="modal">
//                     <div className="modal-content">
//                         <div className="ongoing-challenge-link">
//                             <a href="#" id="back-to-all-challenges" onClick={allChallenge}>챌린지 전체보기 →</a>
//                         </div>
//                         <div className="modal-header-top">
//                             <div className="header-left">
//                                 <h2>진행중인 챌린지</h2>
//                                 <div className="search-bar">
//                                     <input type="text" id="ongoing-challenge-code-input" placeholder="Enter code" />
//                                     <button className="search-icon" id="ongoing-challenge-code-btn">
//                                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                             <circle cx="11" cy="11" r="8"></circle>
//                                             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                             <button className="create-challenge-btn" onClick={CreateChallengeHandler}>챌린지 만들기</button>
//                         </div>

//                         <div className="challenge-grid">
//                             {loading ? (
//                                 <p className="loading-message">챌린지를 불러오는 중...</p>
//                             ) : challenges.length > 0 ? (
//                                 challenges.map(challenge => (
//                                     <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
//                                 ))
//                             ) : (
//                                 <p className="no-challenges-message">아직 생성된 챌린지가 없습니다. 새로운 챌린지를 만들어보세요!</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* CreateChallengeModal 열기 */}
//             {createChallengeModalOpen && (
//                 <CreateChallengeModal 
//                     setCreateChallengeOpen={setCreateChallengeOpen} 
//                     closeCreateChallengeModal={closeCreateChallengeModal} 
//                 />
//             )}

//             {/* Challenge 모달 (전체 챌린지) */}
//             {isChallengeModalVisible && <Challenge closeChallengeModal={closeChallengeModal} />}

//             {/* 챌린지 상세 보기 모달 */}
//             {selectedChallenge && <ChallengeDetailView challenge={selectedChallenge} onClose={closeChallengeDetail} />}
//         </>
//     );
// }

// export default OngoingChallenge;


// ----------------------------------------------------



//  미리 짜둔 데이터로 실행 

//  import React, { useState, useEffect } from 'react';

// import CreateChallengeModal from '../modal/CreateChallengeModal';

// import EditChallengeModal from '../modal/EditChallengeModal'; 

// import Challenge from './Challenge';

// import ChallengeDetailView from '../ChallengeDetailView';



// function OngoingChallenge() {

//     const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);

//     const [isChallengeModalVisible, setIsChallengeModalVisible] = useState(false);

//     const [loading, setLoading] = useState(false);

//     const [selectedChallenge, setSelectedChallenge] = useState(null);



//     // 1. ⭐️ 사진(image_8fc327)에 보이는 초기 데이터를 그대로 설정합니다.

//     const [challenges, setChallenges] = useState([

//         {

//             challenge_id: 1,

//             title: "asasd",

//             category: "EXERCISE",

//             goal: "asd",

//             created_at: "2026-02-07",

//             end_date: "2026-02-10",

//             name: "adad",

//             challenge_code: "asd"

//         },

//         {

//             challenge_id: 2,

//             title: "zxc",

//             category: "STUDY",

//             goal: "zxzx",

//             created_at: "2026-02-07",

//             end_date: "2026-02-09",

//             name: "이도현",

//             challenge_code: "zxzx"

//         }

//     ]);



//     // 수정 모달 상태 관리

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//     const [challengeToEdit, setChallengeToEdit] = useState(null);



//     // 2. ⭐️ 수정 완료 시 호출될 함수 (로컬 상태 업데이트)

//     const handleUpdateLocal = (updatedData) => {

//         setChallenges(prevChallenges => 

//             prevChallenges.map(ch => 

//                 ch.challenge_id === updatedData.challenge_id ? { ...ch, ...updatedData } : ch

//             )

//         );

//         setIsEditModalOpen(false); // 수정 후 모달 닫기

//     };



//     // 서버 에러 방지를 위해 fetch 로직은 현재 테스트용으로만 둡니다.

//     const fetchChallenges = async () => {

//         console.log("Mock 데이터 모드 실행 중...");

//     };



//     useEffect(() => {

//         fetchChallenges();

//     }, []);



//     const CreateChallengeHandler = () => setCreateChallengeOpen(true);

//     const allChallenge = () => setIsChallengeModalVisible(true);

//     const closeCreateChallengeModal = () => setCreateChallengeOpen(false);

//     const closeChallengeModal = () => setIsChallengeModalVisible(false);

//     const openChallengeDetail = (challenge) => setSelectedChallenge(challenge);

//     const closeChallengeDetail = () => setSelectedChallenge(null);



//     // 수정 모달 열기 함수

//     const openEditModal = (challenge) => {

//         setChallengeToEdit(challenge);

//         setIsEditModalOpen(true);

//     };



//     // 날짜 포맷 함수

//     const formatDate = (dateString) => {

//         if (!dateString) return '';

//         const date = new Date(dateString);

//         return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

//     };



//     // 카테고리 한글 변환 함수

//     const getCategoryName = (category) => {

//         const categoryMap = { 'STUDY': '공부', 'EXERCISE': '운동', 'DAILY': '일상' };

//         return categoryMap[category] || category;

//     };



//     // ⭐️ 챌린지 카드 컴포넌트 (디자인 사진 반영)

//     const ChallengeCard = ({ challenge }) => {

//         const startDate = formatDate(challenge.created_at);

//         const endDate = formatDate(challenge.end_date);



//         return (

//             <div className="challenge-card" style={{ 

//                 border: '1px solid #70c1b3', 

//                 borderRadius: '20px', 

//                 padding: '25px', 

//                 backgroundColor: 'white',

//                 minHeight: '200px',

//                 display: 'flex',

//                 flexDirection: 'column',

//                 justifyContent: 'space-between'

//             }}>

//                 <div>

//                     <div className="challenge-card-header" style={{ marginBottom: '20px' }}>

//                         <h3 style={{ display: 'inline', fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>{challenge.title}</h3>

//                         <span style={{ color: '#888', marginLeft: '8px', fontSize: '0.9rem' }}>({getCategoryName(challenge.category)})</span>

//                     </div>

//                     <div className="challenge-card-body" style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.8' }}>

//                         <p style={{ margin: '5px 0' }}>참여 인원 - 현재 한명 참여중</p>

//                         <p style={{ margin: '5px 0' }}>기간 - {startDate} ~ {endDate}</p>

//                         <p style={{ margin: '5px 0' }}>목표 - {challenge.goal}</p>

//                     </div>

//                 </div>

//                 <div className="challenge-card-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

//                     <button 

//                         className="edit-link" 

//                         style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}

//                         onClick={() => openEditModal(challenge)}

//                     >

//                         수정하기→

//                     </button>

//                     <button 

//                         className="challenge-detail-btn" 

//                         style={{ 

//                             border: '1px solid #247b7b', 

//                             borderRadius: '20px', 

//                             padding: '6px 20px', 

//                             backgroundColor: 'white', 

//                             color: '#247b7b',

//                             cursor: 'pointer',

//                             fontWeight: 'bold'

//                         }}

//                         onClick={() => openChallengeDetail(challenge)}

//                     >

//                         자세히 보기

//                     </button>

//                 </div>

//             </div>

//         );

//     };



//     return (

//         <div style={{ backgroundColor: '#eeeeee', minHeight: '100vh', padding: '60px 20px' }}>

//             {!isChallengeModalVisible && (

//                 <div id="ongoing-challenge-modal" style={{ maxWidth: '1100px', margin: '0 auto' }}>

//                     <div className="modal-content">

//                         <div style={{ textAlign: 'right', marginBottom: '15px' }}>

//                             <a href="#" onClick={allChallenge} style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }}>챌린지 전체보기 →</a>

//                         </div>

                        

//                         <div className="modal-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>

//                             <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>

//                                 <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>진행중인 챌린지</h2>

//                                 <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '25px', padding: '8px 20px', border: '1px solid #ccc' }}>

//                                     <input type="text" placeholder="Enter code" style={{ border: 'none', outline: 'none', width: '180px' }} />

//                                     <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🔍</button>

//                                 </div>

//                             </div>

//                             <button 

//                                 className="create-challenge-btn" 

//                                 style={{ backgroundColor: 'white', border: '1px solid #70c1b3', borderRadius: '25px', padding: '10px 25px', cursor: 'pointer', color: '#247b7b', fontWeight: 'bold' }}

//                                 onClick={CreateChallengeHandler}

//                             >

//                                 챌린지 만들기

//                             </button>

//                         </div>



//                         <div className="challenge-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

//                             {challenges.map(challenge => (

//                                 <ChallengeCard key={challenge.challenge_id} challenge={challenge} />

//                             ))}

//                         </div>

//                     </div>

//                 </div>

//             )}



//             {createChallengeModalOpen && (

//                 <CreateChallengeModal 

//                     setCreateChallengeOpen={setCreateChallengeOpen} 

//                     closeCreateChallengeModal={closeCreateChallengeModal} 

//                 />

//             )}



//             {isChallengeModalVisible && <Challenge closeChallengeModal={closeChallengeModal} />}



//             {selectedChallenge && (

//                 <ChallengeDetailView 

//                     challenge={selectedChallenge} 

//                     onClose={closeChallengeDetail} 

//                 />

//             )}



//             {/* ⭐️ 수정 모달 팝업 */}

//             {isEditModalOpen && (

//                 <EditChallengeModal 

//                     challenge={challengeToEdit} 

//                     onClose={() => setIsEditModalOpen(false)} 

//                     onSuccess={handleUpdateLocal} 

//                 />

//             )}

//         </div>

//     );

// }



// export default OngoingChallenge;


// --------------------------------------------------------------


// 미리 짜둔 데이터가 없는 것 


import React, { useState, useEffect } from 'react';
import CreateChallengeModal from '../modal/CreateChallengeModal';
import EditChallengeModal from '../modal/EditChallengeModal'; 
import Challenge from './Challenge';
import ChallengeDetailView from '../ChallengeDetailView';

function OngoingChallenge() {
    const [createChallengeModalOpen, setCreateChallengeOpen] = useState(false);
    const [isChallengeModalVisible, setIsChallengeModalVisible] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [loading, setLoading] = useState(false);

    // 초기 데이터는 비워둠 (서버에서 불러옴)
    const [challenges, setChallenges] = useState([]);

    // 수정 모달 상태 관리
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [challengeToEdit, setChallengeToEdit] = useState(null);

    // 서버에서 챌린지 목록 불러오기
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

    // 새 챌린지 추가 후 목록 새로고침
    const handleCreateChallenge = () => {
        fetchChallenges();
    };

    // 기존 챌린지 수정 함수
    const handleUpdateLocal = (updatedData) => {
        setChallenges(prevChallenges => 
            prevChallenges.map(ch => 
                ch.challenge_id === updatedData.challenge_id ? { ...ch, ...updatedData } : ch
            )
        );
        setIsEditModalOpen(false);
    };

    const CreateChallengeHandler = () => setCreateChallengeOpen(true);
    const allChallenge = () => setIsChallengeModalVisible(true);
    const closeCreateChallengeModal = () => {
        setCreateChallengeOpen(false);
        fetchChallenges(); // 챌린지 생성 후 목록 새로고침
    };
    const closeChallengeModal = () => setIsChallengeModalVisible(false);
    const openChallengeDetail = (challenge) => setSelectedChallenge(challenge);
    const closeChallengeDetail = () => {
        setSelectedChallenge(null);
        fetchChallenges(); // 챌린지 상세보기 닫은 후 목록 새로고침
    };

    const openEditModal = (challenge) => {
        setChallengeToEdit(challenge);
        setIsEditModalOpen(true);
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
                        <p style={{ margin: '10px 0' }}>참여 인원 - 현재 한명 참여중</p>
                        <p style={{ margin: '10px 0' }}>기간 - {startDate} ~ {endDate}</p>
                        <p style={{ margin: '10px 0' }}>목표 - {challenge.goal}</p>
                    </div>
                </div>
                <div className="challenge-card-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        className="edit-link" 
                        style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '0.95rem' }}
                        onClick={() => openEditModal(challenge)}
                    >
                        수정하기→
                    </button>
                    <button 
                        className="challenge-detail-btn" 
                        style={{ border: '1px solid #247b7b', borderRadius: '20px', padding: '8px 25px', backgroundColor: 'white', color: '#247b7b', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
                        onClick={() => openChallengeDetail(challenge)}
                    >
                        자세히 보기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#eeeeee', minHeight: '100vh', padding: '38px 40px' }}>
            {!isChallengeModalVisible && (
                <div id="ongoing-challenge-modal" style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div className="modal-content">
                        <div className="modal-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', gap: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', letterSpacing: '-0.5px' }}>진행중인 챌린지</h2>
                                
                                {/* ⭐️ 검색창 복구 (사진 디자인 반영) */}
                                <div className="search-bar" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    backgroundColor: 'white', 
                                    borderRadius: '25px', 
                                    padding: '8px 20px', 
                                    border: '1px solid #ccc' 
                                }}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter code" 
                                        style={{ border: 'none', outline: 'none', width: '180px' }} 
                                    />
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <a href="#" onClick={allChallenge} style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>챌린지 전체보기 →</a>
                                <button 
                                    className="create-challenge-btn" 
                                    style={{ backgroundColor: 'white', border: '1px solid #70c1b3', borderRadius: '25px', padding: '10px 25px', cursor: 'pointer', color: '#247b7b', fontWeight: 'bold' }}
                                    onClick={CreateChallengeHandler}
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
                                    아직 진행 중인 챌린지가 없습니다. 상단의 버튼을 눌러 첫 챌린지를 만들어보세요!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {createChallengeModalOpen && (
                <CreateChallengeModal 
                    setCreateChallengeOpen={setCreateChallengeOpen} 
                    closeCreateChallengeModal={closeCreateChallengeModal}
                    onCreateSuccess={handleCreateChallenge} 
                />
            )}

            {isChallengeModalVisible && (
                <Challenge closeChallengeModal={closeChallengeModal} onCreateSuccess={fetchChallenges} />
            )}

            {selectedChallenge && (
                <ChallengeDetailView 
                    challenge={selectedChallenge} 
                    onClose={closeChallengeDetail} 
                />
            )}

            {isEditModalOpen && (
                <EditChallengeModal 
                    challenge={challengeToEdit} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSuccess={handleUpdateLocal} 
                />
            )}
        </div>
    );
}

export default OngoingChallenge;