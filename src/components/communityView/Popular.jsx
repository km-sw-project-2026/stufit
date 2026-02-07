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
                <p>인기 글을 확인해보세요.</p>
            </div>
            <div className="community-board-container">
                <div className="community-feed">
                    {posts.map((p) => {
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
                                    <p>{p.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="community-board-sidebar">
                    <button className="btn-new-post" onClick={onNewPost}>New Post</button>
                </div>
            </div>
        </div>
    );
}

export default Popular; 
