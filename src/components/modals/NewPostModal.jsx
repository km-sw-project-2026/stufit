import { useState } from 'react';

function NewPostModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log('Post created:', { title, content });
    onClose();
  };

  return (
    <div className="popup-modal">
      <div className="popup-overlay" style={{ width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, zIndex: 50 }}></div>
      <div className="popup-content notice-board-popup">
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
}

export default NewPostModal;
