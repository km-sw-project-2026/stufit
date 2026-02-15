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


// --------------------------------------------


// import React, { useState, useEffect } from 'react';
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



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// // 모달 파일 경로가 맞는지 꼭 확인하세요!
// import CommunityRewardModal from '../modal/CommunityRewardModal';
// import NewPostModal from '../modal/NewPostModal';
// import PostDetailView from './PostDetailView';
// import SidebarMenu from './SidebarMenu';
// import Popular from './Popular';
// import Tips from './Tips';
// import DataSharing from './DataSharing';
// import MyPost from './MyPost';

// function Community() {
//     // 1. 모달 상태 관리 (선생님 방식)
//     const [isModalOpen, setModalOpen] = useState(false);

//     const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
//     const [currentCategory, setCurrentCategory] = useState('popular');
    
//     // 기본 게시글 데이터
//     const defaultPosts = {
//         popular: [
//             { id: 11, title: '인기: 미적분 베스트', content: '많은 좋아요를 받은 문제풀이 공유글', author: '인기유저', likes: 0, comments: 0, date: '2025.12.01', category: 'popular', liked: false },
//             { id: 12, title: '인기: 공부 팁 모음', content: '효율적 공부법 정리', author: '팁러', likes: 0, comments: 0, date: '2025.12.05', category: 'popular', liked: false }
//         ],
//         tips: [
//             { id: 21, title: '효율적 공부법', content: '짧고 굵게 집중하는 방법들...', author: '팁글러', likes: 0, comments: 0, date: '2025.10.12', category: 'tips', liked: false },
//             { id: 22, title: '시간관리 팁', content: '포모도로 기법 활용법', author: '시간관리러', likes: 0, comments: 0, date: '2025.11.01', category: 'tips', liked: false }
//         ],
//         data: [],
//         mypost: []
//     };
    
//     // 게시글 상태 관리
//     const [posts, setPosts] = useState(defaultPosts);

//     const mapPost = (row) => ({
//         id: row.post_id,
//         title: row.title,
//         content: row.content,
//         author: row.username || '익명',
//         likes: Number(row.like_count) || 0,
//         comments: Number(row.comment_count) || 0,
//         liked: Boolean(row.user_liked),
//         date: row.created_at ? new Date(row.created_at).toLocaleString('ko-KR') : ''
//     });

//     const fetchPosts = async () => {
//         try {
//             const username = localStorage.getItem('username');
//             const headers = {};
//             if (username) headers['X-Username'] = username;
//             const response = await fetch('/api/posts', { headers });
//             if (!response.ok) return;
//             const payload = await response.json();
//             const list = (payload.data || []).map(mapPost);
//             setPosts((prev) => ({
//                 ...prev,
//                 data: list,
//                 mypost: username ? list.filter((p) => p.author === username) : []
//             }));
//         } catch (error) {
//             console.error('게시글 불러오기 실패:', error);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);
    
//     const newPost = (category) => {
//         setCurrentCategory(category || activeTab);
//         setNewPostModalOpen(true);
//     };
    
//     // 새 게시글 추가 함수
//     const handleAddPost = async (newPost) => {
//         const username = localStorage.getItem('username');
//         if (!username) {
//             alert('로그인이 필요합니다.');
//             return;
//         }
//         try {
//             const response = await fetch('/api/posts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: newPost.title,
//                     content: newPost.content
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) {
//                 alert(payload.message || '게시글 작성에 실패했습니다.');
//                 return;
//             }

//             const created = payload.data ? mapPost(payload.data) : null;
//             if (created) {
//                 setPosts((prev) => ({
//                     ...prev,
//                     data: [created, ...prev.data],
//                     mypost: [created, ...prev.mypost]
//                 }));
//             } else {
//                 fetchPosts();
//             }
//             setNewPostModalOpen(false);
//         } catch (error) {
//             console.error('게시글 작성 실패:', error);
//             alert('게시글 작성에 실패했습니다.');
//         }
//     };

//     // Post detail state & handlers
//     const [showPostDetail, setShowPostDetail] = useState(false);
//     const [selectedPost, setSelectedPost] = useState(null);

//     const detailPostView = (post) => {
//         setSelectedPost(post);
//         setShowPostDetail(true);
//     };

//     const closeDetailView = () => {
//         setShowPostDetail(false);
//         setSelectedPost(null);
//     };

//     // 게시글 삭제 함수
//     const handleDeletePost = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) {
//             alert('로그인이 필요합니다.');
//             return;
//         }

//         try {
//             const response = await fetch(`/api/post/${postId}`, {
//                 method: 'DELETE',
//                 headers: { 'X-Username': username }
//             });

//             if (!response.ok) {
//                 const payload = await response.json().catch(() => ({}));
//                 alert(payload.message || '게시글 삭제에 실패했습니다.');
//                 return;
//             }

//             setPosts(prev => ({
//                 ...prev,
//                 data: prev.data.filter(p => p.id !== postId),
//                 mypost: prev.mypost.filter(p => p.id !== postId)
//             }));
//         } catch (error) {
//             console.error('게시글 삭제 실패:', error);
//             alert('게시글 삭제에 실패했습니다.');
//         }
//     };

//     // 게시글 수정 함수
//     const handleEditPost = async (updatedPost) => {
//         const username = localStorage.getItem('username');
//         if (!username) {
//             alert('로그인이 필요합니다.');
//             return;
//         }
//         try {
//             const response = await fetch(`/api/post/${updatedPost.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: updatedPost.title,
//                     content: updatedPost.content
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) {
//                 alert(payload.message || '게시글 수정에 실패했습니다.');
//                 return;
//             }

//             const saved = payload.data ? mapPost(payload.data) : updatedPost;
//             setPosts(prev => ({
//                 ...prev,
//                 data: prev.data.map(p => p.id === saved.id ? { ...p, ...saved } : p),
//                 mypost: prev.mypost.map(p => p.id === saved.id ? { ...p, ...saved } : p)
//             }));
//         } catch (error) {
//             console.error('게시글 수정 실패:', error);
//             alert('게시글 수정에 실패했습니다.');
//         }
//     };

//     const handleUpdatePostState = (updatedPost) => {
//         setPosts(prev => ({
//             ...prev,
//             data: prev.data.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             mypost: prev.mypost.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p)
//         }));
//     };

//     const handleToggleLike = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) {
//             alert('로그인이 필요합니다.');
//             return;
//         }

//         try {
//             const response = await fetch(`/api/post/${postId}/like`, {
//                 method: 'POST',
//                 headers: { 'X-Username': username }
//             });
//             const payload = await response.json();
//             if (!response.ok) {
//                 alert(payload.message || '좋아요 처리에 실패했습니다.');
//                 return;
//             }

//             const { liked, count } = payload.data || {};
//             setPosts(prev => ({
//                 ...prev,
//                 data: prev.data.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 mypost: prev.mypost.map(p => p.id === postId ? { ...p, liked, likes: count } : p)
//             }));
//         } catch (error) {
//             console.error('좋아요 처리 실패:', error);
//             alert('좋아요 처리에 실패했습니다.');
//         }
//     };

//     // 2. 페이지 진입 시 실행 (오늘 하루 그만보기 로직)
//     useEffect(() => {
//         // localStorage에 저장된 날짜 확인
//         const hiddenDate = localStorage.getItem('hideCommunityRewardModal');
//         const today = new Date().toDateString();
        
//         // 저장된 날짜가 없거나, 저장된 날짜가 오늘이 아니면 팝업 표시
//         if (!hiddenDate || hiddenDate !== today) {
//             setModalOpen(true);
//         }
//     }, []);

//     // 라우팅: 쿼리 스트링(tab) 동기화 및 네비게이션 헬퍼
//     const navigate = useNavigate();
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const currentTab = params.get('tab') || 'popular';
//     const [activeTab, setActiveTab] = useState(currentTab);

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const t = params.get('tab') || 'popular';
//         setActiveTab(t);
//     }, [location.search]);

//     // URL에 탭 파라미터가 없으면 기본 탭을 'popular'로 채워 넣습니다 (replace 해서 히스토리 오염 방지)
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         if (!params.get('tab')) {
//             navigate({ pathname: location.pathname, search: '?tab=popular' }, { replace: true });
//             setActiveTab('popular');
//         }
//     }, [location.pathname, location.search, navigate]);

//     const goToTab = (tab) => {
//         // PostDetailView가 열려있으면 닫기
//         if (showPostDetail) {
//             setShowPostDetail(false);
//             setSelectedPost(null);
//         }
        
//         if (tab === activeTab && !showPostDetail) return;
//         navigate({ pathname: '/community', search: `?tab=${tab}` });
//         setActiveTab(tab);
//     };

//     return (
//         <div id="community-view" className="community-view">
//             <div className="community-layout">
//                 {/* 사이드바 영역 */}
//                 <SidebarMenu activeTab={activeTab} goToTab={goToTab} />

//                 {/* 메인 컨텐츠 영역 */}
//                 <div className="community-main">
//                     {/* 메인과 상세를 서로 교체해서 보여 줍니다 */}
//                     {!showPostDetail ? (
//                         activeTab === 'popular' ? <Popular posts={posts.popular} onOpenPost={detailPostView} onNewPost={() => newPost('popular')} onToggleLike={handleToggleLike} /> :
//                         activeTab === 'tips' ? <Tips posts={posts.tips} onOpenPost={detailPostView} onNewPost={() => newPost('tips')} onToggleLike={handleToggleLike} /> :
//                         activeTab === 'data' ? <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} onToggleLike={handleToggleLike} /> :
//                         activeTab === 'mypost' ? <MyPost posts={posts.mypost} onOpenPost={detailPostView} onNewPost={() => newPost('mypost')} onToggleLike={handleToggleLike} /> :
//                         <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} onToggleLike={handleToggleLike} />
//                     ) : (
//                         <PostDetailView 
//                             post={selectedPost} 
//                             onClose={closeDetailView} 
//                             onDeletePost={handleDeletePost}
//                             onEditPost={handleEditPost}
//                             onToggleLike={handleToggleLike}
//                             onUpdatePostState={handleUpdatePostState}
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* 3. 모달 연결 (선생님 방식) */}
//             {isModalOpen && (
//                 <CommunityRewardModal onClose={() => setModalOpen(false)} />
//             )}
//             {isNewPostModalOpen && (
//                 <NewPostModal 
//                     category={currentCategory} 
//                     onClose={() => setNewPostModalOpen(false)} 
//                     onSubmit={handleAddPost}
//                 />
//             )}
            
//         </div>
//     );
// }

// export default Community;



// --------------------------------------------------- 원래 쓰던 코드



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import CommunityRewardModal from '../modal/CommunityRewardModal';
// import NewPostModal from '../modal/NewPostModal';
// import CustomAlertModal from '../modal/CustomAlertModal';
// import PostDetailView from './PostDetailView';
// import SidebarMenu from './SidebarMenu';
// import Popular from './Popular';
// import Tips from './Tips';
// import DataSharing from './DataSharing';
// import MyPost from './MyPost';

// function Community() {
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
//     const [currentCategory, setCurrentCategory] = useState('popular');

//     // 커스텀 알림 모달 상태
//     const [isAlertOpen, setIsAlertOpen] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');

//     const showAlert = (msg) => {
//         setAlertMessage(msg);
//         setIsAlertOpen(true);
//     };
    
//     // 게시글 상태 (DB에서만 가져옴)
//     const [posts, setPosts] = useState({
//         popular: [],
//         tips: [],
//         data: [],
//         mypost: []
//     });

//     // DB 데이터를 리액트 형식으로 변환
//     const mapPost = (row) => ({
//         id: row.post_id,
//         title: row.title,
//         content: row.content,
//         author: row.username || '익명',
//         likes: Number(row.like_count) || 0,
//         comments: Number(row.comment_count) || 0,
//         liked: Boolean(row.user_liked),
//         date: row.created_at ? new Date(row.created_at).toLocaleString('ko-KR') : '',
//         category: row.category || 'data'
//     });

//     // 게시글 목록 가져오기
//     const fetchPosts = async () => {
//         try {
//             const username = localStorage.getItem('username');
//             const headers = {};
//             if (username) headers['X-Username'] = username;
            
//             const response = await fetch('/api/posts', { headers });
//             if (!response.ok) return;

//             const payload = await response.json();
//             const list = (payload.data || []).map(mapPost);

//             // 카테고리별로 분류
//             const categorized = {
//                 popular: list.filter(p => p.category === 'popular'),
//                 tips: list.filter(p => p.category === 'tips'),
//                 data: list.filter(p => p.category === 'data'),
//                 mypost: username ? list.filter(p => String(p.author) === String(username)) : []
//             };

//             setPosts(categorized);
//         } catch (error) {
//             console.error('게시글 불러오기 실패:', error);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);
    
//     const newPost = (category) => {
//         setCurrentCategory(category || activeTab);
//         setNewPostModalOpen(true);
//     };
    
//     // 새 게시글 추가
//     const handleAddPost = async (newPostData) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch('/api/posts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: newPostData.title,
//                     content: newPostData.content,
//                     category: newPostData.category || 'data'
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) throw new Error(payload.message);

//             // 작성 성공 후 목록 새로고침
//             await fetchPosts();
//             window.dispatchEvent(new CustomEvent('communityActivityUpdated'));
//             setNewPostModalOpen(false);
//         } catch (error) {
//             alert(error.message || '게시글 작성에 실패했습니다.');
//         }
//     };

//     // 상세 보기 관련 상태
//     const [showPostDetail, setShowPostDetail] = useState(false);
//     const [selectedPost, setSelectedPost] = useState(null);

//     const detailPostView = (post) => {
//         setSelectedPost(post);
//         setShowPostDetail(true);
//     };

//     const closeDetailView = () => {
//         setShowPostDetail(false);
//         setSelectedPost(null);
//     };

//     // 삭제, 수정, 좋아요 핸들러
//     const handleDeletePost = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${postId}`, {
//                 method: 'DELETE',
//                 headers: { 'X-Username': username }
//             });

//             if (!response.ok) {
//                 const payload = await response.json().catch(() => ({}));
//                 return alert(payload.message || '게시글 삭제에 실패했습니다.');
//             }

//             closeDetailView();
//             await fetchPosts();
//             window.dispatchEvent(new CustomEvent('communityActivityUpdated'));
//         } catch (error) {
//             console.error('게시글 삭제 실패:', error);
//             alert('게시글 삭제에 실패했습니다.');
//         }
//     };

//     const handleEditPost = async (updatedPost) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${updatedPost.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: updatedPost.title,
//                     content: updatedPost.content
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) return alert(payload.message || '게시글 수정에 실패했습니다.');

//             closeDetailView();
//             await fetchPosts();
//         } catch (error) {
//             console.error('게시글 수정 실패:', error);
//             alert('게시글 수정에 실패했습니다.');
//         }
//     };

//     const handleToggleLike = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${postId}/like`, {
//                 method: 'POST',
//                 headers: { 'X-Username': username }
//             });

//             const payload = await response.json();
//             if (!response.ok) return alert(payload.message || '좋아요 처리에 실패했습니다.');

//             // 좋아요 토글 성공 후 상태 즉시 업데이트
//             const { liked, count, promoted } = payload.data || {};

//             // Popular 등급으로 승격된 경우 목록 새로고침
//             if (promoted) {
//                 await fetchPosts();
//                 if (activeTab !== 'popular') {
//                     // 선택적: 알림을 띄우거나 자동으로 탭 이동
//                     showAlert('이 게시글이 Popular 게시판으로 이동되었습니다!');
//                 }
//                 return;
//             }

//             setPosts(prev => ({
//                 ...prev,
//                 popular: prev.popular.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 tips: prev.tips.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 data: prev.data.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 mypost: prev.mypost.map(p => p.id === postId ? { ...p, liked, likes: count } : p)
//             }));
//         } catch (error) {
//             console.error('좋아요 처리 실패:', error);
//             alert('좋아요 처리에 실패했습니다.');
//         }
//     };

//     const handleUpdatePostState = (updatedPost) => {
//         setPosts(prev => ({
//             ...prev,
//             popular: prev.popular.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             tips: prev.tips.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             data: prev.data.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             mypost: prev.mypost.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p)
//         }));
//     };

//     // 탭 라우팅 관련
//     const navigate = useNavigate();
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const activeTab = params.get('tab') || 'popular';

//     const goToTab = (tab) => {
//         if (showPostDetail) closeDetailView();
//         navigate(`/community?tab=${tab}`);
//     };

//     return (
//         <div id="community-view" className="community-view">
//             <div className="community-layout">
//                 <SidebarMenu activeTab={activeTab} goToTab={goToTab} onNewPost={newPost} />
//                 <div className="community-main">
//                     {!showPostDetail ? (
//                         <>
//                             {activeTab === 'popular' && <Popular posts={posts.popular} onOpenPost={detailPostView} onNewPost={() => newPost('popular')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'tips' && <Tips posts={posts.tips} onOpenPost={detailPostView} onNewPost={() => newPost('tips')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'data' && <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'mypost' && <MyPost posts={posts.mypost} onOpenPost={detailPostView} onNewPost={() => newPost('mypost')} onToggleLike={handleToggleLike} />}
//                         </>
//                     ) : (
//                         <PostDetailView 
//                             post={selectedPost} 
//                             onClose={closeDetailView} 
//                             onDeletePost={handleDeletePost}
//                             onEditPost={handleEditPost}
//                             onToggleLike={handleToggleLike}
//                             onUpdatePostState={handleUpdatePostState}
//                         />
//                     )}
//                 </div>
//             </div>
//             {isModalOpen && <CommunityRewardModal onClose={() => setModalOpen(false)} />}
//             {isNewPostModalOpen && (
//                 <NewPostModal 
//                     category={currentCategory} 
//                     onClose={() => setNewPostModalOpen(false)} 
//                     onSubmit={handleAddPost}
//                 />
//             )}
//             {isAlertOpen && (
//                 <CustomAlertModal 
//                     message={alertMessage} 
//                     onClose={() => setIsAlertOpen(false)} 
//                 />
//             )}
//         </div>
//     );
// }

// export default Community;


// ------------------------------------------ 밑에는 수정 코드


// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import CommunityRewardModal from '../modal/CommunityRewardModal';
// import NewPostModal from '../modal/NewPostModal';
// import CustomAlertModal from '../modal/CustomAlertModal';
// import PostDetailView from './PostDetailView';
// import SidebarMenu from './SidebarMenu';
// import Popular from './Popular';
// import Tips from './Tips';
// import DataSharing from './DataSharing';
// import MyPost from './MyPost';

// function Community() {
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
//     const [currentCategory, setCurrentCategory] = useState('popular');

//     // 커스텀 알림 모달 상태
//     const [isAlertOpen, setIsAlertOpen] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');

//     const showAlert = (msg) => {
//         setAlertMessage(msg);
//         setIsAlertOpen(true);
//     };
    
//     // 게시글 상태 (DB에서 가져온 데이터를 카테고리별로 관리)
//     const [posts, setPosts] = useState({
//         popular: [],
//         tips: [],
//         data: [],
//         mypost: []
//     });

//     // DB 데이터를 리액트 형식으로 변환하는 헬퍼 함수
//     const mapPost = (row) => ({
//         id: row.post_id,
//         title: row.title,
//         content: row.content,
//         author: row.username || '익명',
//         likes: Number(row.like_count) || 0,
//         comments: Number(row.comment_count) || 0,
//         liked: Boolean(row.user_liked),
//         date: row.created_at ? new Date(row.created_at).toLocaleString('ko-KR') : '',
//         category: row.category || 'data'
//     });

//     // 서버에서 게시글 전체 목록을 가져와서 카테고리별로 분류
//     const fetchPosts = async () => {
//         try {
//             const username = localStorage.getItem('username');
//             const headers = {};
//             if (username) headers['X-Username'] = username;
            
//             const response = await fetch('/api/posts', { headers });
//             if (!response.ok) return;

//             const payload = await response.json();
//             const list = (payload.data || []).map(mapPost);

//             // 카테고리 필터링 로직
//             const categorized = {
//                 popular: list.filter(p => p.category === 'popular'),
//                 tips: list.filter(p => p.category === 'tips'),
//                 data: list.filter(p => p.category === 'data'),
//                 mypost: username ? list.filter(p => String(p.author) === String(username)) : []
//             };

//             setPosts(categorized);
//         } catch (error) {
//             console.error('게시글 불러오기 실패:', error);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);
    
//     const newPost = (category) => {
//         setCurrentCategory(category || activeTab);
//         setNewPostModalOpen(true);
//     };
    
//     // 새 게시글 추가 핸들러
//     const handleAddPost = async (newPostData) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch('/api/posts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: newPostData.title,
//                     content: newPostData.content,
//                     category: newPostData.category || 'data'
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) throw new Error(payload.message);

//             await fetchPosts(); // 작성 후 목록 새로고침
//             const currentPosts = Number(localStorage.getItem('communityPostsCount') || '0');
//             const nextPosts = (Number.isNaN(currentPosts) ? 0 : currentPosts) + 1;
//             localStorage.setItem('communityPostsCount', String(Math.max(0, nextPosts)));
//             window.dispatchEvent(new CustomEvent('communityActivityUpdated', { detail: { postsDelta: 1 } }));
//             setNewPostModalOpen(false);
//         } catch (error) {
//             alert(error.message || '게시글 작성에 실패했습니다.');
//         }
//     };

//     // 상세 보기 관련 상태
//     const [showPostDetail, setShowPostDetail] = useState(false);
//     const [selectedPost, setSelectedPost] = useState(null);

//     const detailPostView = (post) => {
//         setSelectedPost(post);
//         setShowPostDetail(true);
//     };

//     const closeDetailView = () => {
//         setShowPostDetail(false);
//         setSelectedPost(null);
//     };

//     // 게시글 삭제 핸들러
//     const handleDeletePost = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${postId}`, {
//                 method: 'DELETE',
//                 headers: { 'X-Username': username }
//             });

//             if (!response.ok) {
//                 const payload = await response.json().catch(() => ({}));
//                 return alert(payload.message || '게시글 삭제에 실패했습니다.');
//             }

//             const payload = await response.json().catch(() => ({}));

//             closeDetailView();
//             await fetchPosts();
//             const currentPosts = Number(localStorage.getItem('communityPostsCount') || '0');
//             const nextPosts = (Number.isNaN(currentPosts) ? 0 : currentPosts) - 1;
//             localStorage.setItem('communityPostsCount', String(Math.max(0, nextPosts)));
//             const deletedCommentsCount = Number(payload?.data?.deletedCommentsCount) || 0;
//             const currentComments = Number(localStorage.getItem('communityCommentsCount') || '0');
//             const nextComments = (Number.isNaN(currentComments) ? 0 : currentComments) - deletedCommentsCount;
//             localStorage.setItem('communityCommentsCount', String(Math.max(0, nextComments)));
//             window.dispatchEvent(new CustomEvent('communityActivityUpdated', { detail: { postsDelta: -1, commentsDelta: -deletedCommentsCount } }));
//         } catch (error) {
//             console.error('게시글 삭제 실패:', error);
//             alert('게시글 삭제에 실패했습니다.');
//         }
//     };

//     // 게시글 수정 핸들러
//     const handleEditPost = async (updatedPost) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${updatedPost.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-Username': username
//                 },
//                 body: JSON.stringify({
//                     title: updatedPost.title,
//                     content: updatedPost.content
//                 })
//             });

//             const payload = await response.json();
//             if (!response.ok) return alert(payload.message || '게시글 수정에 실패했습니다.');

//             closeDetailView();
//             await fetchPosts();
//         } catch (error) {
//             console.error('게시글 수정 실패:', error);
//             alert('게시글 수정에 실패했습니다.');
//         }
//     };

//     // 좋아요 토글 핸들러 (목록에서 클릭 시)
//     const handleToggleLike = async (postId) => {
//         const username = localStorage.getItem('username');
//         if (!username) return alert('로그인이 필요합니다.');

//         try {
//             const response = await fetch(`/api/post/${postId}/like`, {
//                 method: 'POST',
//                 headers: { 'X-Username': username }
//             });

//             const payload = await response.json();
//             if (!response.ok) return alert(payload.message || '좋아요 처리에 실패했습니다.');

//             const { liked, count, promoted } = payload.data || {};

//             // 승격(promoted)된 경우 전체 목록을 다시 가져와서 인기글 탭에 반영
//             if (promoted) {
//                 await fetchPosts();
//                 if (activeTab !== 'popular') {
//                     showAlert('이 게시글이 Popular 게시판으로 이동되었습니다!');
//                 }
//                 return;
//             }

//             // 일반적인 좋아요 업데이트는 상태값만 부분 수정
//             setPosts(prev => ({
//                 ...prev,
//                 popular: prev.popular.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 tips: prev.tips.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 data: prev.data.map(p => p.id === postId ? { ...p, liked, likes: count } : p),
//                 mypost: prev.mypost.map(p => p.id === postId ? { ...p, liked, likes: count } : p)
//             }));
//         } catch (error) {
//             console.error('좋아요 처리 실패:', error);
//             alert('좋아요 처리에 실패했습니다.');
//         }
//     };

//     // 게시글 상세 뷰에서 넘어오는 상태 업데이트 요청 처리
//     const handleUpdatePostState = async (updatedPost) => {
//         // [중요] 상세페이지에서 좋아요를 눌러 카테고리가 popular로 승격된 경우 목록 전체를 새로고침
//         if (updatedPost.category === 'popular') {
//             await fetchPosts();
//             return;
//         }

//         // 댓글 추가 등 일반적인 상태 변경은 기존 데이터만 교체
//         setPosts(prev => ({
//             ...prev,
//             popular: prev.popular.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             tips: prev.tips.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             data: prev.data.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p),
//             mypost: prev.mypost.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p)
//         }));
//     };

//     // 탭 및 라우팅 제어
//     const navigate = useNavigate();
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const activeTab = params.get('tab') || 'popular';

//     const goToTab = (tab) => {
//         if (showPostDetail) closeDetailView();
//         navigate(`/community?tab=${tab}`);
//     };

//     return (
//         <div id="community-view" className="community-view">
//             <div className="community-layout">
//                 <SidebarMenu activeTab={activeTab} goToTab={goToTab} onNewPost={newPost} />
//                 <div className="community-main">
//                     {!showPostDetail ? (
//                         <>
//                             {activeTab === 'popular' && <Popular posts={posts.popular} onOpenPost={detailPostView} onNewPost={() => newPost('popular')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'tips' && <Tips posts={posts.tips} onOpenPost={detailPostView} onNewPost={() => newPost('tips')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'data' && <DataSharing posts={posts.data} onOpenPost={detailPostView} onNewPost={() => newPost('data')} onToggleLike={handleToggleLike} />}
//                             {activeTab === 'mypost' && <MyPost posts={posts.mypost} onOpenPost={detailPostView} onNewPost={() => newPost('mypost')} onToggleLike={handleToggleLike} />}
//                         </>
//                     ) : (
//                         <PostDetailView 
//                             post={selectedPost} 
//                             onClose={closeDetailView} 
//                             onDeletePost={handleDeletePost}
//                             onEditPost={handleEditPost}
//                             onUpdatePostState={handleUpdatePostState}
//                         />
//                     )}
//                 </div>
//             </div>
//             {isModalOpen && <CommunityRewardModal onClose={() => setModalOpen(false)} />}
//             {isNewPostModalOpen && (
//                 <NewPostModal 
//                     category={currentCategory} 
//                     onClose={() => setNewPostModalOpen(false)} 
//                     onSubmit={handleAddPost}
//                 />
//             )}
//             {isAlertOpen && (
//                 <CustomAlertModal 
//                     message={alertMessage} 
//                     onClose={() => setIsAlertOpen(false)} 
//                 />
//             )}
//         </div>
//     );
// }

// export default Community;








// -----------------------------


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommunityRewardModal from '../modal/CommunityRewardModal';
import NewPostModal from '../modal/NewPostModal';
import CustomAlertModal from '../modal/CustomAlertModal';
import PostDetailView from './PostDetailView';
import SidebarMenu from './SidebarMenu';
import Popular from './Popular';
import Tips from './Tips';
import DataSharing from './DataSharing';
import MyPost from './MyPost';

function Community() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('popular');

    // 커스텀 알림 모달 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (msg) => {
        setAlertMessage(msg);
        setIsAlertOpen(true);
    };
    
    // 게시글 상태 관리
    const [posts, setPosts] = useState({
        popular: [],
        tips: [],
        data: [],
        mypost: []
    });

    // DB 데이터를 리액트 UI 형식으로 매핑 [cite: 2026-02-13]
    const mapPost = (row) => ({
        id: row.post_id,
        title: row.title,
        content: row.content,
        author: row.username || '익명',
        likes: Number(row.like_count) || 0,
        comments: Number(row.comment_count) || 0,
        liked: Boolean(row.user_liked), // 하트 색상을 결정하는 핵심 변수
        date: row.created_at ? new Date(row.created_at).toLocaleString('ko-KR') : '',
        category: row.category || 'data'
    });

    // 서버에서 최신 게시글 목록을 가져오는 함수 [cite: 2026-02-13]
    const fetchPosts = async () => {
        try {
            const username = localStorage.getItem('username'); // 'q' 확인
            const headers = {};
            if (username) headers['X-Username'] = username;
            
            const response = await fetch('/api/posts', { headers });
            if (!response.ok) return;

            const payload = await response.json();
            const list = (payload.data || []).map(mapPost);

            const categorized = {
                popular: list.filter(p => p.category === 'popular'),
                tips: list.filter(p => p.category === 'tips'),
                data: list.filter(p => p.category === 'data'),
                mypost: username ? list.filter(p => String(p.author) === String(username)) : []
            };

            setPosts(categorized);
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);
    
    // [핵심] 좋아요 토글 핸들러: 하트 색상과 숫자를 즉시 변경 [cite: 2026-02-13, 2026-02-15]
    const handleToggleLike = async (postId) => {
        const username = localStorage.getItem('username');
        if (!username) return alert('로그인이 필요합니다.');

        try {
            const response = await fetch(`/api/post/${postId}/like`, {
                method: 'POST',
                headers: { 
                    'X-Username': username,
                    'Content-Type': 'application/json'
                }
            });

            const payload = await response.json();
            if (!response.ok) return alert(payload.message || '좋아요 실패');

            // 1. 서버 응답값(liked, count)을 바탕으로 화면 UI 즉시 업데이트
            const { liked, count, promoted } = payload.data;

            setPosts(prev => {
                const newPosts = { ...prev };
                Object.keys(newPosts).forEach(cat => {
                    newPosts[cat] = newPosts[cat].map(post => 
                        post.id === postId ? { ...post, liked: liked, likes: count } : post
                    );
                });
                return newPosts;
            });

            // 2. 좋아요 1개로 인기글 승격 시 알림창 띄우고 데이터 전체 동기화 [cite: 2026-02-15]
            if (promoted) {
                showAlert("축하합니다! 좋아요 1개를 달성하여 인기글로 등록되었습니다.");
                await fetchPosts(); // 카테고리 이동 반영을 위해 전체 데이터 재로드
            }
        } catch (error) {
            console.error('좋아요 에러:', error);
        }
    };

    // 새 게시글 추가 [cite: 2026-02-13]
    const handleAddPost = async (newPostData) => {
        const username = localStorage.getItem('username');
        if (!username) return alert('로그인이 필요합니다.');

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                body: JSON.stringify({
                    title: newPostData.title,
                    content: newPostData.content,
                    category: newPostData.category || activeTab || 'data'
                })
            });

            if (response.ok) {
                await fetchPosts(); 
                setNewPostModalOpen(false);
            }
        } catch (error) {
            alert('작성 중 오류가 발생했습니다.');
        }
    };

    // 게시글 상세 보기 및 삭제/수정 (기존 기능 유지) [cite: 2026-02-13]
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

    const handleUpdatePostState = async () => {
        await fetchPosts();
    };

    const handleDeletePost = async (postId) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: 'DELETE',
                headers: { 'X-Username': username }
            });
            if (response.ok) { closeDetailView(); await fetchPosts(); }
        } catch (error) { console.error(error); }
    };

    const handleEditPost = async (updatedPost) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(`/api/post/${updatedPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Username': username },
                body: JSON.stringify({ title: updatedPost.title, content: updatedPost.content })
            });
            if (response.ok) { closeDetailView(); await fetchPosts(); }
        } catch (error) { console.error(error); }
    };

    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = new URLSearchParams(location.search).get('tab') || 'popular';

    const goToTab = (tab) => {
        if (showPostDetail) closeDetailView();
        navigate(`/community?tab=${tab}`);
    };

    return (
        <div id="community-view" className="community-view">
            <div className="community-layout">
                <SidebarMenu activeTab={activeTab} goToTab={goToTab} onNewPost={() => setNewPostModalOpen(true)} />
                <div className="community-main">
                    {!showPostDetail ? (
                        <>
                            {/* Popular 컴포넌트에 좋아요 1개 기준 메시지 전달 필요 시 Popular.jsx 수정 권장 */}
                            {activeTab === 'popular' && <Popular posts={posts.popular} onOpenPost={detailPostView} onToggleLike={handleToggleLike} onNewPost={() => setNewPostModalOpen(true)} />}
                            {activeTab === 'tips' && <Tips posts={posts.tips} onOpenPost={detailPostView} onToggleLike={handleToggleLike} onNewPost={() => setNewPostModalOpen(true)} />}
                            {activeTab === 'data' && <DataSharing posts={posts.data} onOpenPost={detailPostView} onToggleLike={handleToggleLike} onNewPost={() => setNewPostModalOpen(true)} />}
                            {activeTab === 'mypost' && <MyPost posts={posts.mypost} onOpenPost={detailPostView} onToggleLike={handleToggleLike} onNewPost={() => setNewPostModalOpen(true)} />}
                        </>
                    ) : (
                        <PostDetailView 
                            post={selectedPost} 
                            onClose={closeDetailView} 
                            onDeletePost={handleDeletePost}
                            onEditPost={handleEditPost}
                            onUpdatePostState={handleUpdatePostState}
                        />
                    )}
                </div>
            </div>
            {isNewPostModalOpen && (
                <NewPostModal 
                    category={activeTab} 
                    onClose={() => setNewPostModalOpen(false)} 
                    onSubmit={handleAddPost}
                />
            )}
            {isAlertOpen && <CustomAlertModal message={alertMessage} onClose={() => setIsAlertOpen(false)} />}
        </div>
    );
}

export default Community;