import React, { useState, useEffect } from 'react';

function MyPost({ onOpenPost, onNewPost }) {
    const [posts, setPosts] = useState([
        { id: 31, title: '내 게시글 1', content: '내가 쓴 내용입니다.', author: '나', likes: 2, comments: 0, date: '2025.09.01' }
    ]);

    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

    useEffect(() => {
        // 시연용: 실제 앱에서는 /api/posts를 호출해 목록을 불러옵니다.
        // fetch('/api/posts').then(r => r.json()).then(data => setPosts(data));
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!username) return alert('로그인이 필요합니다.');
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/post/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                }
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data && data.success) {
                setPosts(prev => prev.filter(p => p.id !== id));
            } else {
                alert((data && data.message) || '삭제 실패');
            }
        } catch (err) {
            console.error(err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleEdit = async (e, post) => {
        e.stopPropagation();
        if (!username) return alert('로그인이 필요합니다.');

        const newTitle = prompt('제목을 수정하세요', post.title);
        if (newTitle === null) return; // 취소
        const newContent = prompt('내용을 수정하세요', post.content);
        if (newContent === null) return;

        try {
            const res = await fetch(`/api/post/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                body: JSON.stringify({ title: newTitle, content: newContent })
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data && data.success) {
                setPosts(prev => prev.map(p => p.id === post.id ? { ...p, title: newTitle, content: newContent } : p));
            } else {
                alert((data && data.message) || '수정 실패');
            }
        } catch (err) {
            console.error(err);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div id="community-mypost-view">
            <div className="community-title-section">
                <h2>My Posts</h2>
                <p>내가 작성한 글을 확인하세요.</p>
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
                            <div className="feed-actions">
                                <button className="btn-edit" onClick={(e) => handleEdit(e, p)}>수정하기</button>
                                <button className="btn-delete" onClick={(e) => handleDelete(e, p.id)}>삭제하기</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyPost;
