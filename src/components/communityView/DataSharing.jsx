import React from 'react';

function DataSharing({ onOpenPost, onNewPost }) {
    const posts = [
        { id: 1, title: '미적분 문제 질문이요!', content: '치환적분 문제인데 도와주세요', author: '수학 고민러', likes: 34, comments: 17, date: '2025.12.29 12:15' },
        { id: 2, title: '한국사 정리 노트 공유', content: '시대별 요점 정리본 업로드합니다.', author: '역사 덕후', likes: 24, comments: 9, date: '2025.11.10 09:00' }
    ];

    return (
        <div id="community-data-view">
            <div className="community-title-section">
                <h2>Data Sharing</h2>
                <p>자료를 공유하고 받아가세요.</p>
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

export default DataSharing;
