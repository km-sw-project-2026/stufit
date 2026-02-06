import React from 'react';

function Tips({ posts = [], onOpenPost, onNewPost }) {

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
