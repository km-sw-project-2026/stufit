import React, { useEffect, useState } from 'react';

function EditPostModal({ post, onClose = () => {}, onSubmit = () => {} }) {
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');

    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // post가 변경되면 값 업데이트
    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
        }
    }, [post]);

    const handleSubmit = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const updatedPost = {
            ...post,
            title: title.trim(),
            content: content.trim()
        };

        onSubmit(updatedPost);
    };

    return (
        <div id="edit-post-modal" className="popup-modal" style={{position: 'fixed', inset: 0, zIndex: 60}}>
            <div
                className="popup-overlay"
                onClick={onClose}
                style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(128,128,128,0.5)', zIndex: 60}}
                role="presentation"
            />

            <div
                className="popup-content notice-board-popup"
                onClick={(e) => e.stopPropagation()}
                style={{position: 'relative', zIndex: 61}}
                role="dialog"
                aria-modal="true"
            >
                <h2 className="notice-board-title">notice board</h2>

                <div className="notice-form-group row">
                    <label>제목</label>
                    <input 
                        type="text" 
                        className="notice-input" 
                        placeholder="예: 제목 작성하기" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="notice-form-group row top-align">
                    <label>내용</label>
                    <textarea 
                        className="notice-textarea" 
                        placeholder="예: 내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

                <button className="notice-submit-btn" onClick={handleSubmit}>글 작성하기</button>
            </div>
        </div>
    );
};

export default EditPostModal;
