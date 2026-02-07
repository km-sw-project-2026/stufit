import React, { useState, useEffect } from 'react';

function MyPost({ posts = [], onOpenPost, onNewPost }) {
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
    
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

    useEffect(() => {
        // 시연용: 실제 앱에서는 /api/posts를 호출해 목록을 불러옵니다.
        // fetch('/api/posts').then(r => r.json()).then(data => setPosts(data));
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (!username) return alert('로그인이 필요합니다.');
        if (!confirm('정말 삭제하시겠습니까?')) return;
        
        // 로컬 상태에서만 삭제 (서버 연동 시 API 호출 추가)
        alert('삭제 기능은 서버 연동 후 사용 가능합니다.');
    };

    const handleEdit = (e, post) => {
        e.stopPropagation();
        if (!username) return alert('로그인이 필요합니다.');

        const newTitle = prompt('제목을 수정하세요', post.title);
        if (newTitle === null) return;
        const newContent = prompt('내용을 수정하세요', post.content);
        if (newContent === null) return;

        // 로컬 상태에서만 수정 (서버 연동 시 API 호출 추가)
        alert('수정 기능은 서버 연동 후 사용 가능합니다.');
    };

    return (
        <div id="community-mypost-view">
            <div className="community-title-section">
                <h2>My Posts</h2>
                <p>내가 작성한 글을 확인하세요.</p>
            </div>
            <div className="community-board-container">
                <div className="community-feed">
                    {posts.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '100px 20px',
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            <div style={{ fontSize: '80px', marginBottom: '20px' }}>😢</div>
                            <p style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                                아직 작성한 글이 없어요 ㅠ_ㅠ
                            </p>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                New Post 버튼을 눌러 새 글을 작성해보세요!
                            </p>
                        </div>
                    ) : (
                        posts.map((p) => {
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
                                    <div className="feed-actions">
                                        <button className="btn-edit" onClick={(e) => handleEdit(e, p)}>수정하기</button>
                                        <button className="btn-delete" onClick={(e) => handleDelete(e, p.id)}>삭제하기</button>
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

export default MyPost;
