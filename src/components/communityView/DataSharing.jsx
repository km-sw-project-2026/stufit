import React from 'react';

function DataSharing({ posts = [], onOpenPost, onNewPost, onToggleLike, onOpenUserProfile }) {
    const handleLikeToggle = (e, postId) => {
        e.stopPropagation();
        if (onToggleLike) onToggleLike(postId);
    };

    return (
        <div id="community-data-view">
            <div className="community-title-section">
                <h2>Data Sharing</h2>
                <p>자료를 공유하고 받아가세요.</p>
            </div>

            <div className="community-board-container">
                <div className="community-feed">
                    {posts.map((p) => {
                        const likeData = { liked: p.liked, count: p.likes };
                        return (
                            <div key={p.id} className="feed-card" role="button" tabIndex={0} onClick={() => onOpenPost && onOpenPost(p)} onKeyDown={(e) => { if (e.key === 'Enter') onOpenPost && onOpenPost(p); }}>
                                <div className="feed-header">
                                    <div
                                        className="feed-user-info"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onOpenUserProfile) onOpenUserProfile(p.userId, p.author);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && onOpenUserProfile) onOpenUserProfile(p.userId, p.author);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="feed-user-avatar"></div>
                                        <span className="feed-user-name">{p.author}</span>
                                    </div>
                                    <div className="feed-meta">
                                        <span 
                                            className="like-count" 
                                            onClick={(e) => handleLikeToggle(e, p.id)}
                                            style={{ 
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: likeData.liked ? '#e31c1c' : 'inherit'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={likeData.liked ? '#e31c1c' : 'none'} stroke={likeData.liked ? '#e31c1c' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                            {likeData.count}
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

export default DataSharing;
