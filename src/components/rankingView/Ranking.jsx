// function Ranking() {
//     return (

//         <div id="ranking-view" className="ranking-view">
//             <div className="ranking-header-section">
//                 {/* {/* 2등 */}
//                 <div className="rank-card rank-2">
//                     <div className="rank-icon-wrapper">
//                         <img src="/img/rank2.png" alt="2위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">박현서</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">1,998</div>
//                 </div>
//                 {/* {/* 1등 */}
//                 <div className="rank-card rank-1">
//                     <div className="rank-icon-wrapper">
//                         <img src="/img/rank1.png" alt="1위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">김예선</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">3,447</div>
//                 </div>
//                 {/* {/* 3등 */}
//                 <div className="rank-card rank-3">
//                     <div className="rank-icon-wrapper">
//                         <img src="/img/rank3.png" alt="3위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">유태민</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">1,358</div>
//                 </div>
//             </div>

//             <div className="ranking-list-container">
//                 <div className="ranking-search-bar">
//                     <input type="text" placeholder="Your name" />
//                     <button className="ranking-search-btn">
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                     </button>
//                 </div>

//                 <div className="ranking-grid-list">
//                     {/* {/* 4등 */}
//                     <div className="ranking-list-item">
//                         <div className="r-left"><span className="r-rank">4</span> <span className="r-name">신유빈</span></div>
//                         <div className="r-right"><span className="r-label">점수</span> <span className="r-score">985</span></div>
//                     </div>
//                 </div>
//                 {/* {/* Scrollbar track visual */}
//                 <div className="custom-scroll-track"></div>
//             </div>
//         </div>
//     );
// };
// export default Ranking;


// ---------------------------------------------------------------



// 사람들의 데이터를 받기 전
// import React, { useState, useEffect } from 'react';

// function Ranking() {
//     const [rankings, setRankings] = useState([]); // 전체 순위 데이터
//     const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력 상태
//     const [searchResult, setSearchResult] = useState(null); // 검색 버튼 클릭 결과

//     // 1. 서버 데이터 가져오기 및 정렬
//     useEffect(() => {
//         const fetchRankings = async () => {
//             try {
//                 const resp = await fetch('/api/post/posts');
//                 const data = await resp.json();
                
//                 // 점수(likes) 높은 순으로 정렬
//                 const sorted = data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
//                 setRankings(sorted);
//             } catch (err) {
//                 console.error("랭킹 데이터 호출 실패:", err);
//             }
//         };
//         fetchRankings();
//     }, []);

//     // 2. 검색 실행 함수
//     const handleSearch = () => {
//         if (!searchTerm.trim()) return;

//         // 이름(author)으로 검색 (대소문자 무시)
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

//     // 상위 3명 추출 (데이터가 있을 때만)
//     const top1 = rankings[0];
//     const top2 = rankings[1];
//     const top3 = rankings[2];

//     return (
//         <div id="ranking-view" className="ranking-view">
//             <div className="ranking-header-section">
//                 {/* 2등 */}
//                 <div className="rank-card rank-2">
//                     <div className="rank-icon-wrapper">
//                         <img src="img/2위.png" alt="2위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">{top2 ? top2.author : "대기 중"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{top2 ? top2.likes.toLocaleString() : "0"}</div>
//                 </div>

//                 {/* 1등 */}
//                 <div className="rank-card rank-1">
//                     <div className="rank-icon-wrapper">
//                         <img src="img/1위.png" alt="1위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">{top1 ? top1.author : "대기 중"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{top1 ? top1.likes.toLocaleString() : "0"}</div>
//                 </div>

//                 {/* 3등 */}
//                 <div className="rank-card rank-3">
//                     <div className="rank-icon-wrapper">
//                         <img src="img/3위.png" alt="3위" className="rank-img" />
//                     </div>
//                     <div className="rank-user-name">{top3 ? top3.author : "대기 중"}</div>
//                     <div className="rank-user-label">점수</div>
//                     <div className="rank-user-score">{top3 ? top3.likes.toLocaleString() : "0"}</div>
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
//                     {/* 검색 결과가 있으면 검색 결과를 보여주고, 없으면 기본 4등을 보여줌 */}
//                     {searchResult ? (
//                         <div className="ranking-list-item result-active">
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
//                         // 검색 전에는 기본적으로 상위 리스트 중 4등 이후를 보여줄 수 있음 (예시로 4등만 표시)
//                         rankings.slice(3, 4).map((user, idx) => (
//                             <div key={idx} className="ranking-list-item">
//                                 <div className="r-left">
//                                     <span className="r-rank">4</span> 
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
//                 <div className="custom-scroll-track"></div>
//             </div>
//         </div>
//     );
// }

// export default Ranking;


// -----------------------------------------------------------------


// 사람들의 데이터를 받은 후 (예시)
import React, { useState, useEffect } from 'react';

function Ranking() {
    // 실제 서버 데이터 대신 사용할 테스트용 가짜 데이터
    const dummyData = [
        { id: 1, author: "김예선", likes: 3447 },
        { id: 2, author: "박현서", likes: 1998 },
        { id: 3, author: "유태민", likes: 1358 },
        { id: 4, author: "신유빈", likes: 985 },
        { id: 5, author: "이도현", likes: 820 },
        { id: 6, author: "최지우", likes: 750 },
    ];

    const [rankings, setRankings] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [searchResult, setSearchResult] = useState(null); 

    // 1. 확인용 로직: 처음 실행될 때 테스트 데이터를 상태에 저장합니다.
    useEffect(() => {
        // 나중에 서버를 연결할 때는 이 부분을 fetch 코드로 바꾸면 됩니다.
        const sorted = [...dummyData].sort((a, b) => b.likes - a.likes);
        setRankings(sorted);
    }, []);

    // 2. 검색 기능 확인 함수
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResult(null);
            return;
        }

        const found = rankings.find(user => 
            user.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (found) {
            setSearchResult(found);
        } else {
            alert("검색 결과가 없습니다. (테스트 데이터: 김예선, 박현서, 유태민, 신유빈 등)");
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
                    <div className="rank-user-name">{top2?.author || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top2?.likes.toLocaleString() || 0}</div>
                </div>

                {/* 1등 */}
                <div className="rank-card rank-1">
                    <div className="rank-icon-wrapper">
                        <img src="/img/rank1.png" alt="1위" className="rank-img" />
                    </div>
                    <div className="rank-user-name">{top1?.author || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top1?.likes.toLocaleString() || 0}</div>
                </div>

                {/* 3등 */}
                <div className="rank-card rank-3">
                    <div className="rank-icon-wrapper">
                        <img src="/img/rank3.png" alt="3위" className="rank-img" />
                    </div>
                    <div className="rank-user-name">{top3?.author || "데이터 없음"}</div>
                    <div className="rank-user-label">점수</div>
                    <div className="rank-user-score">{top3?.likes.toLocaleString() || 0}</div>
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
                                <span className="r-name">{searchResult.author}</span>
                            </div>
                            <div className="r-right">
                                <span className="r-label">점수</span> 
                                <span className="r-score">{searchResult.likes.toLocaleString()}</span>
                            </div>
                        </div>
                    ) : (
                        rankings.slice(3).map((user, index) => (
                            <div key={user.id} className="ranking-list-item">
                                <div className="r-left">
                                    <span className="r-rank">{index + 4}</span> 
                                    <span className="r-name">{user.author}</span>
                                </div>
                                <div className="r-right">
                                    <span className="r-label">점수</span> 
                                    <span className="r-score">{user.likes.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="custom-scroll-track"></div>
            </div>
        </div>
    );
}

export default Ranking;