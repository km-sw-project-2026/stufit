import React, { useEffect } from 'react';

function NewPostModal({ onClose = () => {} }) {
    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div id="new-post-modal" className="popup-modal" style={{position: 'fixed', inset: 0, zIndex: 60}}>
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
                    <input type="text" className="notice-input" placeholder="예: 제목 작성하기" />
                </div>

                <div className="notice-form-group row top-align">
                    <label>내용</label>
                    <textarea className="notice-textarea" placeholder="예: 내용을 입력하세요"></textarea>
                </div>

                <button className="notice-submit-btn">글 작성하기</button>
            </div>
        </div>
    );
};

export default NewPostModal;