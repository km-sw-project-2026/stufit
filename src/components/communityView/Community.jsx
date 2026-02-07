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
    
    // 게시글 상태 관리 (서버 연동)
    const [posts, setPosts] = useState({
        popular: [],
        tips: [],
        data: [],
        mypost: []
    });

    const username = localStorage.getItem('username');

    // 서버에서 게시글 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts', {
                    method: 'GET'
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        const allPosts = result.data;
                        
                        // 카테고리별 분류
                        const classifiedPosts = {
                            popular: allPosts.filter(p => p.category === 'popular'),
                            tips: allPosts.filter(p => p.category === 'tips'),
                            data: allPosts.filter(p => p.category === 'data'),
                            mypost: allPosts.filter(p => p.author === username)
                        };
                        setPosts(classifiedPosts);
                    }
                }
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, [username]);
    
    const newPost = (category) => {
        setCurrentCategory(category || activeTab);
        setNewPostModalOpen(true);
    };
    
    // 새 게시글 추가 함수 (API 호출)
    const handleAddPost = async (newPost) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username || '익명' // 인증 헤더
                },
                body: JSON.stringify(newPost)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const createdPost = result.data;
                    
                    setPosts(prev => ({
                        ...prev,
                        [createdPost.category]: [createdPost, ...prev[createdPost.category]],
                        mypost: username === createdPost.author ? [createdPost, ...prev.mypost] : prev.mypost
                    }));
                    setNewPostModalOpen(false);
                } else {
                    alert('게시글 작성 실패: ' + result.message);
                }
            } else {
                 if (response.status === 401) {
                     alert('로그인이 필요합니다.');
                 } else {
                     alert('서버 오류가 발생했습니다.');
                 }
            }
        } catch (error) {
            console.error('게시글 작성 중 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        }
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

    // 게시글 삭제 함수 (API 연동)
    const handleDeletePost = async (postId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'X-Username': username || '익명'
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setPosts(prev => ({
                        popular: prev.popular.filter(p => p.id !== postId),
                        tips: prev.tips.filter(p => p.id !== postId),
                        data: prev.data.filter(p => p.id !== postId),
                        mypost: prev.mypost.filter(p => p.id !== postId)
                    }));
                    
                    // 상세 뷰가 열려있으면 닫기
                    if (showPostDetail && selectedPost && selectedPost.id === postId) {
                        closeDetailView();
                    }
                } else {
                    alert('삭제 실패: ' + result.message);
                }
            } else {
                alert('삭제 권한이 없거나 서버 오류입니다.');
            }
        } catch (error) {
            console.error('삭제 중 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        }
    };

    // 게시글 수정 함수 (API 연동)
    const handleEditPost = async (updatedPost) => {
        try {
            const response = await fetch(`/api/post/${updatedPost.id}`, {
                method: 'PUT',
                headers: {
                     'Content-Type': 'application/json',
                    'X-Username': username || '익명'
                },
                body: JSON.stringify({
                    title: updatedPost.title,
                    content: updatedPost.content
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // 서버에서 받은 업데이트된 데이터로 상태 갱신
                    // (날짜 등 서버 데이터 활용 가능하나 일단 클라이언트 상태 업데이트)
                    setPosts(prev => ({
                        popular: prev.popular.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
                        tips: prev.tips.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
                        data: prev.data.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
                        mypost: prev.mypost.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p)
                    }));
                } else {
                     alert('수정 실패: ' + result.message);
                }
            } else {
                 alert('수정 권한이 없거나 서버 오류입니다.');
            }
        } catch (error) {
            console.error('수정 중 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        }
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