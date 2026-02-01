import React, { useEffect, useState } from 'react';

function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleString();
}

function PostDetailView({ post, onClose }) {
    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const [postState, setPostState] = useState(post || {});
    const [comments, setComments] = useState(post?.commentList || []);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setPostState(post || {});
        setComments(post?.commentList || []);
    }, [post]);

    const handleAddComment = () => {
        const text = newComment && newComment.trim();
        if (!text) return;
        const c = {
            id: Date.now(),
            author: '나',
            text,
            date: new Date().toISOString(),
            likes: 0
        };
        setComments((s) => [...s, c]);
        setNewComment('');
        // update comment count display
        setPostState((p) => ({ ...p, comments: (p.comments || 0) + 1 }));
    };

    const handleLikeComment = (id) => {
        setComments((list) => list.map((c) => c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c));
    };

    return (
        <div id="post-detail-view" className="post-detail-view">
            <div className="post-detail-board">
                <div className="pd-header">
                    <div className="pd-header-top" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                        <h2 className="pd-title" style={{margin: 0, fontSize: '32px', fontWeight: 700, color: '#000'}}>{postState?.title || '제목'}</h2>
                        <button className="close-detail-text-btn" style={{background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer'}} onClick={onClose}>×</button>
                    </div>

                    <div className="pd-meta-row" style={{border: 'none', padding: 0}}>
                        <div className="pd-user-info">
                            <div className="pd-avatar"></div>
                            <div className="pd-user-text">
                                <span className="pd-username">{postState?.author || '작성자'}</span>
                                <span className="pd-date-view">{postState?.date || ''} 조회수 0</span>
                            </div>
                        </div>
                        <div className="pd-actions">
                            <button className="pd-btn edit hidden">수정하기</button>
                            <button className="pd-btn delete hidden">삭제하기</button>
                            <div className="pd-stats">
                                <span className="pd-like">♡ {postState?.likes ?? 0}</span>
                                <span className="pd-comment">💬 {postState?.comments ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pd-divider" style={{height: '1px', background: '#eee', margin: '30px 0'}}></div>

                <div className="pd-body">
                    <div className="pd-content">{postState?.content || '내용'}</div>
                </div>

                <div className="pd-divider" style={{height: '1px', background: '#eee', margin: '40px 0'}}></div>

                <div className="pd-comments-section">
                    <div className="comment-input-area">
                        <input value={newComment} onChange={(e) => setNewComment(e.target.value)} type="text" placeholder="댓글 추가..." className="comment-input" />
                        <button className="comment-submit-btn" onClick={handleAddComment}>등록</button>
                    </div>

                    <div className="comments-list">
                        {comments.map((c) => (
                            <div key={c.id} className="comment-item">
                                <div className="comment-avatar" aria-hidden />
                                <div className="comment-body">
                                    <div className="comment-meta"><span className="comment-author">{c.author}</span><span className="comment-date">{formatDate(c.date)}</span></div>
                                    <div className="comment-text">{c.text}</div>
                                </div>
                                <div className="comment-actions">
                                    <button className="comment-like" onClick={() => handleLikeComment(c.id)}>♡ <span className="like-count">{c.likes ?? 0}</span></button>
                                    <button className="comment-menu">⋯</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetailView;
