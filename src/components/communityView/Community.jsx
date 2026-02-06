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
    const [currentCategory, setCurrentCategory] = useState('popular');
    
    // 기본 게시글 데이터
    const defaultPosts = {
        popular: [
            { id: 11, title: '인기: 미적분 베스트', content: '많은 좋아요를 받은 문제풀이 공유글', author: '인기유저', likes: 0, comments: 0, date: '2025.12.01', category: 'popular', liked: false },
            { id: 12, title: '인기: 공부 팁 모음', content: '효율적 공부법 정리', author: '팁러', likes: 0, comments: 0, date: '2025.12.05', category: 'popular', liked: false }
        ],
        tips: [
            { id: 21, title: '효율적 공부법', content: '짧고 굵게 집중하는 방법들...', author: '팁글러', likes: 0, comments: 0, date: '2025.10.12', category: 'tips', liked: false },
            { id: 22, title: '시간관리 팁', content: '포모도로 기법 활용법', author: '시간관리러', likes: 0, comments: 0, date: '2025.11.01', category: 'tips', liked: false }
        ],
        data: [
            { id: 1, title: '미적분 문제 질문이요!', content: '치환적분 문제인데 도와주세요', author: '수학 고민러', likes: 0, comments: 0, date: '2025.12.29 12:15', category: 'data', liked: false },
            { id: 2, title: '한국사 정리 노트 공유', content: '시대별 요점 정리본 업로드합니다.', author: '역사 덕후', likes: 0, comments: 0, date: '2025.11.10 09:00', category: 'data', liked: false }
        ],
        mypost: []
    };
    
    // localStorage에서 게시글 불러오기
    const loadPostsFromStorage = () => {
        try {
            const savedPosts = localStorage.getItem('communityPosts');
            if (savedPosts) {
                return JSON.parse(savedPosts);
            }
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
        }
        return defaultPosts;
    };
    
    // 게시글 상태 관리
    const [posts, setPosts] = useState(loadPostsFromStorage);
    
    // posts가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        try {
            localStorage.setItem('communityPosts', JSON.stringify(posts));
        } catch (error) {
            console.error('게시글 저장 실패:', error);
        }
    }, [posts]);
    
    const newPost = (category) => {
        setCurrentCategory(category || activeTab);
        setNewPostModalOpen(true);
    };
    
    // 새 게시글 추가 함수
    const handleAddPost = (newPost) => {
        const username = localStorage.getItem('username') || '익명';
        const postWithDetails = {
            ...newPost,
            id: Date.now(),
            author: username,
            likes: 0,
            comments: 0,
            liked: false,
            date: new Date().toLocaleString('ko-KR'),
        };
        
        setPosts(prev => ({
            ...prev,
            [newPost.category]: [...prev[newPost.category], postWithDetails],
            mypost: [...prev.mypost, postWithDetails]
        }));
        
        setNewPostModalOpen(false);
    };

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

    // 게시글 삭제 함수
    const handleDeletePost = (postId) => {
        setPosts(prev => ({
            popular: prev.popular.filter(p => p.id !== postId),
            tips: prev.tips.filter(p => p.id !== postId),
            data: prev.data.filter(p => p.id !== postId),
            mypost: prev.mypost.filter(p => p.id !== postId)
        }));
    };

    // 게시글 수정 함수
    const handleEditPost = (updatedPost) => {
        setPosts(prev => ({
            popular: prev.popular.map(p => p.id === updatedPost.id ? updatedPost : p),
            tips: prev.tips.map(p => p.id === updatedPost.id ? updatedPost : p),
            data: prev.data.map(p => p.id === updatedPost.id ? updatedPost : p),
            mypost: prev.mypost.map(p => p.id === updatedPost.id ? updatedPost : p)
        }));
    };

    // 2. 페이지 진입 시 실행 (오늘 하루 그만보기 로직)
    useEffect(() => {
        // localStorage에 저장된 날짜 확인
        const hiddenDate = localStorage.getItem('hideCommunityRewardModal');
        const today = new Date().toDateString();
        
        // 저장된 날짜가 없거나, 저장된 날짜가 오늘이 아니면 팝업 표시
        if (!hiddenDate || hiddenDate !== today) {
            setModalOpen(true);
        }
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
        // PostDetailView가 열려있으면 닫기
        if (showPostDetail) {
            setShowPostDetail(false);
            setSelectedPost(null);
        }
        
        if (tab === activeTab && !showPostDetail) return;
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
                        activeTab === 'popular' ? <Popular posts={posts.popular} onOpenPost={detailPostView} onNewPost={() => newPost('popular')} /> :
                        activeTab === 'tips' ? <Tips posts={posts.tips} onOpenPost={detailPostView} onNewPost={() => newPost('tips')} /> :
                        activeTab === 'data' ? <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} /> :
                        activeTab === 'mypost' ? <MyPost posts={posts.mypost} onOpenPost={detailPostView} onNewPost={() => newPost('mypost')} /> :
                        <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} />
                    ) : (
                        <PostDetailView 
                            post={selectedPost} 
                            onClose={closeDetailView} 
                            onDeletePost={handleDeletePost}
                            onEditPost={handleEditPost}
                        />
                    )}
                </div>
            </div>

            {/* 3. 모달 연결 (선생님 방식) */}
            {isModalOpen && (
                <CommunityRewardModal onClose={() => setModalOpen(false)} />
            )}
            {isNewPostModalOpen && (
                <NewPostModal 
                    category={currentCategory} 
                    onClose={() => setNewPostModalOpen(false)} 
                    onSubmit={handleAddPost}
                />
            )}
            
        </div>
    );
}

export default Community;