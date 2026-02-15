// --------------------------원래 쓰던 코드

// import React from 'react';

// function Popular({ posts = [], onOpenPost, onNewPost, onToggleLike }) {
//     const handleLikeToggle = (e, postId) => {
//         e.stopPropagation();
//         if (onToggleLike) onToggleLike(postId);
//     };

//     return (
//         <div id="community-popular-view">
//             <div className="community-title-section">
//                 <h2>Popular Posts</h2>
//                 <p>인기 글을 확인해보세요.</p>
//             </div>
//             <div className="community-board-container">
//                 <div className="community-feed">
//                     {posts.map((p) => {
//                         const likeData = { liked: p.liked, count: p.likes };
//                         return (
//                             <div key={p.id} className="feed-card" role="button" tabIndex={0} onClick={() => onOpenPost && onOpenPost(p)} onKeyDown={(e) => { if (e.key === 'Enter') onOpenPost && onOpenPost(p); }}>
//                                 <div className="feed-header">
//                                     <div className="feed-user-info">
//                                         <div className="feed-user-avatar"></div>
//                                         <span className="feed-user-name">{p.author}</span>
//                                     </div>
//                                     <div className="feed-meta">
//                                         <span 
//                                             className="like-count" 
//                                             onClick={(e) => handleLikeToggle(e, p.id)}
//                                             style={{ 
//                                                 cursor: 'pointer',
//                                                 color: likeData.liked ? '#ff6b6b' : 'inherit',
//                                                 fontWeight: likeData.liked ? 'bold' : 'normal'
//                                             }}
//                                         >
//                                             {likeData.liked ? '♥' : '♡'} {likeData.count}
//                                         </span>
//                                         <span className="comment-count">💬 {p.comments}</span>
//                                     </div>
//                                 </div>
//                                 <div className="feed-content">
//                                     <h3>{p.title}</h3>
//                                     <p>{p.content}</p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Popular; 



// --------------------------밑에 수정 코드

import React from 'react';

function Popular({ posts = [], onOpenPost, onNewPost, onToggleLike }) {
    const handleLikeToggle = (e, postId) => {
        e.stopPropagation();
        if (onToggleLike) onToggleLike(postId);
    };

    return (
        <div id="community-popular-view">
            <div className="community-title-section">
                <h2>Popular Posts</h2>
                <p>좋아요 200개를 달성한 인기 글들을 확인해보세요.</p>
            </div>
            <div className="community-board-container">
                <div className="community-feed">
                    {/* 게시글이 없을 경우 표시할 안내 문구 추가 */}
                    {posts.length === 0 ? (
                        <div className="no-posts-message" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                            <p>아직 인기글이 없습니다.</p>
                            <p>좋아요 200개를 달성하면 이곳에 명예롭게 전시됩니다!</p>
                        </div>
                    ) : (
                        posts.map((p) => {
                            const likeData = { liked: p.liked, count: p.likes };
                            return (
                                <div key={p.id} className="feed-card" role="button" tabIndex={0} onClick={() => onOpenPost && onOpenPost(p)} onKeyDown={(e) => { if (e.key === 'Enter') onOpenPost && onOpenPost(p); }}>
                                    <div className="feed-header">
                                        <div className="feed-user-info">
                                            <div className="feed-user-avatar"></div>
                                            <span className="feed-user-name">{p.author}</span>
                                        </div>
                                        <div className="feed-meta">
                                            <span 
                                                className="like-count" 
                                                onClick={(e) => handleLikeToggle(e, p.id)}
                                                style={{ 
                                                    cursor: 'pointer',
                                                    color: likeData.liked ? '#ff6b6b' : 'inherit',
                                                    fontWeight: likeData.liked ? 'bold' : 'normal'
                                                }}
                                            >
                                                {likeData.liked ? '♥' : '♡'} {likeData.count}
                                            </span>
                                            <span className="comment-count">💬 {p.comments}</span>
                                        </div>
                                    </div>
                                    <div className="feed-content">
                                        <h3>{p.title}</h3>
                                        <p style={{ 
                                            display: '-webkit-box', 
                                            WebkitLineClamp: 3, 
                                            WebkitBoxOrient: 'vertical', 
                                            overflow: 'hidden' 
                                        }}>{p.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Popular;