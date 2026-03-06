


// 사람들의 데이터를 받은 후 (예시)
import React, { useState, useEffect, useCallback } from 'react';
import UserProfilePreviewModal from '../modals/UserProfilePreviewModal';

function Ranking() {
    // 서버에서 사용자 목록을 불러옵니다 (Cloudflare D1의 `users` 테이블)

    const [rankings, setRankings] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [searchResult, setSearchResult] = useState(null); 
    const [profileModal, setProfileModal] = useState({ open: false, userId: null, username: '', anchorPosition: null });

    const openUserProfile = (user, event) => {
        const resolvedUserId = Number(user?.userId);
        const rect = event?.currentTarget?.getBoundingClientRect ? event.currentTarget.getBoundingClientRect() : null;
        setProfileModal({ open: true, userId: Number.isNaN(resolvedUserId) ? null : resolvedUserId, username: user?.username || '', anchorPosition: rect });
    };

    // Fetch users from API (fallback to dummyData)
    const fetchUsers = useCallback(async (opts = {}) => {
        let cancelled = false;
        try {
            const res = await fetch('/api/users');
            const payload = await res.json().catch(() => null);
            if (!res.ok || !payload?.success || !Array.isArray(payload.users)) {
                console.warn('Failed to load /api/users', payload);
                if (!cancelled) setRankings([]);
                return;
            }
            const users = payload.users.map((u) => ({ id: u.userId || u.username, userId: Number(u.userId) || null, username: u.username, score: Number(u.score) || 0 }));
            if (!cancelled) setRankings(users);
        } catch (e) {
            console.error('Error fetching /api/users', e);
            if (!cancelled) setRankings([]);
        }
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        fetchUsers();

        const handler = (event) => {
            // on pointsUpdated, re-fetch rankings to reflect score/tier changes
            fetchUsers();
        };

        window.addEventListener('pointsUpdated', handler);
        return () => {
            window.removeEventListener('pointsUpdated', handler);
        };
    }, [fetchUsers]);

    // 2. 검색 기능 확인 함수
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResult(null);
            return;
        }

        const found = rankings.find(user => 
            String(user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (found) {
            setSearchResult(found);
        } else {
            alert("검색 결과가 없습니다");
            setSearchResult(null);
        }
    };

    // 상위 3명 데이터 (데이터가 있을 때만 추출)
    const top1 = rankings[0];
    const top2 = rankings[1];
    const top3 = rankings[2];

    return (
        <div id="ranking-view" className="ranking-view">
            {/* 상단 TOP 3 섹션 */}
            <div className="ranking-header-section">
                {/* 2등 */}
                    <div className="rank-card rank-2">
                    <div className="rank-icon-wrapper">
                        <img src="/img/rank2.png" alt="2위" className="rank-img" />
                    </div>
                    <div className="rank-user-name" style={{ cursor: 'pointer' }} onClick={(e) => openUserProfile(top2, e)}>{top2?.username || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top2?.score.toLocaleString() || 0}</div>
                    
                </div>

                {/* 1등 */}
                    <div className="rank-card rank-1">
                    <div className="rank-icon-wrapper">
                        <img src="/img/rank1.png" alt="1위" className="rank-img" />
                    </div>
                    <div className="rank-user-name" style={{ cursor: 'pointer' }} onClick={(e) => openUserProfile(top1, e)}>{top1?.username || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top1?.score.toLocaleString() || 0}</div>
                    
                </div>

                {/* 3등 */}
                    <div className="rank-card rank-3">
                    <div className="rank-icon-wrapper">
                        <img src="/img/rank3.png" alt="3위" className="rank-img" />
                    </div>
                    <div className="rank-user-name" style={{ cursor: 'pointer' }} onClick={(e) => openUserProfile(top3, e)}>{top3?.username || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top3?.score.toLocaleString() || 0}</div>
                    
                </div>
            </div>

            {/* 하단 리스트 및 검색창 섹션 */}
            <div className="ranking-list-container">
                <div className="ranking-search-bar">
                    <input 
                        type="text" 
                        placeholder="Your name" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="ranking-search-btn" onClick={handleSearch}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                <div className="ranking-grid-list">
                    {/* 검색 결과가 있으면 결과를, 없으면 전체 리스트를 보여줍니다. */}
                    {searchResult ? (
                        <div className="ranking-list-item" style={{ border: '2px solid #005a44' }}>
                            <div className="r-left">
                                <span className="r-rank">{rankings.indexOf(searchResult) + 1}</span>
                                <span className="r-name" style={{ cursor: 'pointer' }} onClick={(e) => openUserProfile(searchResult, e)}>{searchResult.username}</span>
                            </div>
                            <div className="r-right">
                                <span className="r-label">점수</span>
                                <span className="r-score">{searchResult.score.toLocaleString()}</span>
                                
                            </div>
                        </div>
                    ) : (
                        rankings.slice(3).map((user, index) => (
                            <div key={user.id} className="ranking-list-item">
                                <div className="r-left">
                                    <span className="r-rank">{index + 4}</span>
                                    <span className="r-name" style={{ cursor: 'pointer' }} onClick={(e) => openUserProfile(user, e)}>{user.username}</span>
                                </div>
                                <div className="r-right">
                                    <span className="r-label">점수</span>
                                    <span className="r-score">{user.score.toLocaleString()}</span>
                                    
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="custom-scroll-track"></div>
            </div>

            <UserProfilePreviewModal
                isOpen={profileModal.open}
                userId={profileModal.userId}
                username={profileModal.username}
                anchorPosition={profileModal.anchorPosition}
                onClose={() => setProfileModal({ open: false, userId: null, username: '', anchorPosition: null })}
            />
        </div>
    );
}

export default Ranking;


// -------------------------------------------------------------


// src/components/rankingView/Ranking.jsx

// import React, { useState, useEffect } from 'react';

// function Ranking() {
//     const [rankings, setRankings] = useState([]); 
//     const [searchTerm, setSearchTerm] = useState(""); 
//     const [searchResult, setSearchResult] = useState(null);

//     // 컴포넌트가 로드될 때 서버에서 데이터를 가져옵니다.
//     useEffect(() => {
//         fetch('/api/challenges/scores')
//             .then(res => res.json())
//             .then(data => {
//                 // 내림차순 정렬 (이미 서버에서 했겠지만 안전하게 한 번 더)
//                 const sorted = data.sort((a, b) => b.likes - a.likes);
//                 setRankings(sorted);
//             })
//             .catch(err => console.error("데이터 로드 실패:", err));
//     }, []);

//     const handleSearch = () => {
//         if (!searchTerm.trim()) {
//             setSearchResult(null);
//             return;
//         }
//         const found = rankings.find(user => 
//             user.author.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         if (found) {
//             setSearchResult(found);
//         } else {
//             alert("검색 결과가 없습니다.");
//             setSearchResult(null);
//         }
//     };

//     const top1 = rankings[0];
//     const top2 = rankings[1];
//     const top3 = rankings[2];

//     return (
//         <div id="ranking-view" className="ranking-view">
//             <div className="ranking-header-section">
//                 {/* 2위 */}
//                 <div className="rank-card rank-2">
//                     <div className="rank-icon-wrapper"><img src="/img/rank2.png" alt="2위" className="rank-img" /></div>
//                     <div className="rank-user-name">{top2?.author || "-"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{(top2?.likes || 0).toLocaleString()}</div>
//                 </div>
//                 {/* 1위 */}
//                 <div className="rank-card rank-1">
//                     <div className="rank-icon-wrapper"><img src="/img/rank1.png" alt="1위" className="rank-img" /></div>
//                     <div className="rank-user-name">{top1?.author || "-"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{(top1?.likes || 0).toLocaleString()}</div>
//                 </div>
//                 {/* 3위 */}
//                 <div className="rank-card rank-3">
//                     <div className="rank-icon-wrapper"><img src="/img/rank3.png" alt="3위" className="rank-img" /></div>
//                     <div className="rank-user-name">{top3?.author || "-"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{(top3?.likes || 0).toLocaleString()}</div>
//                 </div>
//             </div>

//             <div className="ranking-list-container">
//                 <div className="ranking-search-bar">
//                     <input 
//                         type="text" 
//                         placeholder="Your name" 
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                     />
//                     <button className="ranking-search-btn" onClick={handleSearch}>
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
//                             <circle cx="11" cy="11" r="8"></circle>
//                             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                         </svg>
//                     </button>
//                 </div>

//                 <div className="ranking-grid-list">
//                     {searchResult ? (
//                         <div className="ranking-list-item" style={{ border: '2px solid #0d6b63' }}>
//                             <div className="r-left">
//                                 <span className="r-rank">{rankings.indexOf(searchResult) + 1}</span> 
//                                 <span className="r-name">{searchResult.author}</span>
//                             </div>
//                             <div className="r-right">
//                                 <span className="r-label">점수</span> 
//                                 <span className="r-score">{searchResult.likes.toLocaleString()}</span>
//                             </div>
//                         </div>
//                     ) : (
//                         rankings.slice(3).map((user, index) => (
//                             <div key={index} className="ranking-list-item">
//                                 <div className="r-left">
//                                     <span className="r-rank">{index + 4}</span> 
//                                     <span className="r-name">{user.author}</span>
//                                 </div>
//                                 <div className="r-right">
//                                     <span className="r-label">점수</span> 
//                                     <span className="r-score">{user.likes.toLocaleString()}</span>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Ranking;