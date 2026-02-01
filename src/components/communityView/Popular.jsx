import React from 'react';

function Popular({ onOpenPost, onNewPost }) {
    const posts = [
        { id: 11, title: '인기: 미적분 베스트', content: '많은 좋아요를 받은 문제풀이 공유글', author: '인기유저', likes: 99, comments: 42, date: '2025.12.01' },
        { id: 12, title: '인기: 공부 팁 모음', content: '효율적 공부법 정리', author: '팁러', likes: 78, comments: 21, date: '2025.12.05' }
    ];

    return (
        <div id="community-popular-view">
            <div className="community-title-section">
                <h2>Popular Posts</h2>
                <p>인기 글을 확인해보세요.</p>
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
                <div className="community-board-sidebar">
                    <button className="btn-new-post" onClick={onNewPost}>New Post</button>
                </div>
            </div>
        </div>
    );
}

export default Popular; 
