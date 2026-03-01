// ---------------------원래 쓰던 코드

import React, { useEffect, useState } from 'react';
import CustomAlertModal from '../modal/CustomAlertModal';
import CustomConfirmModal from '../modal/CustomConfirmModal';
import CustomPromptModal from '../modal/CustomPromptModal';
import EditPostModal from '../modal/EditPostModal';

function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleString();
}

function PostDetailView({ post, onClose, onDeletePost, onEditPost, onUpdatePostState }) {
    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const [postState, setPostState] = useState(post || {});
    const [newComment, setNewComment] = useState('');
    const [showCommentMenu, setShowCommentMenu] = useState(null);
    const [alertModal, setAlertModal] = useState({ show: false, message: '' });
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });
    const [promptModal, setPromptModal] = useState({ show: false, title: '', initialValue: '', onSubmit: null });
    const [showEditModal, setShowEditModal] = useState(false);

    const username = localStorage.getItem('username') || '익명';
    const isMyPost = postState?.author === username;

    // localStorage 좋아요 캐시 헬퍼
    const getLikedCacheKey = (u) => `likedPosts_${u}`;
    const getLocalLikedIds = (u) => {
        if (!u) return new Set();
        try {
            const raw = localStorage.getItem(getLikedCacheKey(u));
            return new Set(raw ? JSON.parse(raw) : []);
        } catch { return new Set(); }
    };
    const updateLocalLikedId = (u, id, liked) => {
        if (!u) return;
        const set = getLocalLikedIds(u);
        if (liked) set.add(id);
        else set.delete(id);
        localStorage.setItem(getLikedCacheKey(u), JSON.stringify([...set]));
    };

    const mapComment = (row) => ({
        id: row.comment_id,
        author: row.username || '익명',
        text: row.content,
        date: row.created_at,
        likes: Number(row.like_count) || 0,
        liked: Boolean(row.user_liked)
    });

    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!post) return;
        const localLiked = getLocalLikedIds(username);
        // 서버 응답 또는 로컬 캐시 중 하나라도 liked면 true
        setPostState({
            ...post,
            liked: Boolean(post.liked) || localLiked.has(post.id)
        });
        if (!post?.id) return;

        const fetchComments = async () => {
            try {
                const headers = {};
                if (username) headers['X-Username'] = encodeURIComponent(username);
                const response = await fetch(`/api/post/${post.id}/comments`, { headers });
                if (!response.ok) return;
                const payload = await response.json();
                const list = (payload.data || []).map(mapComment);
                setComments(list);
            } catch (error) {
                console.error('댓글 불러오기 실패:', error);
            }
        };

        fetchComments();
    }, [post, username]);

    const handleAddComment = async () => {
        const text = newComment && newComment.trim();
        if (!text) return;

        if (!post?.id) return;
        try {
            const response = await fetch(`/api/post/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': encodeURIComponent(username)
                },
                body: JSON.stringify({ content: text })
            });

            const payload = await response.json();
            if (!response.ok) {
                alert(payload.message || '댓글 작성에 실패했습니다.');
                return;
            }

            const created = payload.data ? mapComment(payload.data) : null;
            if (created) {
                setComments((s) => [...s, created]);
            }
            setNewComment('');

            const newCommentCount = (postState?.comments || 0) + 1;
            const updatedPost = { ...postState, comments: newCommentCount };
            setPostState(updatedPost);
            if (onUpdatePostState) onUpdatePostState(updatedPost);
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const handleLikePost = async () => {
        if (!post?.id) return;
        try {
            const response = await fetch(`/api/post/${post.id}/like`, {
                method: 'POST',
                headers: { 'X-Username': encodeURIComponent(username) }
            });
            const payload = await response.json();
            if (!response.ok) {
                alert(payload.message || '좋아요 처리에 실패했습니다.');
                return;
            }

            const updatedPost = {
                ...postState,
                liked: Boolean(payload.data?.liked),
                likes: Number(payload.data?.count) || 0
            };
            // localStorage 캐시 업데이트 (새로고침 후에도 유지)
            updateLocalLikedId(username, post.id, Boolean(payload.data?.liked));
            setPostState(updatedPost);
            if (onUpdatePostState) onUpdatePostState(updatedPost);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    const handleLikeComment = async (id) => {
        try {
            const response = await fetch(`/api/comment/${id}/like`, {
                method: 'POST',
                headers: { 'X-Username': encodeURIComponent(username) }
            });
            const payload = await response.json();
            if (!response.ok) {
                alert(payload.message || '좋아요 처리에 실패했습니다.');
                return;
            }

            setComments((list) => list.map((c) => {
                if (c.id === id) {
                    return {
                        ...c,
                        liked: Boolean(payload.data?.liked),
                        likes: Number(payload.data?.count) || 0
                    };
                }
                return c;
            }));
        } catch (error) {
            console.error('댓글 좋아요 실패:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    const handleEditComment = (commentId) => {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;
        
        setShowCommentMenu(null);
        setPromptModal({
            show: true,
            title: '댓글 수정',
            initialValue: comment.text,
            onSubmit: async (newText) => {
                try {
                    const response = await fetch(`/api/comment/${commentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Username': encodeURIComponent(username)
                        },
                        body: JSON.stringify({ content: newText })
                    });

                    const payload = await response.json();
                    if (!response.ok) {
                        alert(payload.message || '댓글 수정에 실패했습니다.');
                        return;
                    }

                    const updated = payload.data ? mapComment(payload.data) : { ...comment, text: newText };
                    setComments(list => list.map(c => 
                        c.id === commentId ? { ...c, ...updated } : c
                    ));
                    setAlertModal({ show: true, message: '댓글이 수정되었습니다.' });
                } catch (error) {
                    console.error('댓글 수정 실패:', error);
                    alert('댓글 수정에 실패했습니다.');
                }
            }
        });
    };

    const handleDeleteComment = (commentId) => {
        setShowCommentMenu(null);
        setConfirmModal({
            show: true,
            message: '댓글을 삭제하시겠습니까?',
            onConfirm: () => {
                (async () => {
                    try {
                        const response = await fetch(`/api/comment/${commentId}`, {
                            method: 'DELETE',
                            headers: { 'X-Username': encodeURIComponent(username) }
                        });
                        const payload = await response.json();
                        if (!response.ok) {
                            alert(payload.message || '댓글 삭제에 실패했습니다.');
                            return;
                        }

                        setComments(list => list.filter(c => c.id !== commentId));
                        const updated = { ...postState, comments: (postState?.comments || 1) - 1 };
                        setPostState(updated);
                        if (onUpdatePostState) onUpdatePostState(updated);
                        setConfirmModal({ show: false, message: '', onConfirm: null });
                        setAlertModal({ show: true, message: '댓글이 삭제되었습니다.' });
                    } catch (error) {
                        console.error('댓글 삭제 실패:', error);
                        alert('댓글 삭제에 실패했습니다.');
                    }
                })();
            }
        });
    };

    const handleEditPost = () => {
        setShowEditModal(true);
    };

    const handleEditSubmit = (updatedPost) => {
        setPostState(updatedPost);
        
        if (onEditPost) {
            onEditPost(updatedPost);
        }
        
        setShowEditModal(false);
        setAlertModal({ show: true, message: '게시글이 수정되었습니다.' });
    };

    const handleDeletePost = () => {
        setConfirmModal({
            show: true,
            message: '게시글을 삭제하시겠습니까?',
            onConfirm: () => {
                setConfirmModal({ show: false, message: '', onConfirm: null });
                setAlertModal({ 
                    show: true, 
                    message: '게시글이 삭제되었습니다.',
                });
                
                setTimeout(() => {
                    if (onDeletePost) {
                        onDeletePost(postState.id);
                    }
                    onClose();
                }, 1000);
            }
        });
    };

    // 댓글 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showCommentMenu && !e.target.closest('.comment-menu-container')) {
                setShowCommentMenu(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showCommentMenu]);

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
                            <button 
                                className={`pd-btn edit ${isMyPost ? '' : 'hidden'}`}
                                onClick={handleEditPost}
                            >
                                수정하기
                            </button>
                            <button 
                                className={`pd-btn delete ${isMyPost ? '' : 'hidden'}`}
                                onClick={handleDeletePost}
                            >
                                삭제하기
                            </button>
                            <div className="pd-stats">
                                <button 
                                    className={`pd-like-btn ${postState?.liked ? 'liked' : ''}`}
                                    onClick={handleLikePost}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px',
                                        fontSize: '18px',
                                        color: postState?.liked ? '#ff4444' : '#333',
                                        fontWeight: '700',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <span>{postState?.liked ? '♥' : '♡'}</span>
                                    <span>{postState?.likes ?? 0}</span>
                                </button>
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
                                <div className="comment-content-wrapper">
                                    <div className="comment-top-row">
                                        <div className="comment-user-section">
                                            <span className="comment-author">{c.author}</span>
                                            <span className="comment-date">{formatDate(c.date)}</span>
                                        </div>
                                        <span className="comment-divider">|</span>
                                        <div className="comment-text">{c.text}</div>
                                    </div>
                                    <div className="comment-actions-right">
                                        <button 
                                            className={`comment-like-btn ${c.liked ? 'liked' : ''}`}
                                            onClick={() => handleLikeComment(c.id)}
                                        >
                                            <span className="heart-icon">{c.liked ? '♥' : '♡'}</span>
                                            <span className="like-count">{c.likes ?? 0}</span>
                                        </button>
                                        {c.author === username && (
                                            <div className="comment-menu-container">
                                                <button 
                                                    className="comment-menu-btn" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowCommentMenu(showCommentMenu === c.id ? null : c.id);
                                                    }}
                                                >
                                                    ⋮
                                                </button>
                                                {showCommentMenu === c.id && (
                                                    <div className="comment-dropdown-menu">
                                                        <button
                                                            className="comment-menu-item"
                                                            onClick={() => handleEditComment(c.id)}
                                                        >
                                                            수정
                                                        </button>
                                                        <button
                                                            className="comment-menu-item delete"
                                                            onClick={() => handleDeleteComment(c.id)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {alertModal.show && (
                <CustomAlertModal 
                    message={alertModal.message} 
                    onClose={() => setAlertModal({ show: false, message: '' })} 
                />
            )}
            
            {confirmModal.show && (
                <CustomConfirmModal
                    message={confirmModal.message}
                    onConfirm={confirmModal.onConfirm}
                    onCancel={() => setConfirmModal({ show: false, message: '', onConfirm: null })}
                />
            )}

            {promptModal.show && (
                <CustomPromptModal
                    isOpen={promptModal.show}
                    title={promptModal.title}
                    initialValue={promptModal.initialValue}
                    placeholder="댓글 내용을 입력하세요"
                    onSubmit={promptModal.onSubmit}
                    onClose={() => setPromptModal({ show: false, title: '', initialValue: '', onSubmit: null })}
                    multiline={true}
                />
            )}

            {showEditModal && (
                <EditPostModal
                    post={postState}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
}

export default PostDetailView;

