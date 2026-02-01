// function Community(){
//   return(
//     <div id="community-view" className="community-view">
//                 <div className="community-layout">
//                     {/* {/* 사이드바 */}
//                     <div className="community-sidebar">
//                         <div className="sidebar-menu">
//                             <div className="menu-header">Jamawar Crowne Plaza</div>
//                             <div className="menu-item" id="menu-popular">Popular Posts</div>
//                             <div className="menu-item" id="menu-tips">Tips & How-To</div>
//                             <div className="menu-item active" id="menu-data">Data Sharing</div>
//                             <div className="menu-item" id="menu-mypost">My Post</div>
//                         </div>
//                     </div>

//                     {/* {/* 메인 컨텐츠 */}
//                     <div className="community-main">
//                         <div id="community-feed-view">
//                             <div className="community-title-section">
//                                 <h2>Latest Community</h2>
//                                 <p>다양한 질문과 정보를 나누며 커뮤니티를 즐겨보세요</p>
//                             </div>

//                             <div className="community-board-container">
//                                 <div className="community-feed">
//                                     <div className="feed-card">
//                                         <div className="feed-header">
//                                             <div className="feed-user-info">
//                                                 <div className="feed-user-avatar"></div>
//                                                 <span className="feed-user-name">수학 고민러</span>
//                                             </div>
//                                             <div className="feed-meta">
//                                                 <span className="like-count">♡ 34</span>
//                                                 <span className="comment-count">💬 17</span>
//                                             </div>
//                                         </div>
//                                         <div className="feed-content">
//                                             <h3>미적분 문제 질문이요!</h3>
//                                             <p>치환적분 문제인데 도와주세요</p>
//                                         </div>
//                                     </div>

//                                     <div className="feed-card">
//                                         <div className="feed-header">
//                                             <div className="feed-user-info">
//                                                 <div className="feed-user-avatar"></div>
//                                                 <span className="feed-user-name">공부병아리</span>
//                                             </div>
//                                             <div className="feed-meta">
//                                                 <span className="like-count">♡ 10</span>
//                                                 <span className="comment-count">💬 15</span>
//                                             </div>
//                                         </div>
//                                         <div className="feed-content">
//                                             <h3>기말고사 계획 도와주세요</h3>
//                                             <p>전교 1등이 기말고사 계획 도와주세요!</p>
//                                         </div>
//                                     </div>

//                                     <div className="feed-card">
//                                         <div className="feed-header">
//                                             <div className="feed-user-info">
//                                                 <div className="feed-user-avatar"></div>
//                                                 <span className="feed-user-name">역사 덕후</span>
//                                             </div>
//                                             <div className="feed-meta">
//                                                 <span className="like-count">♡ 24</span>
//                                                 <span className="comment-count">💬 9</span>
//                                             </div>
//                                         </div>
//                                         <div className="feed-content">
//                                             <h3>한국사 정리 노트 공유</h3>
//                                             <p>시대별로 정리한 한국사 노트 공유해요~</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="community-board-sidebar">
//                                     <button className="btn-new-post">New Post</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//   );
// }
// export default Community;






// --------------------------------------------



// import React, { useState, useEffect } from 'react';
// // 1. 모달 컴포넌트 연결
// import CommunityRewardModal from '../modal/CommunityRewardModal';

// function Community() {
//     // 2. 모달 열림 상태 관리
//     const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

//     // 3. 페이지 접속 시 모달 띄우기
//     useEffect(() => {
//         setIsRewardModalOpen(true);
//     }, []);

//     // 4. 모달 닫기 함수
//     const closeModal = () => {
//         setIsRewardModalOpen(false);
//     };

//     return (
//         <div id="community-view" className="community-view">
//             <div className="community-layout">
//                 {/* 사이드바 */}
//                 <div className="community-sidebar">
//                     <div className="sidebar-menu">
//                         <div className="menu-header">Jamawar Crowne Plaza</div>
//                         <div className="menu-item" id="menu-popular">Popular Posts</div>
//                         <div className="menu-item" id="menu-tips">Tips & How-To</div>
//                         <div className="menu-item active" id="menu-data">Data Sharing</div>
//                         <div className="menu-item" id="menu-mypost">My Post</div>
//                     </div>
//                 </div>

//                 {/* 메인 컨텐츠 */}
//                 <div className="community-main">
//                     <div id="community-feed-view">
//                         <div className="community-title-section">
//                             <h2>Latest Community</h2>
//                             <p>다양한 질문과 정보를 나누며 커뮤니티를 즐겨보세요</p>
//                         </div>

//                         <div className="community-board-container">
//                             <div className="community-feed">
//                                 {/* 게시글 카드 1 */}
//                                 <div className="feed-card">
//                                     <div className="feed-header">
//                                         <div className="feed-user-info">
//                                             <div className="feed-user-avatar"></div>
//                                             <span className="feed-user-name">수학 고민러</span>
//                                         </div>
//                                         <div className="feed-meta">
//                                             <span className="like-count">♡ 34</span>
//                                             <span className="comment-count">💬 17</span>
//                                         </div>
//                                     </div>
//                                     <div className="feed-content">
//                                         <h3>미적분 문제 질문이요!</h3>
//                                         <p>치환적분 문제인데 도와주세요</p>
//                                     </div>
//                                 </div>
//                                 {/* ... 다른 카드들 (생략) ... */}
//                             </div>
//                             <div className="community-board-sidebar">
//                                 <button className="btn-new-post">New Post</button>
//                             </div>
//                         </div>
//                     </div>
//                     {/* 상세 보기 뷰 (기존 코드 유지) */}
//                     <div id="post-detail-view" className="hidden">
//                         {/* ... 상세 내용 ... */}
//                     </div>
//                 </div>
//             </div>

//             {/* 5. 모달 연결: 상태가 true일 때만 렌더링 */}
//             {isRewardModalOpen && (
//                 <CommunityRewardModal onClose={closeModal} />
//             )}
//         </div>
//     );
// }

// export default Community;




// -----------------------------------------------------------------



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 모달 파일 경로가 맞는지 꼭 확인하세요!
import CommunityRewardModal from '../modal/CommunityRewardModal';
import NewPostModal from '../modal/NewPostModal';
import PostDetailView from './PostDetailView';
import SidebarMenu from './SidebarMenu';
import Popular from './Popular';
import Tips from './Tips';
import DataSharing from './DataSharing';
import MyPost from './MyPost';

function Community() {
    // 1. 모달 상태 관리 (선생님 방식)
    const [isModalOpen, setModalOpen] = useState(false);

    const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
    const newPost = () => setNewPostModalOpen(true);

    // Post detail state & handlers
    const [showPostDetail, setShowPostDetail] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const detailPostView = (post) => {
        setSelectedPost(post);
        setShowPostDetail(true);
    };

    const closeDetailView = () => {
        setShowPostDetail(false);
        setSelectedPost(null);
    };

    // 2. 페이지 진입 시 실행 (오늘 하루 그만보기 로직)
    useEffect(() => {
        // 복구: 사용자가 이전에 체크한 "오늘하루 그만보기" 값을 제거해서
        // 커뮤니티 진입 시 항상 팝업이 뜨도록 합니다.
        localStorage.removeItem('hideCommunityRewardModal');
        setModalOpen(true);
    }, []);

    // 라우팅: 쿼리 스트링(tab) 동기화 및 네비게이션 헬퍼
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentTab = params.get('tab') || 'popular';
    const [activeTab, setActiveTab] = useState(currentTab);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get('tab') || 'popular';
        setActiveTab(t);
    }, [location.search]);

    // URL에 탭 파라미터가 없으면 기본 탭을 'popular'로 채워 넣습니다 (replace 해서 히스토리 오염 방지)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (!params.get('tab')) {
            navigate({ pathname: location.pathname, search: '?tab=popular' }, { replace: true });
            setActiveTab('popular');
        }
    }, [location.pathname, location.search, navigate]);

    const goToTab = (tab) => {
        if (tab === activeTab) return;
        navigate({ pathname: '/community', search: `?tab=${tab}` });
        setActiveTab(tab);
    };

    return (
        <div id="community-view" className="community-view">
            <div className="community-layout">
                {/* 사이드바 영역 */}
                <SidebarMenu activeTab={activeTab} goToTab={goToTab} />

                {/* 메인 컨텐츠 영역 */}
                <div className="community-main">
                    {/* 메인과 상세를 서로 교체해서 보여 줍니다 */}
                    {!showPostDetail ? (
                        activeTab === 'popular' ? <Popular onOpenPost={detailPostView} onNewPost={newPost} /> :
                        activeTab === 'tips' ? <Tips onOpenPost={detailPostView} onNewPost={newPost} /> :
                        activeTab === 'data' ? <DataSharing onOpenPost={detailPostView} onNewPost={newPost} /> :
                        activeTab === 'mypost' ? <MyPost onOpenPost={detailPostView} onNewPost={newPost} /> :
                        <DataSharing onOpenPost={detailPostView} onNewPost={newPost} />
                    ) : (
                        <PostDetailView post={selectedPost} onClose={closeDetailView} />
                    )}
                </div>
            </div>

            {/* 3. 모달 연결 (선생님 방식) */}
            {isModalOpen && (
                <CommunityRewardModal onClose={() => setModalOpen(false)} />
            )}
            {isNewPostModalOpen && (
                <NewPostModal onClose={() => setNewPostModalOpen(false)} />
            )}
            
        </div>
    );
}

export default Community;