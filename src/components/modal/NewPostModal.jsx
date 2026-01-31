function NewPostModal() {
    return (
        <div id="new-post-modal" className="popup-modal hidden">
            <div className="popup-overlay w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 z-50"></div>
            <div className="popup-content notice-board-popup">
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