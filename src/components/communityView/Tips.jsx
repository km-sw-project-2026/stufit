import React, { useState, useEffect } from 'react';

function Tips({ posts = [], onOpenPost, onNewPost }) {
    // 좋아요 상태 관리
    const [postLikes, setPostLikes] = useState({});

    // localStorage에서 좋아요 데이터 로드
    useEffect(() => {
        const savedLikes = localStorage.getItem('communityPostLikes');
        if (savedLikes) {
            setPostLikes(JSON.parse(savedLikes));
        }
    }, []);

    // 좋아요 토글 핸들러
    const handleLikeToggle = (e, postId, currentLikes) => {
        e.stopPropagation();
        
        setPostLikes(prev => {
            const isLiked = prev[postId]?.liked || false;
            const newLikes = {
                ...prev,
                [postId]: {
                    liked: !isLiked,
                    count: isLiked ? currentLikes - 1 : currentLikes + 1
                }
            };
            localStorage.setItem('communityPostLikes', JSON.stringify(newLikes));
            return newLikes;
        });
    };

    return (
        <div id="community-tips-view">
            <div className="community-title-section">
                <h2>Tips & How-To</h2>
                <p>팁과 학습 방법을 공유하세요.</p>
            </div>
            <div className="community-board-container">
                <div className="community-feed">
                    {posts.map((p) => {
                        const likeData = postLikes[p.id] || { liked: false, count: p.likes };
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
                                            onClick={(e) => handleLikeToggle(e, p.id, likeData.count)}
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

export default Tips; 
