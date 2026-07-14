// import React from 'react';

// function MyPost({ posts = [], onOpenPost, onNewPost, onToggleLike }) {
//     const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

//     const handleLikeToggle = (e, postId) => {
//         e.stopPropagation();
//         if (onToggleLike) onToggleLike(postId);
//     };

//     useEffect(() => {
//         // 시연용: 실제 앱에서는 /api/posts를 호출해 목록을 불러옵니다.
//         // fetch('/api/posts').then(r => r.json()).then(data => setPosts(data));
//     }, []);

//     const handleDelete = (e, id) => {
//         e.stopPropagation();
//         if (!username) return alert('로그인이 필요합니다.');
//         if (!confirm('정말 삭제하시겠습니까?')) return;

//         // 로컬 상태에서만 삭제 (서버 연동 시 API 호출 추가)
//         alert('삭제 기능은 서버 연동 후 사용 가능합니다.');
//     };

//     const handleEdit = (e, post) => {
//         e.stopPropagation();
//         if (!username) return alert('로그인이 필요합니다.');

//         const newTitle = prompt('제목을 수정하세요', post.title);
//         if (newTitle === null) return;
//         const newContent = prompt('내용을 수정하세요', post.content);
//         if (newContent === null) return;

//         // 로컬 상태에서만 수정 (서버 연동 시 API 호출 추가)
//         alert('수정 기능은 서버 연동 후 사용 가능합니다.');
//     };

//     return (
//         <div id="community-mypost-view">
//             <div className="community-title-section">
//                 <h2>My Posts</h2>
//                 <p>내가 작성한 글을 확인하세요.</p>
//             </div>
//             <div className="community-board-container">
//                 <div className="community-feed">
//                     {posts.length === 0 ? (
//                         <div style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             padding: '100px 20px',
//                             textAlign: 'center',
//                             width: '100%'
//                         }}>
//                             <div style={{ fontSize: '80px', marginBottom: '20px' }}>😢</div>
//                             <p style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
//                                 아직 작성한 글이 없어요 ㅠ_ㅠ
//                             </p>
//                             <p style={{ fontSize: '14px', color: '#666' }}>
//                                 New Post 버튼을 눌러 새 글을 작성해보세요!
//                             </p>
//                         </div>
//                     ) : (
//                         posts.map((p) => {
//                             const likeData = { liked: p.liked, count: p.likes };
//                             return (
//                                 <div key={p.id} className="feed-card" role="button" tabIndex={0} onClick={() => onOpenPost && onOpenPost(p)} onKeyDown={(e) => { if (e.key === 'Enter') onOpenPost && onOpenPost(p); }}>
//                                     <div className="feed-header">
//                                         <div className="feed-user-info">
//                                             <div className="feed-user-avatar"></div>
//                                             <span className="feed-user-name">{p.author}</span>
//                                         </div>
//                                         <div className="feed-meta">
//                                             <span
//                                                 className="like-count"
//                                                 onClick={(e) => handleLikeToggle(e, p.id)}
//                                                 style={{
//                                                     cursor: 'pointer',
//                                                     color: likeData.liked ? '#ff6b6b' : 'inherit',
//                                                     fontWeight: likeData.liked ? 'bold' : 'normal'
//                                                 }}
//                                             >
//                                                 {likeData.liked ? '♥' : '♡'} {likeData.count}
//                                             </span>
//                                             <span className="comment-count">💬 {p.comments}</span>
//                                         </div>
//                                     </div>
//                                     <div className="feed-content">
//                                         <h3>{p.title}</h3>
//                                         <p>{p.content}</p>
//                                     </div>
//                                     <div className="feed-actions">
//                                         <button className="btn-edit" onClick={(e) => handleEdit(e, p)}>수정하기</button>
//                                         <button className="btn-delete" onClick={(e) => handleDelete(e, p.id)}>삭제하기</button>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MyPost;

// ------------------------------------------------

import React from "react";

function MyPost({
  posts = [],
  onOpenPost,
  onNewPost,
  onToggleLike,
  onOpenUserProfile,
}) {
  // 1. localStorage 안전하게 가져오기
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const handleLikeToggle = (e, postId) => {
    e.stopPropagation();
    if (onToggleLike) onToggleLike(postId);
  };

  // 2. 부모(Community.jsx)에서 삭제/수정 함수를 받아오지 않았을 경우를 대비한 경고
  const handleDelete = (e, id) => {
    e.stopPropagation();
    alert("게시글 상세 보기(PostDetailView)에서 삭제를 진행해주세요!");
  };

  const handleEdit = (e, post) => {
    e.stopPropagation();
    alert("게시글 상세 보기(PostDetailView)에서 수정을 진행해주세요!");
  };

  return (
    <div id="community-mypost-view">
      <div className="community-title-section">
        <h2>My Posts</h2>
        <p>내가 작성한 글을 확인하세요.</p>
      </div>

      <div className="community-board-container">
        <div className="community-feed">
          {/* 3. 데이터가 없을 때의 화면 처리 */}
          {posts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "100px 20px",
                textAlign: "center",
                width: "100%",
                background: "#fff",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>😢</div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                아직 작성한 글이 없어요 ㅠ_ㅠ
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                New Post 버튼을 눌러 첫 글을 작성해보세요!
              </p>
            </div>
          ) : (
            // 4. 데이터가 있을 때 목록 렌더링
            posts.map((p) => (
              <div
                key={p.id}
                className="feed-card"
                onClick={() => onOpenPost && onOpenPost(p)}
                style={{ cursor: "pointer", marginBottom: "15px" }}
              >
                <div className="feed-header">
                  <div
                    className="feed-user-info"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenUserProfile)
                        onOpenUserProfile(p.userId, p.author, e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && onOpenUserProfile)
                        onOpenUserProfile(p.userId, p.author, e);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="feed-user-avatar"></div>
                    <span className="feed-user-name">{p.author}</span>
                  </div>
                  <div className="feed-meta">
                    <span
                      className="like-count"
                      onClick={(e) => handleLikeToggle(e, p.id)}
                      style={{
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: p.liked ? "#e31c1c" : "inherit",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={p.liked ? "#e31c1c" : "none"}
                        stroke={p.liked ? "#e31c1c" : "currentColor"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      {p.likes}
                    </span>
                    <span className="comment-count">💬 {p.comments}</span>
                  </div>
                </div>
                <div className="feed-content">
                  <h3 style={{ margin: "10px 0" }}>{p.title}</h3>
                  <p style={{ color: "#555" }}>{p.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPost;
