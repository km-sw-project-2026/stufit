import React from 'react';

function MyPost({ onOpenPost, onNewPost }) {
    const posts = [
        { id: 31, title: '내 게시글 1', content: '내가 쓴 내용입니다.', author: '나', likes: 2, comments: 0, date: '2025.09.01' }
    ];

    return (
        <div id="community-mypost-view">
            <div className="community-title-section">
                <h2>My Posts</h2>
                <p>내가 작성한 글을 확인하세요.</p>
            </div>
            <div className="community-board-container">
                <div className="community-feed">
                    {posts.map((p) => (
                        <div key={p.id} className="feed-card" role="button" tabIndex={0} onClick={() => onOpenPost && onOpenPost(p)} onKeyDown={(e) => { if (e.key === 'Enter') onOpenPost && onOpenPost(p); }}>
                            <div className="feed-header">
                                <div className="feed-user-info">
                                    <div className="feed-user-avatar"></div>
                                    <span className="feed-user-name">{p.author}</span>
                                </div>
                                <div className="feed-meta">
                                    <span className="like-count">♡ {p.likes}</span>
                                    <span className="comment-count">💬 {p.comments}</span>
                                </div>
                            </div>
                            <div className="feed-content">
                                <h3>{p.title}</h3>
                                <p>{p.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyPost;
