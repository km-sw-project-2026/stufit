import React from 'react';

function Tips({ onOpenPost, onNewPost }) {
    const posts = [
        { id: 21, title: '효율적 공부법', content: '짧고 굵게 집중하는 방법들...', author: '팁글러', likes: 12, comments: 4, date: '2025.10.12' },
        { id: 22, title: '시간관리 팁', content: '포모도로 기법 활용법', author: '시간관리러', likes: 18, comments: 5, date: '2025.11.01' }
    ];

    return (
        <div id="community-tips-view">
            <div className="community-title-section">
                <h2>Tips & How-To</h2>
                <p>팁과 학습 방법을 공유하세요.</p>
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

export default Tips; 
