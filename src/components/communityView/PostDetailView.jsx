import React, { useEffect, useState } from 'react';
import CustomAlertModal from '../modal/CustomAlertModal';
import CustomConfirmModal from '../modal/CustomConfirmModal';
import EditPostModal from '../modal/EditPostModal';

function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleString();
}

function PostDetailView({ post, onClose, onDeletePost, onEditPost }) {
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
    const [showEditModal, setShowEditModal] = useState(false);

    const username = localStorage.getItem('username') || '익명';
    const isMyPost = postState?.author === username;

    // 댓글 localStorage에서 불러오기
    const loadCommentsFromStorage = (postId) => {
        try {
            const savedComments = localStorage.getItem(`comments_${postId}`);
            if (savedComments) {
                return JSON.parse(savedComments);
            }
        } catch (error) {
            console.error('댓글 불러오기 실패:', error);
        }
        return post?.commentList || [];
    };

    const [comments, setComments] = useState(loadCommentsFromStorage(post?.id));

    useEffect(() => {
        setPostState(post || {});
        setComments(loadCommentsFromStorage(post?.id));
    }, [post]);

    // 댓글이 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (post?.id && comments.length > 0) {
            try {
                localStorage.setItem(`comments_${post.id}`, JSON.stringify(comments));
            } catch (error) {
                console.error('댓글 저장 실패:', error);
            }
        }
    }, [comments, post?.id]);

    const handleAddComment = () => {
        const text = newComment && newComment.trim();
        if (!text) return;
        const c = {
            id: Date.now(),
            author: username,
            text,
            date: new Date().toISOString(),
            likes: 0,
            liked: false
        };
        setComments((s) => [...s, c]);
        setNewComment('');
        
        // 댓글 수 증가
        const newCommentCount = (postState?.comments || 0) + 1;
        const updatedPost = { ...postState, comments: newCommentCount };
        setPostState(updatedPost);
        
        // 부모 컴포넌트에도 업데이트
        if (onEditPost) {
            onEditPost(updatedPost);
        }
    };

    const handleLikePost = () => {
        const isLiked = postState.liked || false;
        const updatedPost = {
            ...postState,
            liked: !isLiked,
            likes: isLiked ? (postState.likes || 1) - 1 : (postState.likes || 0) + 1
        };
        setPostState(updatedPost);
        
        if (onEditPost) {
            onEditPost(updatedPost);
        }
    };

    const handleLikeComment = (id) => {
        setComments((list) => list.map((c) => {
            if (c.id === id) {
                const isLiked = c.liked || false;
                return {
                    ...c,
                    liked: !isLiked,
                    likes: isLiked ? (c.likes || 1) - 1 : (c.likes || 0) + 1
                };
            }
            return c;
        }));
    };

    const handleEditComment = (commentId) => {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const newText = prompt('댓글을 수정하세요', comment.text);
        if (newText === null || newText.trim() === '') return;
        
        setComments(list => list.map(c => 
            c.id === commentId ? { ...c, text: newText.trim() } : c
        ));
        setShowCommentMenu(null);
        setAlertModal({ show: true, message: '댓글이 수정되었습니다.' });
    };

    const handleDeleteComment = (commentId) => {
        setShowCommentMenu(null);
        setConfirmModal({
            show: true,
            message: '댓글을 삭제하시겠습니까?',
            onConfirm: () => {
                setComments(list => list.filter(c => c.id !== commentId));
                setPostState(p => ({ ...p, comments: (p.comments || 1) - 1 }));
                setConfirmModal({ show: false, message: '', onConfirm: null });
                setAlertModal({ show: true, message: '댓글이 삭제되었습니다.' });
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
