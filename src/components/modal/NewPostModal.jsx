// ----------------원래 쓰던 코드

// import React, { useEffect, useState } from 'react';

// function NewPostModal({ category = 'popular', onClose = () => {}, onSubmit = () => {} }) {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');

//     // ESC 키로 닫기
//     useEffect(() => {
//         const handler = (e) => {
//             if (e.key === 'Escape') onClose();
//         };
//         document.addEventListener('keydown', handler);
//         return () => document.removeEventListener('keydown', handler);
//     }, [onClose]);

//     const handleSubmit = () => {
//         if (!title.trim()) {
//             alert('제목을 입력해주세요.');
//             return;
//         }
//         if (!content.trim()) {
//             alert('내용을 입력해주세요.');
//             return;
//         }

//         const newPost = {
//             title: title.trim(),
//             content: content.trim(),
//             category: category
//         };

//         onSubmit(newPost);
//         setTitle('');
//         setContent('');
//     };

//     return (
//         <div id="new-post-modal" className="popup-modal" style={{position: 'fixed', inset: 0, zIndex: 60}}>
//             <div
//                 className="popup-overlay"
//                 onClick={onClose}
//                 style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(128,128,128,0.5)', zIndex: 60}}
//                 role="presentation"
//             />

//             <div
//                 className="popup-content notice-board-popup"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{position: 'relative', zIndex: 61}}
//                 role="dialog"
//                 aria-modal="true"
//             >
//                 <h2 className="notice-board-title">Notice Board</h2>

//                 <div className="notice-form-group row">
//                     <label>제목</label>
//                     <input 
//                         type="text" 
//                         className="notice-input" 
//                         placeholder="예: 제목 작성하기" 
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                     />
//                 </div>

//                 <div className="notice-form-group row top-align">
//                     <label>내용</label>
//                     <textarea 
//                         className="notice-textarea" 
//                         placeholder="예: 내용을 입력하세요"
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                     ></textarea>
//                 </div>

//                 <button className="notice-submit-btn" onClick={handleSubmit}>글 작성하기</button>
//             </div>
//         </div>
//     );
// };

// export default NewPostModal;


// ---------------------------------밑에 수정 코드


import React, { useEffect, useState } from 'react';

// category 기본값을 'data' 혹은 일반 카테고리로 설정하여, 
// 처음부터 인기글에 등록되지 않고 좋아요를 통해 승격되도록 합니다.
function NewPostModal({ category = 'data', onClose = () => {}, onSubmit = () => {} }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // ESC 키로 닫기
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleSubmit = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const newPost = {
            title: title.trim(),
            content: content.trim(),
            category: category // 부모(Community.jsx)에서 전달받은 현재 탭 카테고리 사용
        };

        onSubmit(newPost);
        setTitle('');
        setContent('');
    };

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
                {/* 디자인 유지를 위해 클래스명 보존 */}
                <h2 className="notice-board-title">Notice Board</h2>

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

export default NewPostModal;